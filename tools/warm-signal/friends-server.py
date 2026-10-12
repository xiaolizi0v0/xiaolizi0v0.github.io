"""Optional Warm Signal friends service. Python stdlib only; loopback by default."""
import argparse
from contextlib import contextmanager
import hashlib
import json
import math
import os
from pathlib import Path
import re
import secrets
import sqlite3
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlsplit

DAY = 86400000
CAP, DAILY, ENERGY, TTL = 99, 20, 3, 3 * DAY
SCOPES = {'friends', 'all', 'private'}
SP_IDS = {9, 21, 33, 45, 57, 69, 90, 91, 92, 93, 94, 95}


class Problem(Exception):
    def __init__(self, text, status=400):
        self.text, self.status = text, status


def check(condition, text, status=400):
    if not condition:
        raise Problem(text, status)


def profile(data):
    name = data.get('name')
    check(isinstance(name, str) and 0 < len(name.strip()) <= 16 and
          not any(ord(c) < 32 for c in name), '名字需为1～16个可见字符')
    result = {'name': name.strip()}
    for key, limit in [('level', 1000000), ('cards', 108), ('avatar', 5)]:
        value = data.get(key)
        check(type(value) is int and 0 <= value <= limit and
              (key != 'level' or value > 0), '制作人资料不正确')
        result[key] = value
    return result


def exact(value, names):
    return type(value) is dict and set(value) == set(names.split())


def integer(value, low, high):
    return type(value) is int and low <= value <= high


def number(value, low, high):
    return type(value) in (int, float) and low <= value <= high and math.isfinite(value)


def showcase_valid(p):
    """Whitelist data only: no uploaded HTML, URLs, CSS or arbitrary objects."""
    if not exact(p, 'version signature album power useDIY design art') or not integer(p['version'], 1, 1):
        return False
    if not isinstance(p['signature'], str) or len(p['signature'].encode('utf-16-le', errors='surrogatepass')) // 2 > 40 or any(ord(c) < 32 or ord(c) == 127 or 0xD800 <= ord(c) <= 0xDFFF for c in p['signature']):
        return False
    if type(p['album']) is not list or len(p['album']) > 4 or not all(integer(n, 0, 107) for n in p['album']) or len(set(p['album'])) != len(p['album']):
        return False
    if type(p['power']) is not list or len(p['power']) != 4 or not all(integer(n, 0, 100000000) for n in p['power']):
        return False
    if type(p['useDIY']) is not bool or p['useDIY'] != (p['design'] is not None):
        return False
    ids = set(p['album'])
    d = p['design']
    if d is not None:
        if not exact(d, 'p theme board frames lights decor') or not integer(d['p'], 0, 5) or not integer(d['theme'], 0, 2) or not integer(d['board'], 0, 2):
            return False
        layers = []
        fields = 'x y scale angle flip layer'
        for kind, maximum in [('frames', 5), ('lights', 5), ('decor', 30)]:
            items = d[kind]
            if type(items) is not list or len(items) > maximum:
                return False
            for item in items:
                extra = {'frames': 'cardId style crop', 'lights': 'type opacity', 'decor': 'icon'}[kind]
                if not exact(item, fields + ' ' + extra) or not number(item['x'], 0, 100) or not number(item['y'], 0, 100) or not number(item['scale'], .35, 1.8) or not number(item['angle'], -180, 180) or type(item['flip']) is not bool or not integer(item['layer'], 0, 39):
                    return False
                layers.append(item['layer'])
                if kind == 'frames':
                    if not integer(item['cardId'], 0, 107) or not integer(item['style'], 0, 3):
                        return False
                    crop = item['crop']
                    if not exact(crop, 'x y zoom') or not number(crop['x'], -50, 50) or not number(crop['y'], -50, 50) or not number(crop['zoom'], 1, 3):
                        return False
                    ids.add(item['cardId'])
                elif kind == 'lights':
                    if not integer(item['type'], 0, 3) or not number(item['opacity'], .1, 1):
                        return False
                elif item['icon'] not in ['✿', '♡', '✦', '☾', '✉', 'leaf', 'bow', 'camera']:
                    return False
        if len(set(layers)) != len(layers):
            return False
    if type(p['art']) is not list or len(p['art']) != len(ids) or len(p['art']) > 9:
        return False
    art_ids = []
    for a in p['art']:
        if not exact(a, 'id display variant') or not integer(a['id'], 0, 107) or not integer(a['display'], 0, 4) or a['display'] not in (0, 2, 4) or not integer(a['variant'], 0, 1):
            return False
        if a['display'] and a['id'] not in SP_IDS or not a['display'] and a['variant'] != 0:
            return False
        art_ids.append(a['id'])
    return len(set(art_ids)) == len(art_ids) and set(art_ids) == ids


class Friends:
    def __init__(self, filename, clock=None):
        self.filename, self.clock = str(filename), clock or (lambda: int(time.time() * 1000))
        with self.connect() as db:
            db.executescript('''
            CREATE TABLE IF NOT EXISTS meta(key TEXT PRIMARY KEY, value TEXT NOT NULL);
            CREATE TABLE IF NOT EXISTS players(id TEXT PRIMARY KEY, token TEXT UNIQUE NOT NULL,
              name TEXT NOT NULL, level INTEGER NOT NULL, cards INTEGER NOT NULL,
              avatar INTEGER NOT NULL, receive INTEGER NOT NULL DEFAULT 1,
              seen INTEGER NOT NULL, earned INTEGER NOT NULL DEFAULT 0);
            CREATE TABLE IF NOT EXISTS links(a TEXT NOT NULL, b TEXT NOT NULL,
              PRIMARY KEY(a,b));
            CREATE TABLE IF NOT EXISTS requests(sender TEXT NOT NULL, recipient TEXT NOT NULL,
              at INTEGER NOT NULL, PRIMARY KEY(sender,recipient));
            CREATE TABLE IF NOT EXISTS gifts(id INTEGER PRIMARY KEY AUTOINCREMENT,
              sender TEXT NOT NULL, recipient TEXT NOT NULL, day INTEGER NOT NULL,
              at INTEGER NOT NULL, claimed INTEGER,
              UNIQUE(sender,recipient,day));
            CREATE INDEX IF NOT EXISTS inbox ON gifts(recipient,claimed,at);
            CREATE TABLE IF NOT EXISTS showcases(owner TEXT PRIMARY KEY, payload TEXT,
              scope TEXT NOT NULL, revision INTEGER NOT NULL, updated INTEGER NOT NULL);
            ''')
            db.execute('INSERT OR IGNORE INTO meta VALUES(?,?)', ('server', secrets.token_hex(16)))
            db.execute('INSERT OR IGNORE INTO meta VALUES(?,?)', ('time', '0'))

    @contextmanager
    def connect(self):
        db = sqlite3.connect(self.filename, timeout=10)
        db.row_factory = sqlite3.Row
        try:
            with db:
                yield db
        finally:
            db.close()

    @staticmethod
    def public(p):
        return {k: p[k] for k in ['id', 'name', 'level', 'cards', 'avatar', 'seen']}

    @staticmethod
    def count(db, who):
        return db.execute('SELECT count(*) FROM links WHERE a=?', (who,)).fetchone()[0]

    def run(self, path, data=None, token=''):
        data = {} if data is None else data
        check(type(data) is dict, '请求格式不正确')
        with self.connect() as db:
            db.execute('BEGIN IMMEDIATE')
            now = max(self.clock(), int(db.execute("SELECT value FROM meta WHERE key='time'").fetchone()[0]))
            db.execute("UPDATE meta SET value=? WHERE key='time'", (str(now),))
            server = db.execute("SELECT value FROM meta WHERE key='server'").fetchone()[0]
            day = (now + 3 * 3600000) // DAY  # Shanghai 05:00
            if path == '/health':
                return {'ok': True, 'protocol': 1, 'server': server}
            if path == '/register':
                p = profile(data)
                check(db.execute('SELECT count(*) FROM players').fetchone()[0] < 10000, '本服务玩家数已达上限')
                while True:
                    who = str(secrets.randbelow(90000000) + 10000000)
                    if not db.execute('SELECT 1 FROM players WHERE id=?', (who,)).fetchone():
                        break
                key = secrets.token_urlsafe(32)
                db.execute('INSERT INTO players(id,token,name,level,cards,avatar,seen) VALUES(?,?,?,?,?,?,?)',
                           (who, hashlib.sha256(key.encode()).hexdigest(), p['name'], p['level'], p['cards'], p['avatar'], now))
                return {'ok': True, 'server': server, 'account': who, 'token': key}
            check(isinstance(token, str) and 20 <= len(token) <= 100, '请先连接好友服务', 401)
            me = db.execute('SELECT * FROM players WHERE token=?', (hashlib.sha256(token.encode()).hexdigest(),)).fetchone()
            check(me is not None, '好友身份已失效，请检查服务地址', 401)
            who = me['id']
            db.execute('UPDATE players SET seen=? WHERE id=?', (now, who))
            # Old unclaimed gifts and old requests have no effect after expiry.
            db.execute('DELETE FROM gifts WHERE claimed IS NULL AND at<=?', (now - TTL,))
            db.execute('DELETE FROM gifts WHERE claimed IS NOT NULL AND at<=? AND day<?', (now - TTL, day))
            db.execute('DELETE FROM requests WHERE at<=?', (now - 7 * DAY,))
            if path == '/profile':
                p = profile(data)
                db.execute('UPDATE players SET name=?,level=?,cards=?,avatar=? WHERE id=?',
                           (p['name'], p['level'], p['cards'], p['avatar'], who))
            elif path == '/space':
                target = data.get('target')
                check(isinstance(target, str) and re.fullmatch(r'[0-9]{8}', target), '制作人ID不正确')
                player = db.execute('SELECT * FROM players WHERE id=?', (target,)).fetchone()
                check(player is not None, '没有找到这位制作人')
                row = db.execute('SELECT * FROM showcases WHERE owner=?', (target,)).fetchone()
                allowed = row and row['payload'] and (target == who or row['scope'] == 'all' or row['scope'] == 'friends' and db.execute('SELECT 1 FROM links WHERE a=? AND b=?', (who, target)).fetchone())
                space = dict(revision=row['revision'], updated=row['updated'], scope=row['scope'], payload=json.loads(row['payload'])) if allowed else None
                return {'ok': True, 'server': server, 'account': who, 'now': now, 'profile': self.public(player), 'space': space}
            elif path in ['/space-publish', '/space-withdraw']:
                row = db.execute('SELECT * FROM showcases WHERE owner=?', (who,)).fetchone()
                revision = row['revision'] if row else 0
                check(integer(data.get('revision'), 0, 1000000000), '作品版本不正确')
                check(data['revision'] == revision, '作品已更新，请刷新后重新操作', 409)
                check(revision < 1000000000, '作品更新次数已达上限')
                if path == '/space-publish':
                    check(exact(data, 'revision scope payload') and isinstance(data['scope'], str) and data['scope'] in SCOPES and showcase_valid(data['payload']), '个人展示数据不正确')
                    content = json.dumps(data['payload'], ensure_ascii=False, allow_nan=False)
                    scope = data['scope']
                else:
                    check(exact(data, 'revision'), '撤回参数不正确')
                    content, scope = None, 'private'
                db.execute('INSERT INTO showcases VALUES(?,?,?,?,?) ON CONFLICT(owner) DO UPDATE SET payload=excluded.payload, scope=excluded.scope, revision=excluded.revision, updated=excluded.updated', (who, content, scope, revision + 1, now))
            elif path in ['/search', '/recommend']:
                query = data.get('query')
                if path == '/search':
                    check(isinstance(query, str) and 0 < len(query.strip()) <= 16, '输入完整好友ID或名字')
                    rows = db.execute('SELECT * FROM players WHERE (id=? OR name=?) AND id!=? ORDER BY seen DESC LIMIT 20',
                                      (query.strip(), query.strip(), who)).fetchall()
                else:
                    rows = db.execute('SELECT * FROM players WHERE id!=? AND id NOT IN (SELECT b FROM links WHERE a=?) ORDER BY RANDOM() LIMIT 20', (who, who)).fetchall()
                return {'ok': True, 'players': [dict(self.public(p), friend=bool(db.execute('SELECT 1 FROM links WHERE a=? AND b=?', (who, p['id'])).fetchone()), pending=bool(db.execute('SELECT 1 FROM requests WHERE sender=? AND recipient=?', (who, p['id'])).fetchone())) for p in rows]}
            elif path == '/request':
                target = self.target(db, data, who)
                check(self.count(db, who) < CAP and self.count(db, target) < CAP, '好友数量已达99人')
                check(not db.execute('SELECT 1 FROM links WHERE a=? AND b=?', (who, target)).fetchone(), '已经是好友')
                check(not db.execute('SELECT 1 FROM requests WHERE sender=? AND recipient=?', (target, who)).fetchone(), '对方已申请，请到申请列表处理')
                check(db.execute('SELECT count(*) FROM requests WHERE sender=? OR recipient=?', (who, target)).fetchone()[0] < 100, '申请过多，请稍后再试')
                db.execute('INSERT OR IGNORE INTO requests VALUES(?,?,?)', (who, target, now))
            elif path == '/respond':
                target = self.target(db, data, who)
                accept = data.get('accept')
                check(type(accept) is bool, '请选择接受或拒绝')
                check(db.execute('SELECT 1 FROM requests WHERE sender=? AND recipient=?', (target, who)).fetchone(), '申请已结束')
                if accept:
                    check(self.count(db, who) < CAP and self.count(db, target) < CAP, '好友数量已达99人')
                    db.executemany('INSERT OR IGNORE INTO links VALUES(?,?)', [(who, target), (target, who)])
                db.execute('DELETE FROM requests WHERE sender=? AND recipient=?', (target, who))
            elif path == '/remove':
                target = self.target(db, data, who)
                db.execute('DELETE FROM links WHERE (a=? AND b=?) OR (a=? AND b=?)', (who, target, target, who))
            elif path == '/receive':
                check(type(data.get('enabled')) is bool, '接收设置不正确')
                db.execute('UPDATE players SET receive=? WHERE id=?', (int(data['enabled']), who))
            elif path == '/gift':
                target = data.get('target')
                if target == 'all':
                    targets = [r[0] for r in db.execute('SELECT b FROM links WHERE a=?', (who,))]
                else:
                    target = self.target(db, data, who)
                    check(db.execute('SELECT 1 FROM links WHERE a=? AND b=?', (who, target)).fetchone(), '请先成为好友')
                    targets = [target]
                sent = 0
                for target in targets:
                    if db.execute('SELECT receive FROM players WHERE id=?', (target,)).fetchone()[0]:
                        sent += db.execute('INSERT OR IGNORE INTO gifts(sender,recipient,day,at) VALUES(?,?,?,?)', (who, target, day, now)).rowcount
                result = self.snapshot(db, who, now, day, server)
                return dict(result, sent=sent)
            elif path == '/claim':
                gift = data.get('gift', 'all')
                check(gift == 'all' or type(gift) is int and gift > 0, '邮件编号不正确')
                received = db.execute('SELECT count(*) FROM gifts WHERE recipient=? AND claimed=?', (who, day)).fetchone()[0]
                rows = db.execute('SELECT id FROM gifts WHERE recipient=? AND claimed IS NULL AND at>? ORDER BY at,id LIMIT ?', (who, now - TTL, DAILY - received)).fetchall() if gift == 'all' else db.execute('SELECT id FROM gifts WHERE id=? AND recipient=? AND claimed IS NULL AND at>?', (gift, who, now - TTL)).fetchall()
                check(received < DAILY or not rows, '今日已领取20份体力')
                rows = rows[:max(0, DAILY - received)]
                db.executemany('UPDATE gifts SET claimed=? WHERE id=?', [(day, r['id']) for r in rows])
                db.execute('UPDATE players SET earned=earned+? WHERE id=?', (len(rows) * ENERGY, who))
            elif path != '/state':
                raise Problem('接口不存在', 404)
            return self.snapshot(db, who, now, day, server)

    @staticmethod
    def target(db, data, who):
        target = data.get('target')
        check(isinstance(target, str) and re.fullmatch(r'[0-9]{8}', target), '好友ID需为8位数字')
        check(target != who, '不能添加自己')
        check(db.execute('SELECT 1 FROM players WHERE id=?', (target,)).fetchone(), '没有找到这位制作人')
        return target

    def snapshot(self, db, who, now, day, server):
        me = db.execute('SELECT * FROM players WHERE id=?', (who,)).fetchone()
        friends = []
        for p in db.execute('SELECT p.* FROM players p JOIN links l ON l.b=p.id WHERE l.a=? ORDER BY p.seen DESC,p.id', (who,)):
            friends.append(dict(self.public(p), receive=bool(p['receive']), sent=bool(db.execute('SELECT 1 FROM gifts WHERE sender=? AND recipient=? AND day=?', (who, p['id'], day)).fetchone())))
        requests = [dict(self.public(p), at=p['at']) for p in db.execute('SELECT p.*,r.at FROM requests r JOIN players p ON p.id=r.sender WHERE r.recipient=? ORDER BY r.at', (who,))]
        inbox = [dict(self.public(p), gift=p['gift'], expires=p['at'] + TTL) for p in db.execute('SELECT p.*,g.id AS gift,g.at FROM gifts g JOIN players p ON p.id=g.sender WHERE g.recipient=? AND g.claimed IS NULL AND g.at>? ORDER BY g.at,g.id LIMIT 300', (who, now - TTL))]
        received = db.execute('SELECT count(*) FROM gifts WHERE recipient=? AND claimed=?', (who, day)).fetchone()[0]
        space = db.execute('SELECT revision,updated,scope,payload FROM showcases WHERE owner=?', (who,)).fetchone()
        meta = {'revision': space['revision'], 'updated': space['updated'], 'scope': space['scope'], 'published': space['payload'] is not None} if space else {'revision': 0, 'updated': 0, 'scope': 'private', 'published': False}
        return {'ok': True, 'server': server, 'account': who, 'now': now, 'day': day, 'me': dict(self.public(me), receive=bool(me['receive'])), 'friends': friends, 'requests': requests, 'inbox': inbox, 'received': received, 'earned': me['earned'], 'spaceMeta': meta}


def make_server(address, service, origins):
    class Handler(BaseHTTPRequestHandler):
        protocol_version = 'HTTP/1.0'
        def log_message(self, *_args):
            pass  # Never log bearer tokens, bodies or player names.

        def reply(self, status, data):
            content = json.dumps(data, ensure_ascii=False).encode()
            self.send_response(status)
            origin = self.headers.get('Origin')
            if origin in origins:
                self.send_header('Access-Control-Allow-Origin', origin)
                self.send_header('Vary', 'Origin')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
            self.send_header('Cache-Control', 'no-store')
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Content-Length', str(len(content)))
            self.end_headers()
            self.wfile.write(content)

        def do_OPTIONS(self):
            if self.headers.get('Origin') not in origins:
                return self.reply(403, {'ok': False, 'reason': '网页来源未授权'})
            self.reply(200, {'ok': True})

        def process(self):
            try:
                origin = self.headers.get('Origin')
                check(not origin or origin in origins, '网页来源未授权', 403)
                check(self.path == urlsplit(self.path).path, '接口地址不正确')
                if self.command == 'GET':
                    check(self.path in ['/health', '/state'], '请使用POST', 405)
                    data = {}
                else:
                    check(self.path not in ['/health', '/state'], '请使用GET', 405)
                    check(self.headers.get('Content-Type', '').split(';')[0] == 'application/json', '需要JSON请求', 415)
                    length = int(self.headers.get('Content-Length', '0'))
                    check(0 < length <= 16384, '请求大小不正确', 413)
                    data = json.loads(self.rfile.read(length))
                token = self.headers.get('Authorization', '')
                result = service.run(self.path, data, token[7:] if token.startswith('Bearer ') else '')
                self.reply(200, result)
            except Problem as exc:
                self.reply(exc.status, {'ok': False, 'reason': exc.text})
            except (ValueError, UnicodeError):
                self.reply(400, {'ok': False, 'reason': '请求格式不正确'})
            except (sqlite3.Error, OSError):
                self.reply(503, {'ok': False, 'reason': '服务暂不可用，请稍后重试'})

        do_GET = process
        do_POST = process
    return ThreadingHTTPServer(address, Handler)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--host', default='127.0.0.1')
    parser.add_argument('--port', type=int, default=8766)
    parser.add_argument('--db', default=str(Path(os.environ.get('LOCALAPPDATA', Path.home())) / 'WarmSignal' / 'friends.sqlite3'))
    parser.add_argument('--origin', action='append', default=[])
    args = parser.parse_args()
    filename = Path(args.db).resolve()
    workspace = Path(__file__).resolve().parents[2]
    check(filename != workspace and workspace not in filename.parents, '数据库必须保存在静态网站目录以外')
    filename.parent.mkdir(parents=True, exist_ok=True)
    origins = set(args.origin or ['http://127.0.0.1:8765', 'http://localhost:8765'])
    server = make_server((args.host, args.port), Friends(filename), origins)
    print(f'Warm Signal friends: http://{args.host}:{args.port} (protocol 1)', flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == '__main__':
    main()
