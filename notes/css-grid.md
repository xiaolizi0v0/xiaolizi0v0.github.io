# CSS Grid 布局指南

## 什么是 CSS Grid？
CSS Grid 是一个二维布局系统，专门为网页布局设计。它让你能够创建复杂的网格布局，比传统的布局方法更加强大和灵活。

## 基本概念

### 网格容器 (Grid Container)
```css
.container {
    display: grid;
}
```

### 网格项目 (Grid Items)
网格容器的直接子元素自动成为网格项目。

## 容器属性

### grid-template-columns 和 grid-template-rows
定义网格的列和行。

```css
.container {
    display: grid;
    grid-template-columns: 200px 1fr 1fr;
    grid-template-rows: 100px auto 200px;
}
```

### grid-template-areas
使用命名区域来定义布局。

```css
.container {
    display: grid;
    grid-template-areas:
        "header header header"
        "sidebar content content"
        "footer footer footer";
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.content { grid-area: content; }
.footer { grid-area: footer; }
```

### gap
设置网格线之间的间距。

```css
.container {
    gap: 20px; /* 行和列间距都是20px */
    row-gap: 10px; /* 行间距 */
    column-gap: 15px; /* 列间距 */
}
```

### justify-items 和 align-items
控制网格项目在单元格内的对齐方式。

```css
.container {
    justify-items: center; /* 水平居中 */
    align-items: center;   /* 垂直居中 */
}
```

## 项目属性

### grid-column 和 grid-row
指定项目占据的网格线。

```css
.item {
    grid-column: 1 / 3;    /* 从第1列线到第3列线 */
    grid-row: 2 / 4;       /* 从第2行线到第4行线 */
}

/* 简写方式 */
.item {
    grid-area: 2 / 1 / 4 / 3; /* row-start / column-start / row-end / column-end */
}
```

### justify-self 和 align-self
控制单个项目的对齐方式。

```css
.item {
    justify-self: start;   /* 水平靠左 */
    align-self: end;       /* 垂直靠下 */
}
```

## 响应式布局

### 使用 fr 单位
fr 单位表示可用空间的一部分。

```css
.container {
    grid-template-columns: 1fr 2fr 1fr; /* 中间列是两侧列的两倍宽 */
}
```

### 使用 minmax()
创建灵活的网格轨道。

```css
.container {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}
```

### 媒体查询
```css
.container {
    grid-template-columns: 1fr;
}

@media (min-width: 768px) {
    .container {
        grid-template-columns: 1fr 2fr;
    }
}

@media (min-width: 1024px) {
    .container {
        grid-template-columns: 1fr 3fr 1fr;
    }
}
```

## 实用示例

### 圣杯布局
```css
.container {
    display: grid;
    grid-template-areas:
        "header header header"
        "nav content sidebar"
        "footer footer footer";
    grid-template-columns: 200px 1fr 200px;
    grid-template-rows: auto 1fr auto;
    min-height: 100vh;
}

.header { grid-area: header; }
.nav { grid-area: nav; }
.content { grid-area: content; }
.sidebar { grid-area: sidebar; }
.footer { grid-area: footer; }
```

### 卡片网格
```css
.cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    padding: 20px;
}

.card {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
```

### 照片墙
```css
.photo-wall {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: 200px;
    gap: 10px;
}

.photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
}

.photo:nth-child(2n) {
    grid-row: span 2;
}

.photo:nth-child(3n) {
    grid-column: span 2;
}
```

## 浏览器支持
CSS Grid 在现代浏览器中得到很好的支持：
- Chrome 57+
- Firefox 52+
- Safari 10.1+
- Edge 16+

## 最佳实践
1. 使用网格进行整体页面布局
2. 使用 Flexbox 进行组件内部布局
3. 合理使用命名区域提高代码可读性
4. 利用响应式设计适应不同屏幕尺寸
5. 使用开发者工具调试网格布局

## 调试技巧
在浏览器开发者工具中：
- 检查网格线
- 查看网格区域
- 调试项目对齐方式
