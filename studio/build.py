"""Build four GitHub Pages documents from the verified public game catalogue."""
from pathlib import Path
import html,json

ROOT=Path(__file__).resolve().parent
GAMES=json.loads((ROOT/'content/games.json').read_text(encoding='utf-8'))
BASE='https://xiaolizi0v0.github.io/studio/'
e=html.escape
ARROW='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg>'
STAR='<svg viewBox="0 0 40 40" aria-hidden="true"><path d="m20 0 4.8 12.7L38 7l-5.7 13L45 25l-14 3.4L34 42l-14-8-12 8 2-14L-4 24l13-5L3 6l13 6z"/></svg>'

def tap(g,cls='button tap',label='TapTap 下载 / 试玩'):
    return f'<a class="{cls}" href="{e(g["monitor"])}" target="_blank" rel="noopener" data-game="{g["slug"]}" data-rep-link><b>TapTap</b><span>{e(label.replace("TapTap ",""))}</span>{ARROW}</a>'

def head(title,description,path,image,theme):
    schema={'@context':'https://schema.org','@type':'Organization' if theme=='studio' else 'VideoGame','name':title,'url':BASE+path,'description':description,'image':BASE+'assets/'+image}
    if theme=='studio':schema['sameAs']=['https://www.taptap.cn/developer/493296']
    browser_title=title if theme=='studio' else title+' · 晴川拾光工作室'
    return f'''<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="{'#101110' if theme in ['studio','car'] else '#f6efdf'}"><title>{e(browser_title)}</title>
<meta name="description" content="{e(description)}"><link rel="canonical" href="{BASE+path}"><meta property="og:type" content="website"><meta property="og:title" content="{e(title)}"><meta property="og:description" content="{e(description)}"><meta property="og:image" content="{BASE+'assets/'+image}"><meta property="og:url" content="{BASE+path}">
<link rel="icon" href="/studio/assets/logo.png"><link rel="stylesheet" href="/studio/assets/site.css?v=20261029-1"><script defer src="/studio/assets/site.js?v=20261029-1"></script><script type="application/ld+json">{json.dumps(schema,ensure_ascii=False)}</script></head><body class="theme-{theme}"><a class="skip-link" href="#main">跳到正文</a>'''

def header(game=None):
    nav='<a href="/studio/#games">我们的作品</a><a href="/studio/#about">关于工作室</a>' if not game else '<a href="#experience">游戏特色</a><a href="#gallery">游戏画面</a><a href="#faq">游玩须知</a>'
    action=f'<a class="nav-tap" href="https://www.taptap.cn/developer/493296" target="_blank" rel="noopener">找到我们 {ARROW}</a>' if not game else tap(game,'nav-tap','TapTap 下载 / 试玩')
    return f'''<header class="site-header"><a class="brand" href="/studio/" aria-label="晴川拾光工作室首页"><img src="/studio/assets/logo.png" width="42" height="42" alt=""><span>晴川拾光<span class="brand-sub">QINGCHUAN SHIGUANG STUDIO</span></span></a><button class="menu-toggle" aria-expanded="false" aria-controls="main-nav" aria-label="展开导航"><span></span><span></span></button><nav id="main-nav" aria-label="主导航">{nav}{action}</nav></header>'''

def footer():
    return f'''<footer class="site-footer"><a class="footer-brand" href="/studio/">晴川拾光工作室<span>小小的世界，认真的想象。</span></a><div><a href="https://www.taptap.cn/developer/493296" target="_blank" rel="noopener">TapTap 厂商主页 {ARROW}</a><a href="/">个人博客 {ARROW}</a><span>© 2026 晴川拾光工作室</span></div></footer><div class="page-grain" aria-hidden="true"></div></body></html>'''

def home():
    cards=''
    for n,g in enumerate(GAMES,1):
        cards+=f'''<article class="game-card" data-category="{g['filter']}"><a class="card-image" href="games/{g['slug']}/" aria-label="查看{g['title']}官网"><img src="assets/{g['cover']}" alt="{g['title']}游戏美术" loading="lazy" width="800" height="500"><span class="card-no">0{n}</span><span class="card-image-arrow">{ARROW}</span></a><div class="card-copy"><p class="eyebrow">{g['en']}</p><h3><a href="games/{g['slug']}/">{g['title']}</a></h3><p>{g['short']}</p><div class="tags">{''.join('<span>'+e(t)+'</span>' for t in g['tags'])}</div><div class="card-actions"><a href="games/{g['slug']}/">探索游戏官网 {ARROW}</a>{tap(g,'card-tap','TapTap 试玩')}</div></div></article>'''
    page=head('晴川拾光工作室','从终检站到宋代书坊，再到晴川市的一封来信。发现晴川拾光工作室的原创独立游戏，前往 TapTap 体验。','','warm-hero.jpg','studio')+header()
    page+=f'''<main id="main"><section class="studio-hero wrap"><div class="hero-copy"><p class="eyebrow"><i class="status-dot"></i> 独立创作 · 不止一种想象</p><h1>把灵感，<br>做成<span class="yellow">可玩的世界<span class="heading-star">✳</span></span></h1><p class="hero-description">从终检站的一枚印章，到宋代书坊的第一张印页，<br class="desktop-br">再到晴川市的一封来信。<br>我们把认真观察过的日常，做成值得停留的游戏。</p><div class="hero-actions"><a class="button primary" href="#games">发现我们的游戏 {ARROW}</a><a class="text-link" href="#about">认识晴川拾光 <span>↓</span></a></div><div class="hero-caption"><span class="tiny-index">01 — 03</span><span>三个世界 / 同一份好奇心</span></div></div>
<div class="hero-stage" aria-label="工作室三款游戏美术展示"><div class="stage-orbit" aria-hidden="true"></div><span class="stage-note">SMALL WORLDS.<br>BIG CURIOSITY.</span><a class="stage-card stage-car" href="games/car-inspection/"><img src="assets/car-hero.jpg" alt="像素工业风的汽车终检站" fetchpriority="high"><span>01 / 汽车质检模拟器 <b>↗</b></span></a><a class="stage-card stage-print" href="games/printing/"><img src="assets/printing-hero.webp" alt="宋风山水中的清墨书坊"><span>02 / 清墨书坊 <b>↗</b></span></a><a class="stage-card stage-warm" href="games/warm-signal/"><img src="assets/warm-hero.jpg" alt="樱花街角的心动来信"><span>03 / 心动来信 <b>↗</b></span></a><div class="stage-seal" aria-hidden="true">想 象<br><b>正在发生</b>✳</div><span class="stage-cross" aria-hidden="true">＋</span></div></section>
<div class="marquee" aria-hidden="true"><div>认真观察 · 大胆想象 <span>✳</span> INDEPENDENT GAMES <span>✳</span> 把日常变成另一种可能 <span>✳</span> QINGCHUAN SHIGUANG <span>✳</span></div></div>
<section class="works wrap section" id="games"><div class="section-heading"><div><p class="eyebrow yellow">OUR GAMES / 作品集</p><h2>下一站，<br>你想进入哪个世界？</h2></div><p>不设定一种答案，也不限定一种画风。<br>挑一个你感兴趣的故事，进去看看。</p></div><div class="works-toolbar"><div class="filters" role="group" aria-label="按游戏类型筛选"><button type="button" class="filter active" data-filter="all" aria-pressed="true">全部作品 <span>03</span></button><button type="button" class="filter" data-filter="simulation" aria-pressed="false">模拟与经营</button><button type="button" class="filter" data-filter="story" aria-pressed="false">恋爱与叙事</button></div><span id="filter-status" role="status" aria-live="polite">共 3 款作品</span></div><div class="game-grid">{cards}</div></section>
<section class="about section" id="about"><div class="wrap about-grid"><div><p class="eyebrow">ABOUT US / 晴川拾光</p><h2>看见日常，<br>留住一点<span class="outline-word">不平凡。</span></h2><div class="about-logo"><img src="assets/logo.png" alt="晴川拾光工作室标志" width="110" height="110"><span>晴川，是向着光走。<br>拾光，是把它认真留下。</span></div></div><div class="about-copy"><p class="about-lead">我们是一间创作独立游戏的小小工作室。<br>比起替世界规定答案，<br>我们更想给好奇心留一个入口。</p><p>一场核验、一页新书、一段相遇。游戏的起点，常常只是生活里一个不起眼的瞬间。我们把它拆开、琢磨，再变成可以亲手参与的体验。</p><div class="principles"><div><span>01</span><h3>让选择有分量</h3><p>从操作到结果，让每一次参与都留下回响。</p></div><div><span>02</span><h3>让画风属于故事</h3><p>工业像素、宋风纸墨、温暖日常，各有各的表达。</p></div><div><span>03</span><h3>把作品交给玩家</h3><p>在真实的游玩与反馈里，继续打磨这些小世界。</p></div></div></div></div></section>
<section class="studio-outro wrap"><p class="eyebrow">SEE YOU IN THE NEXT WORLD</p><h2>下一次相遇，<span>在游戏里。</span></h2><a class="button primary" href="https://www.taptap.cn/developer/493296" target="_blank" rel="noopener">在 TapTap 找到晴川拾光 {ARROW}</a><p>欢迎试玩、留下感受，也欢迎指出我们还没做好的地方。</p></section></main>'''
    (ROOT/'index.html').write_text(page+footer(),encoding='utf-8')

def cast(g):
    if g['theme']=='warm':
        names=['林栀','顾清禾','许知夏','苏晚','江月','唐梨'];jobs=['植物研究员','建筑设计师','独立音乐人','城市记者','甜点师','生活摄影主播']
        art=''
        for i,(name,job) in enumerate(zip(names,jobs)):
            art+=f'<article><svg viewBox="{i%3*418} 0 418 627" role="img" aria-label="{name}角色立绘"><image href="/studio/assets/warm-{("abc" if i<3 else "def")}.webp" width="1254" height="1254"/></svg><h3>{name}</h3><p>{job}</p></article>'
        return '<section class="cast-section wrap section"><p class="eyebrow">SIX ENCOUNTERS</p><h2>六次相遇，各自闪光。</h2><div class="warm-cast">'+art+'</div></section>'
    if g['theme']=='printing':
        return '''<section class="printing-world wrap section"><div><p class="eyebrow">同袍相伴 / 一起开坊</p><h2>有人同你研墨，<br>有人替你点灯。</h2><p>从一间小书坊，到更远的山水。<br>招贤、著书、经营，遇见一路同行的人。</p></div><div class="printing-people"><figure><img src="/studio/assets/printing-su-qingwan.webp" alt="苏青晚角色立绘" loading="lazy"><figcaption>苏青晚</figcaption></figure><figure><img src="/studio/assets/printing-bi-sheng.webp" alt="毕昇角色立绘" loading="lazy"><figcaption>毕昇</figcaption></figure><figure><img src="/studio/assets/printing-li-qingzhao.webp" alt="李清照角色立绘" loading="lazy"><figcaption>李清照</figcaption></figure></div></section>'''
    return '''<section class="car-rule wrap section"><div class="rule-board"><p>东部第六整车厂 / 工作须知</p><h2>质量就是生命。</h2><ol><li>先看实车，再读工单。</li><li>逐项比对，不凭印象。</li><li>所有异常，都值得重看一遍。</li></ol><span class="rule-stamp">终检站 06</span></div><div><p class="eyebrow">AN ORDINARY SHIFT. AN EXTRAORDINARY PRESSURE.</p><h2>车还在排队。<br>你得保持清醒。</h2><p>没有一键找茬，没有替你判断的扫描器。<br>只有每天增加的条例，以及那枚握在你手里的章。</p></div></section>'''

def detail(g):
    title=g['title']; theme=g['theme'];path='games/'+g['slug']+'/'
    h1= e(title) if theme!='printing' else '重生之我的<br><strong>印刷术等级1000</strong>'
    features=''.join(f'<article><span class="feature-index">{e(x[0])}</span><h3>{e(x[1])}</h3><p>{e(x[2])}</p></article>' for x in g['features'])
    gallery=''.join(f'<button class="gallery-item" type="button" data-image="/studio/assets/{f}" data-caption="{e(caption)}" aria-label="放大查看：{e(caption)}"><img src="/studio/assets/{f}" alt="{e(caption)}" loading="lazy"><span>{e(caption)} <b>＋</b></span></button>' for f,caption in g['gallery'])
    faq=''.join(f'<details><summary>{e(q)}<span aria-hidden="true">＋</span></summary><p>{e(a)}</p></details>' for q,a in g['faqs'])
    page=head(title+' 官网',g['description'],path,g['hero'],theme)+header(g)
    page+=f'''<main id="main"><section class="game-hero"><img class="game-hero-art" src="/studio/assets/{g['hero']}" alt="{title}美术主视觉" fetchpriority="high"><div class="game-hero-shade"></div><div class="game-hero-copy wrap"><p class="eyebrow">{g['en']}</p><p class="game-location">{g['eyebrow']}</p><h1>{h1}</h1><h2>{g['hook']}</h2><p class="game-intro">{g['description']}</p><div class="hero-actions">{tap(g)}<a class="button secondary" href="#footage">观看{'宣传片' if theme=='printing' else '实机片段'} <span aria-hidden="true">▷</span></a></div><div class="hero-tags">{''.join('<span>'+e(t)+'</span>' for t in g['tags'])}<span>TapTap 创意工坊测试作品</span></div></div><a class="scroll-cue" href="#experience" aria-label="继续了解游戏">SCROLL TO EXPLORE <span>↓</span></a></section>
<section class="wrap section" id="experience"><div class="section-heading"><div><p class="eyebrow">THE EXPERIENCE / 游戏特色</p><h2>{g['section']}</h2></div><span class="section-mark" aria-hidden="true">{'印' if theme=='printing' else '♡' if theme=='warm' else '06'}</span></div><div class="feature-grid">{features}</div></section>{cast(g)}
<section class="footage-section section" id="footage"><div class="wrap"><p class="eyebrow">{'PROMOTIONAL FILM / 宣传片' if theme=='printing' else 'GAMEPLAY / 实机片段'}</p><h2>{g['videoTitle']}</h2><video controls playsinline preload="none" poster="/studio/assets/{g['hero']}" aria-label="{g['videoTitle']}"><source src="/studio/assets/{g['video']}" type="video/mp4">你的浏览器不支持视频播放。请前往 TapTap 查看游戏画面。</video></div></section>
<section class="gallery-section wrap section" id="gallery"><div class="section-heading"><div><p class="eyebrow">IN-GAME / 游戏画面</p><h2>{'一眼看见的，和慢慢发现的。' if theme=='warm' else '走进'+('清墨书坊。' if theme=='printing' else '终检站。')}</h2></div><p>点击画面，查看完整截图。</p></div><div class="gallery-grid">{gallery}</div></section>
<section class="faq-section wrap section" id="faq"><div><p class="eyebrow">BEFORE YOU PLAY / 游玩须知</p><h2>来之前，<br>你可能想知道。</h2></div><div class="faq-list">{faq}</div></section>
<section class="game-outro section"><div class="wrap"><p class="eyebrow">你的下一段日常，从这里开始。</p><h2>{g['hook']}</h2>{tap(g)}<p>当前为测试作品，版本与可用平台以 TapTap 页面为准。</p><div class="outro-links"><a href="https://www.taptap.cn/app/{g['id']}/topic" target="_blank" rel="noopener">游戏论坛与反馈 {ARROW}</a><a href="/studio/#games">看看其他作品 {ARROW}</a></div></div></section></main>
<dialog id="lightbox" aria-labelledby="lightbox-caption"><button type="button" class="lightbox-close" aria-label="关闭大图">×</button><img src="/studio/assets/{g['gallery'][0][0]}" alt=""><div class="lightbox-bottom"><button type="button" class="lightbox-prev" aria-label="上一张截图">←</button><p id="lightbox-caption"></p><button type="button" class="lightbox-next" aria-label="下一张截图">→</button></div></dialog>'''
    target=ROOT/path;target.mkdir(parents=True,exist_ok=True);(target/'index.html').write_text(page+footer(),encoding='utf-8')

if __name__=='__main__':
    home()
    for game in GAMES:detail(game)
    print('Built studio home + 3 game websites with real TapREP links.')
