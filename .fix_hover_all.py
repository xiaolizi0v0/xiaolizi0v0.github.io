# -*- coding: utf-8 -*-
path = 'tools/MovieTimeCapsule.html'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

# 1. 给 hover-desc 补充 CSS（描述文字样式）
old_css = """.hover-meta {
            font-size: 0.74rem;
            opacity: .85;
            line-height: 1.5;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }"""
new_css = old_css + """

        .hover-desc {
            font-size: 0.78rem;
            line-height: 1.55;
            opacity: .8;
            margin-top: 0.25rem;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        .hover-top {
            display: flex;
            flex-direction: column;
            gap: 0.15rem;
        }"""
assert old_css in c, '未找到 hover-meta CSS'
c = c.replace(old_css, new_css, 1)

# 2. 给搜索结果卡片替换旧 overlay 为新的悬停大图层
old_result = '''                        <div class="poster-bottom">
                            <span class="card-type">${typeName(item.type)}</span>
                            <span class="card-date">${item.year || ''}</span>
                        </div>
                        ${item.platform ? `<span class="platform-badge" style="background:${PLATFORM_COLORS[item.platform] || '#6B7280'}">${item.platform}</span>` : ''}
                        <div class="poster-overlay">
                            <button class="card-btn ${recorded ? 'recorded' : ''}" data-record="${idx}" ${recorded ? 'disabled' : ''} onclick="event.stopPropagation()">
                                ${recorded ? '已记录' : '记录观看'}
                            </button>
                        </div>
                    </div>
                    <div class="poster-info">
                        <div class="poster-title" title="${item.title}">${item.title}</div>
                        <div class="poster-meta">
                            ${item.region ? `<span>${item.region}</span>` : ''}
                            ${genreChips(item.genre)}
                        </div>
                    </div>'''

new_result = '''                        <div class="poster-bottom">
                            <span class="card-type">${typeName(item.type)}</span>
                            <span class="card-date">${item.year || ''}</span>
                        </div>
                        ${item.platform ? `<span class="platform-badge" style="background:${PLATFORM_COLORS[item.platform] || '#6B7280'}">${item.platform}</span>` : ''}
                        <div class="poster-card-hover" onclick="event.stopPropagation()">
                            <div class="hover-top">
                                <div class="hover-title">${item.title}</div>
                                <div class="hover-tags">
                                    <span class="tag">${typeName(item.type)}</span>
                                    ${item.year ? `<span class="tag">${item.year}</span>` : ''}
                                    ${item.region ? `<span class="tag">${item.region}</span>` : ''}
                                    ${item.platform ? `<span class="tag">${item.platform}</span>` : ''}
                                </div>
                                ${item.desc ? `<div class="hover-desc">${item.desc}</div>` : ''}
                            </div>
                            <div class="hover-bottom">
                                <button class="hover-btn primary" data-record="${idx}" ${recorded ? 'disabled' : ''}>${recorded ? '已记录' : '记录观看'}</button>
                            </div>
                        </div>
                    </div>
                    <div class="poster-info">
                        <div class="poster-title" title="${item.title}">${item.title}</div>
                        <div class="poster-meta">
                            ${item.region ? `<span>${item.region}</span>` : ''}
                            ${genreChips(item.genre)}
                        </div>
                    </div>'''

assert old_result in c, '未找到结果卡片模板'
c = c.replace(old_result, new_result, 1)

# 3. 给结果卡片的悬停按钮绑定事件（与 data-record 同一逻辑）
old_record = '''            resultsGrid.querySelectorAll('.card-btn:not(.recorded)').forEach(btn => {
                btn.addEventListener('click', () => {
                    const item = list[parseInt(btn.dataset.record)];
                    addRecord({
                        id: String(item.id),
                        title: item.title || '未知作品',
                        year: item.year || '',
                        type: item.type === 'tv' ? 'tv' : (item.type === 'variety' ? 'variety' : (item.type === 'anime' ? 'anime' : 'movie')),
                        url: item.url || '',
                        img: item.img || '',
                        genre: item.genre || '',
                        platform: item.platform || '',
                        region: item.region || '',
                        sub_title: item.sub_title || '',
                        desc: item.desc || ''
                    });
                    btn.classList.add('recorded');
                    btn.textContent = '已记录';
                    btn.disabled = true;
                });
            });'''

new_record = '''            resultsGrid.querySelectorAll('[data-record]').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (btn.disabled) return;
                    const item = list[parseInt(btn.dataset.record)];
                    addRecord({
                        id: String(item.id),
                        title: item.title || '未知作品',
                        year: item.year || '',
                        type: item.type === 'tv' ? 'tv' : (item.type === 'variety' ? 'variety' : (item.type === 'anime' ? 'anime' : 'movie')),
                        url: item.url || '',
                        img: item.img || '',
                        genre: item.genre || '',
                        platform: item.platform || '',
                        region: item.region || '',
                        sub_title: item.sub_title || '',
                        desc: item.desc || ''
                    });
                    btn.classList.add('recorded');
                    btn.textContent = '已记录';
                    btn.disabled = true;
                });
            });'''

assert old_record in c, '未找到记录按钮绑定'
c = c.replace(old_record, new_record, 1)

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)
print('完成')
