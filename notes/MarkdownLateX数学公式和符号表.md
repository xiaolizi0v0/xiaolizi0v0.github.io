## 1. 插入公式块

在两个 `$` 符号之间插入公式内容：`$` 公式内容 `$`。

下面关于数学公式的markdown语法，将省略 `$` 符号，只显示 `$` 之间的内容。



## 2. 上标和下标

![img](https://pic1.zhimg.com/v2-19c7f1b71ebddbb02e8ff00375a89a2a_1440w.jpg)

## 3. 括号

### 常用括号

![img](https://pic3.zhimg.com/v2-4bd65e7a0e66d9a999df7af329b9480e_1440w.jpg)

### 放大括号的大小

![img](https://pic4.zhimg.com/v2-4606f1abcdde354c4d09a4cef14eaccf_1440w.jpg)



## 4. 矩阵

### 常用矩阵

![img](https://pica.zhimg.com/v2-9983e89ab5a899dd8c4cd4f1e2d5963e_1440w.jpg)

### 行内矩阵（将矩阵缩小表示）

将pmatrix 改成 smallmatrix即可。效果：





## 5. 分式和二项式

![img](https://pic2.zhimg.com/v2-a750d8cd171c532acf2f7fa3938d907b_1440w.jpg)



## 6. 对齐

### 展示长公式

使用 `\begin{multline*}` + `公示内容` + 中间用 `\\` 分行 + 用 `\end{multline*}` 。举例：

![img](https://pic2.zhimg.com/v2-82a1c1077a5c20415646cd5870750b5d_1440w.jpg)

### 拆分、对齐方程

使用 `\begin{align*}` + 公示内容 + 中间用 `\\` 分行 + 方程等号前加上 `**&**` 用 `\end{align*}` 。举例：

![img](https://picx.zhimg.com/v2-787614e38385bfad1239889d973413ff_1440w.jpg)

### 居中显示方程（不以等号对齐）

使用 `{gather*}`

![img](https://pic3.zhimg.com/v2-ed66cd80d0d7793410497de88c385f16_1440w.jpg)



## 7. 运算符（三角函数、对数、极限等）

这部分很简单，使用 **`\` + 运算符的英文表达**即可。可以直接尝试，失败的话再查询。

### 常用

![img](https://pic3.zhimg.com/v2-6180142778bec75da3ab780651c291fe_1440w.jpg)

### 其他

![img](https://picx.zhimg.com/v2-ffab9756a49abdf18c157f46e12999a7_1440w.jpg)



## 8. 数学间距控制

![img](https://pic3.zhimg.com/v2-024895a90193e0c64b6e047beaa29462_1440w.jpg)

示例：

![img](https://pica.zhimg.com/v2-668ab67700e7031d42872ec729f36766_1440w.jpg)



## 9. 积分、累加、连乘、极限符号

### 积分

![img](https://pica.zhimg.com/v2-aed4c5f6ebe35f53b115917196c942e2_1440w.jpg)

### 多重积分与曲线曲面积分

![img](https://pic4.zhimg.com/v2-4aa8230dce16bf23cc25ef3757a328b3_1440w.jpg)

### 累加与连乘

![img](https://pica.zhimg.com/v2-79934e21bbaa968b3c47e0bb7895c536_1440w.jpg)

### 极限

![img](https://picx.zhimg.com/v2-667dc3b961b78503d1f1aa2d9a1f8b5b_1440w.jpg)



## 10. 希腊字母与常用符号（箭头、运算、关系）

### 希腊字母表

![img](https://pic3.zhimg.com/v2-491886507ca43bc6dad4461d9b7736fa_1440w.jpg)

### 各种箭头、字母上方的标记

![img](https://pic2.zhimg.com/v2-6647446a4d5c2b414a7a58dfe62b7e2f_1440w.jpg)

补充（字母/公式上方的各种标记）：

![img](https://pic1.zhimg.com/v2-543f50f9f9a4973c1fe591ecc33cda9a_1440w.jpg)

### 四则运算、关系符

![img](https://pic1.zhimg.com/v2-719581e388568376a43d596490919572_1440w.jpg)

### 其他符号

![img](https://pic2.zhimg.com/v2-b81757492ead87902baf01c9e3433bb9_1440w.jpg)



## 11. 字体

### 11.1 字体族、字体风格

举例：



分别对应：衬线字体，无衬线字体，等宽字体(monospace,typewriter)



更多详见：[Font sizes, families, and styles](https://link.zhihu.com/?target=https%3A//www.overleaf.com/learn/latex/Font_sizes%2C_families%2C_and_styles)

![img](https://pic1.zhimg.com/v2-dcbdbbd2b797afc6949cc88ed901a172_1440w.jpg)

### 11.2 数学字体

举例：

blackboard bold：\mathbb{字母}

<img src="../image/image-20250923210043855.png" alt="image-20250923210043855" />

[calligraphic font](https://zhida.zhihu.com/search?content_id=188233767&content_type=Article&match_order=1&q=calligraphic+font&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3NTg4MDQ5NjYsInEiOiJjYWxsaWdyYXBoaWMgZm9udCIsInpoaWRhX3NvdXJjZSI6ImVudGl0eSIsImNvbnRlbnRfaWQiOjE4ODIzMzc2NywiY29udGVudF90eXBlIjoiQXJ0aWNsZSIsIm1hdGNoX29yZGVyIjoxLCJ6ZF90b2tlbiI6bnVsbH0.SfvisgWL8dY2It67Rn4lsFBFGHECDlxW4pDyWHyz_G4&zhida_source=entity)：\mathcal{字母}

<img src="../image/image-20250923210128430.png" alt="image-20250923210128430" />

[fraktur](https://zhida.zhihu.com/search?content_id=188233767&content_type=Article&match_order=1&q=fraktur&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3NTg4MDQ5NjYsInEiOiJmcmFrdHVyIiwiemhpZGFfc291cmNlIjoiZW50aXR5IiwiY29udGVudF9pZCI6MTg4MjMzNzY3LCJjb250ZW50X3R5cGUiOiJBcnRpY2xlIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.7E20AhJPG3gkbsJP8A9xn-CAzdzkYxXC-sbON74hh6M&zhida_source=entity)：\mathfrak{字母}

<img src="../image/image-20250923210159544.png" alt="image-20250923210159544" />

## 12 官方

<img src="https://pic1.zhimg.com/v2-e1bcaae080a57fa51bfdc81b9af18546_1440w.jpg" data-caption="" data-size="normal" data-original="https://pic1.zhimg.com/v2-e1bcaae080a57fa51bfdc81b9af18546_r.jpg" style="">

<img src="https://pica.zhimg.com/v2-3a9ed0ce22adbd6ddd7fba6868f2d22c_1440w.jpg" data-caption="" data-size="normal" class="origin_image zh-lightbox-thumb" width="2109" data-original="https://pica.zhimg.com/v2-3a9ed0ce22adbd6ddd7fba6868f2d22c_r.jpg">

<img src="https://pica.zhimg.com/v2-a62ff8bf9ffcad951c75db041f8dac98_1440w.jpg" data-caption=""  data-original="https://pica.zhimg.com/v2-a62ff8bf9ffcad951c75db041f8dac98_r.jpg" style="">

<img src="https://pic1.zhimg.com/v2-e027cdaafb751ca8e577a5392203497a_1440w.jpg" data-caption="" data-original="https://pic1.zhimg.com/v2-e027cdaafb751ca8e577a5392203497a_r.jpg" style="">

$\xleftarrow{n=0}, \xrightarrow[T]{n>0}$ \xleftarrow{n=0}, \xrightarrow[T]{n>0}

 $\max\limits_{x}$: 字符在正下方，\max\limits_{x}