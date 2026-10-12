import concurrent.futures
import copy
import importlib.util
import json
from pathlib import Path
import sqlite3
import sys
import tempfile
import threading
import unittest
from urllib.error import HTTPError
from urllib.request import Request, urlopen

sys.dont_write_bytecode = True
spec = importlib.util.spec_from_file_location('warm_friends', Path(__file__).resolve().parents[1] / 'tools/warm-signal/friends-server.py')
M = importlib.util.module_from_spec(spec)
spec.loader.exec_module(M)


class ServiceTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(prefix='warm-friends-test-')
        self.db = Path(self.tmp.name) / 'friends.sqlite3'
        self.now = 1791665940000  # 2026-10-10 20:59 UTC, Shanghai 04:59
        self.s = M.Friends(self.db, lambda: self.now)
        self.a = self.register('晨光制作人')
        self.b = self.register('晚风制作人')

    def tearDown(self):
        self.tmp.cleanup()

    def register(self, name):
        return self.s.run('/register', {'name': name, 'level': 4, 'cards': 6, 'avatar': 2})

    def call(self, account, path, data=None):
        return self.s.run(path, data, account['token'])

    def link(self, a=None, b=None):
        a, b = a or self.a, b or self.b
        self.call(a, '/request', {'target': b['account']})
        return self.call(b, '/respond', {'target': a['account'], 'accept': True})

    def test_registration_tokens_are_hashed_and_private_state_requires_authentication(self):
        self.assertNotEqual(self.a['account'], self.b['account'])
        with self.assertRaises(M.Problem):
            self.s.run('/state')
        with self.s.connect() as db:
            token = db.execute('SELECT token FROM players WHERE id=?', (self.a['account'],)).fetchone()[0]
        self.assertNotEqual(token, self.a['token'])
        self.assertEqual(len(token), 64)
        state = self.call(self.a, '/state')
        self.assertNotIn('token', json.dumps(state))
        self.assertEqual(state['earned'], 0)

    def test_search_full_id_name_and_recommendations_exclude_self_and_are_bounded(self):
        self.assertEqual(self.call(self.a, '/search', {'query': self.b['account']})['players'][0]['name'], '晚风制作人')
        self.assertEqual(len(self.call(self.a, '/search', {'query': '晚风制作人'})['players']), 1)
        self.assertFalse(self.call(self.a, '/search', {'query': '晚风'})['players'])
        self.assertFalse(self.call(self.a, '/search', {'query': self.a['account']})['players'])
        for i in range(23):
            self.register('测试' + str(i))
        self.assertEqual(len(self.call(self.a, '/recommend', {})['players']), 20)

    def test_request_accept_is_two_sided_and_duplicate_cross_self_requests_are_safe(self):
        with self.assertRaises(M.Problem):
            self.call(self.a, '/request', {'target': self.a['account']})
        self.call(self.a, '/request', {'target': self.b['account']})
        self.call(self.a, '/request', {'target': self.b['account']})
        self.assertEqual(len(self.call(self.b, '/state')['requests']), 1)
        self.assertFalse(self.call(self.a, '/state')['friends'])
        with self.assertRaises(M.Problem):
            self.call(self.b, '/request', {'target': self.a['account']})
        self.call(self.b, '/respond', {'target': self.a['account'], 'accept': True})
        self.assertEqual(self.call(self.a, '/state')['friends'][0]['id'], self.b['account'])
        self.assertEqual(self.call(self.b, '/state')['friends'][0]['id'], self.a['account'])
        self.assertFalse(self.call(self.b, '/state')['requests'])
        with self.assertRaises(M.Problem):
            self.call(self.b, '/respond', {'target': self.a['account'], 'accept': True})

    def test_reject_and_seven_day_expiry_do_not_create_friends(self):
        self.call(self.a, '/request', {'target': self.b['account']})
        self.call(self.b, '/respond', {'target': self.a['account'], 'accept': False})
        self.assertFalse(self.call(self.b, '/state')['requests'])
        self.call(self.a, '/request', {'target': self.b['account']})
        self.now += 7 * M.DAY
        self.assertFalse(self.call(self.b, '/state')['requests'])
        self.assertFalse(self.call(self.b, '/state')['friends'])

    def test_max_99_enforced_at_request_and_accept_even_after_request_was_sent(self):
        self.call(self.a, '/request', {'target': self.b['account']})
        with self.s.connect() as db:
            db.executemany('INSERT INTO links VALUES(?,?)', [(self.b['account'], str(20000000+i)) for i in range(99)])
        with self.assertRaises(M.Problem):
            self.call(self.b, '/respond', {'target': self.a['account'], 'accept': True})
        with self.assertRaises(M.Problem):
            self.call(self.a, '/request', {'target': self.b['account']})
        self.assertFalse(self.call(self.a, '/state')['friends'])

    def test_gift_only_friends_once_per_day_no_sender_cost_then_claim_exactly_once(self):
        with self.assertRaises(M.Problem):
            self.call(self.a, '/gift', {'target': self.b['account']})
        self.link()
        self.assertEqual(self.call(self.a, '/gift', {'target': self.b['account']})['sent'], 1)
        self.assertEqual(self.call(self.a, '/gift', {'target': self.b['account']})['sent'], 0)
        self.assertEqual(self.call(self.a, '/state')['earned'], 0)
        inbox = self.call(self.b, '/state')['inbox']
        self.assertEqual(len(inbox), 1)
        self.assertEqual(self.call(self.b, '/claim', {'gift': inbox[0]['gift']})['earned'], 3)
        self.assertEqual(self.call(self.b, '/claim', {'gift': inbox[0]['gift']})['earned'], 3)
        self.assertEqual(self.call(self.b, '/claim', {})['received'], 1)

    def test_claim_cap_20_and_remaining_mail_can_be_claimed_next_day(self):
        for i in range(22):
            c = self.register('赠送测试' + str(i))
            self.link(c, self.b)
            self.call(c, '/gift', {'target': self.b['account']})
        r = self.call(self.b, '/claim', {})
        self.assertEqual((r['earned'], r['received'], len(r['inbox'])), (60, 20, 2))
        with self.assertRaises(M.Problem):
            self.call(self.b, '/claim', {'gift': r['inbox'][0]['gift']})
        self.now += M.DAY
        r = self.call(self.b, '/claim', {})
        self.assertEqual((r['earned'], r['received'], len(r['inbox'])), (66, 2, 0))

    def test_receive_opt_out_blocks_new_gifts_but_keeps_existing_mail(self):
        self.link()
        self.call(self.a, '/gift', {'target': self.b['account']})
        self.call(self.b, '/receive', {'enabled': False})
        self.now += M.DAY
        self.assertEqual(self.call(self.a, '/gift', {'target': self.b['account']})['sent'], 0)
        self.assertEqual(self.call(self.b, '/claim', {})['earned'], 3)
        self.call(self.b, '/receive', {'enabled': True})
        self.assertEqual(self.call(self.a, '/gift', {'target': self.b['account']})['sent'], 1)

    def test_expiry_exact_72_hours_preserves_lifetime_earned_receipt(self):
        self.link()
        self.call(self.a, '/gift', {'target': self.b['account']})
        self.call(self.b, '/claim', {})
        self.now += M.DAY
        self.call(self.a, '/gift', {'target': self.b['account']})
        self.now += M.TTL - 1
        self.assertEqual(len(self.call(self.b, '/state')['inbox']), 1)
        self.now += 1
        r = self.call(self.b, '/claim', {})
        self.assertEqual(r['earned'], 3)
        self.assertFalse(r['inbox'])

    def test_5am_reset_and_clock_rollback_cannot_reopen_daily_gift(self):
        self.link()
        self.call(self.a, '/gift', {'target': self.b['account']})
        first = self.call(self.b, '/claim', {})
        self.now += 120000
        second = self.call(self.a, '/gift', {'target': self.b['account']})
        self.assertEqual(second['day'], first['day'] + 1)
        self.assertEqual(second['sent'], 1)
        second = self.call(self.b, '/claim', {})
        self.assertEqual((second['earned'], second['received']), (6, 1))
        self.now -= M.DAY
        self.assertEqual(self.call(self.a, '/gift', {'target': self.b['account']})['sent'], 0)
        self.assertEqual(self.call(self.b, '/state')['day'], second['day'])

    def test_remove_is_two_sided_preserves_mail_and_readd_does_not_reset_gift(self):
        self.link()
        self.call(self.a, '/gift', {'target': self.b['account']})
        self.call(self.a, '/remove', {'target': self.b['account']})
        self.assertFalse(self.call(self.b, '/state')['friends'])
        self.assertEqual(len(self.call(self.b, '/state')['inbox']), 1)
        self.link()
        self.assertEqual(self.call(self.a, '/gift', {'target': self.b['account']})['sent'], 0)

    def test_concurrent_send_and_claim_are_serialized_and_restart_preserves_identity(self):
        self.link()
        with concurrent.futures.ThreadPoolExecutor(2) as pool:
            sends = list(pool.map(lambda _: self.call(self.a, '/gift', {'target': self.b['account']})['sent'], range(2)))
        self.assertEqual(sum(sends), 1)
        with concurrent.futures.ThreadPoolExecutor(2) as pool:
            list(pool.map(lambda _: self.call(self.b, '/claim', {}), range(2)))
        self.assertEqual(self.call(self.b, '/state')['earned'], 3)
        restarted = M.Friends(self.db, lambda: self.now)
        self.assertEqual(restarted.run('/state', token=self.b['token'])['earned'], 3)
        self.assertEqual(restarted.run('/health')['server'], self.a['server'])

    def test_malformed_profiles_targets_and_bodies_cannot_mutate_player(self):
        before = self.call(self.a, '/state')['me']
        for data in [{'name': '', 'level': 1, 'cards': 1, 'avatar': 1}, {'name': '坏数据', 'level': True, 'cards': 1, 'avatar': 1}, {'name': '坏数据', 'level': 1, 'cards': 109, 'avatar': 1}, []]:
            with self.assertRaises(M.Problem):
                self.call(self.a, '/profile', data)
        self.assertEqual(self.call(self.a, '/state')['me'], before)
        for target in ['123', 12345678, '00000000']:
            with self.assertRaises(M.Problem):
                self.call(self.a, '/request', {'target': target})

    def showcase(self):
        return dict(version=1, signature='今晚也有星光 ✨', album=[0, 9, 60], power=[123, 456, 789, 321], useDIY=True,
                    design=dict(p=5, theme=0, board=0, frames=[dict(cardId=60, style=0, crop=dict(x=10, y=-8, zoom=1.2), x=50, y=50, scale=1, angle=0, flip=False, layer=0)], lights=[], decor=[]),
                    art=[dict(id=0, display=0, variant=0), dict(id=9, display=2, variant=1), dict(id=60, display=0, variant=0)])

    def publish(self, account=None, revision=0, scope='friends', payload=None):
        return self.call(account or self.a, '/space-publish', dict(revision=revision, scope=scope, payload=payload or self.showcase()))

    def read_space(self, viewer=None, owner=None):
        return self.call(viewer or self.b, '/space', dict(target=(owner or self.a)['account']))['space']

    def test_space_friend_scope_checks_current_relationship_on_every_read(self):
        self.publish()
        self.assertIsNone(self.read_space())
        self.link()
        self.assertEqual(self.read_space()['payload'], self.showcase())
        stranger = self.register('陌生制作人')
        self.assertIsNone(self.read_space(stranger))
        self.call(self.a, '/remove', dict(target=self.b['account']))
        self.assertIsNone(self.read_space())
        self.assertEqual(self.read_space(self.a)['revision'], 1)

    def test_space_all_and_private_are_distinct_from_friend_scope(self):
        self.publish(scope='all')
        self.assertEqual(self.read_space()['scope'], 'all')
        self.link()
        self.publish(revision=1, scope='private')
        self.assertIsNone(self.read_space())
        self.assertEqual(self.read_space(self.a)['scope'], 'private')

    def test_space_withdraw_preserves_revision_and_old_pages_cannot_resurrect_it(self):
        self.publish(scope='all')
        withdrawn = self.call(self.a, '/space-withdraw', dict(revision=1))
        self.assertEqual(withdrawn['spaceMeta'], dict(revision=2, updated=self.now, scope='private', published=False))
        self.assertIsNone(self.read_space(self.a))
        with self.assertRaises(M.Problem) as error:
            self.publish(revision=1)
        self.assertEqual(error.exception.status, 409)
        self.publish(revision=2)
        self.assertEqual(self.read_space(self.a)['revision'], 3)

    def test_space_only_authenticated_author_can_write_and_does_not_award_resources(self):
        with self.assertRaises(M.Problem):
            self.s.run('/space', dict(target=self.a['account']))
        with self.assertRaises(M.Problem):
            self.call(self.a, '/space-publish', dict(revision=0, scope='all', payload=self.showcase(), owner=self.b['account']))
        before = self.call(self.a, '/state')
        self.publish()
        self.assertIsNone(self.read_space(self.b, self.b))
        after = self.call(self.a, '/state')
        for key in ['earned', 'received', 'friends', 'inbox']:
            self.assertEqual(before[key], after[key])
        self.assertNotIn('payload', json.dumps(after))

    def test_space_malformed_payload_and_scope_fail_atomically(self):
        self.publish()
        mutations = [lambda p: p.update(url='file:///private'), lambda p: p.update(signature='x'*41),
                     lambda p: p.update(signature='\ud800'), lambda p: p.update(album=[0, 0]),
                     lambda p: p['power'].__setitem__(0, True), lambda p: p['power'].__setitem__(0, float('nan')),
                     lambda p: p['design']['frames'][0].update(x=10**1000),
                     lambda p: p['design']['frames'][0]['crop'].update(zoom=4),
                     lambda p: p['design']['frames'][0].update(url='https://example.com'),
                     lambda p: p['art'][0].update(display=2), lambda p: p['art'].pop()]
        for mutate in mutations:
            payload = self.showcase()
            mutate(payload)
            with self.assertRaises(M.Problem):
                self.publish(revision=1, payload=payload)
        for scope in [[], {}, None, 1, 'unknown']:
            with self.assertRaises(M.Problem):
                self.publish(revision=1, scope=scope)
        self.assertEqual(self.read_space(self.a)['payload'], self.showcase())
        self.assertEqual(self.read_space(self.a)['revision'], 1)

    def test_space_snapshots_do_not_follow_mutated_source_or_returned_objects(self):
        payload = self.showcase()
        self.publish(payload=payload)
        payload['design']['frames'][0]['x'] = 77
        returned = self.read_space(self.a)
        self.assertEqual(returned['payload']['design']['frames'][0]['x'], 50)
        returned['payload']['art'][1]['variant'] = 0
        self.assertEqual(self.read_space(self.a)['payload']['art'][1]['variant'], 1)

    def test_space_concurrent_updates_have_one_winner_and_restart_keeps_saved_art(self):
        self.publish()
        def update(index):
            payload = self.showcase()
            payload['signature'] = '版本' + str(index)
            try:
                self.publish(revision=1, payload=payload)
                return True
            except M.Problem as error:
                self.assertEqual(error.status, 409)
                return False
        with concurrent.futures.ThreadPoolExecutor(2) as pool:
            self.assertEqual(sum(pool.map(update, range(2))), 1)
        restarted = M.Friends(self.db, lambda: self.now)
        before = self.read_space(self.a)
        after = restarted.run('/space', dict(target=self.a['account']), self.a['token'])['space']
        self.assertEqual(before, after)
        self.assertEqual(after['revision'], 2)

    def test_space_maximum_valid_composition_fits_http_body_limit(self):
        p = self.showcase()
        template = p['design']['frames'][0]
        p['design']['frames'] = [dict(copy.deepcopy(template), layer=i) for i in range(5)]
        p['design']['lights'] = [dict(x=50, y=50, scale=1, angle=0, flip=False, layer=i+5, type=i%4, opacity=.8) for i in range(5)]
        p['design']['decor'] = [dict(x=50, y=50, scale=1, angle=0, flip=False, layer=i+10, icon='♡') for i in range(30)]
        self.assertTrue(M.showcase_valid(p))
        self.assertLess(len(json.dumps(dict(revision=0, scope='friends', payload=p)).encode()), 16384)
        self.publish(payload=p)
        p['design']['decor'][0]['layer'] = 0
        self.assertFalse(M.showcase_valid(p))

    def test_http_protocol_origin_json_auth_limits_and_wrong_method(self):
        server = M.make_server(('127.0.0.1', 0), self.s, {'http://127.0.0.1:8765'})
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        base = 'http://127.0.0.1:' + str(server.server_port)
        def request(path, body=None, origin='http://127.0.0.1:8765', token=None, method=None):
            headers = {'Origin': origin, 'Content-Type': 'application/json'}
            if token:
                headers['Authorization'] = 'Bearer ' + token
            req = Request(base + path, data=None if body is None else json.dumps(body).encode(), headers=headers, method=method)
            try:
                with urlopen(req, timeout=3) as response:
                    return response.status, json.loads(response.read()), response.headers
            except HTTPError as response:
                return response.code, json.loads(response.read()), response.headers
        try:
            status, body, headers = request('/health')
            self.assertEqual((status, body['protocol']), (200, 1))
            self.assertEqual(headers['Access-Control-Allow-Origin'], 'http://127.0.0.1:8765')
            self.assertEqual(request('/state')[0], 401)
            self.assertEqual(request('/state', token=self.a['token'])[0], 200)
            self.assertEqual(request('/health', origin='https://unknown.example')[0], 403)
            self.assertEqual(request('/profile', {'x': 'x' * 17000}, token=self.a['token'])[0], 413)
            self.assertEqual(request('/state', {}, token=self.a['token'])[0], 405)
            self.assertEqual(request('/health', method='OPTIONS')[0], 200)
        finally:
            server.shutdown()
            server.server_close()
            thread.join()


if __name__ == '__main__':
    unittest.main()
