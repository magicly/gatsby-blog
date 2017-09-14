---
title: CSS常用布局
draft: false
tags: [css]
category: FE
date: "2017-07-19T17:45:42Z"
---

=========2017-09-14更新===========

推荐大家看看这个网站[learnlayout](http://learnlayout.com/)， 比较全面。

其中可能会经常看到下面这段话：
> Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

我查了一下，原来是用于排版演示用的拉丁文：
> Lorem ipsum是指一篇常用于排版设计领域的拉丁文文章，主要的目的为测试文章或文字在不同字型、版型下看起来的效果。中文的类似用法则称为乱数假文、随机假文。

有兴趣的可以看看[Wiki](https://zh.wikipedia.org/wiki/Lorem_ipsum)， 我还发现原来阮一峰老师之前也写过一篇[介绍文章](http://www.ruanyifeng.com/blog/2009/04/lorem_ipsum.html)呢。

==============================

布局是CSS中一个很重要的部分，甚至我觉得是最重要也是最难的部分，其他诸如字体大小、颜色等等都是很容易的。最近总结一下使用过的CSS常用布局，包括水平居中、垂直居中、单列布局、多列布局等，以及最新的flex布局，希望能给前端小伙伴一些帮助，也作为自己的知识总结。

<!-- more -->
在后面的例子中，我特意将各个块背景颜色调出来方便大家“欣赏”。

# 水平居中

## 子元素为inline
直接对父元素设置
```css
text-align: center
```
如：
```html
<div style="background-color: red; text-align: center; height: 100px;">
    <a href="https://magicly.me" style="background-color: green;">magicly</a>
</div>
```
显示为：
<div style="background-color: red; text-align: center; height: 100px;">
    <a href="https://magicly.me" style="background-color: green;">magicly</a>
</div>

## 子元素为block且定宽（宽度可以是百分比）
对子元素设置左右margin为auto
```css
margin: 0 auto;
```
如：
```html
<div style="background-color: red; height: 100px;">
    <div style="background-color: green; width: 500px; margin: 0 auto;">magicly</div>
</div>
```
显示为：
<div style="background-color: red; height: 100px;">
    <div style="background-color: green; width: 500px; margin: 0 auto;">magicly</div>
</div>

## 子元素为block但是不定宽
设置子元素
```css
display: inline
```
以及设置父元素
```css
text-align: center;
```
如：
```html
<div style="background-color: red; text-align: center;">
    <div style="background-color: green; display: inline"><img src="http://img001.photo.21cn.com/photos/album/20120904/o/6A7A403C29766CBCB38C616BDFD48486.jpg" /></div>
</div>
```
显示为：
<div style="background-color: red; text-align: center;">
    <div style="background-color: green; display: inline"><img src="http://img001.photo.21cn.com/photos/album/20120904/o/6A7A403C29766CBCB38C616BDFD48486.jpg" /></div>
</div>

# 垂直居中
## 子元素为inline
设置父元素的height和line-height相等， 如：
```html
<div style="background-color: red; text-align: center; height: 100px; line-height: 100px;">
    <a href="https://magicly.me" style="background-color: green;">magicly</a>
</div>
```
显示为：
<div style="background-color: red; text-align: center; height: 100px; line-height: 100px;">
    <a href="https://magicly.me" style="background-color: green;">magicly</a>
</div>

## 子元素为block
设置子元素position:absolute 并设置top、bottom为0（如果还要左右居中的话，可以设置left: 0; right: 0;），父元素要设置定位为static以外的值（如relative），margin:auto;
如：
```html
<div style="background-color: red; height: 600px; position: relative;">
    <div style="background-color: green; height: 569px; width: 462px; position: absolute; top: 0; bottom: 0; left:0; right: 0; margin: auto;"><img src="http://img001.photo.21cn.com/photos/album/20120904/o/6A7A403C29766CBCB38C616BDFD48486.jpg" /></div>
</div>
```
显示为：
<div style="background-color: red; height: 600px; position: relative;">
    <div style="background-color: green; height: 569px; width: 462px; position: absolute; top: 0; bottom: 0; left:0; right: 0; margin: auto;"><img src="http://img001.photo.21cn.com/photos/album/20120904/o/6A7A403C29766CBCB38C616BDFD48486.jpg" /></div>
</div>

# 单列布局
主要有两种:
* header, content, footer宽度相同，有一个max-width
* header和footer占满浏览器100%宽度，content有一个max-width

第一种：
```html
<header style="background-color: red; width: 600px; margin: 0 auto;">头部</header>
<main style="background-color: green; width: 600px; margin: 0 auto;">内容</main>
<footer style="background-color: yellow; width: 600px; margin: 0 auto;">尾部</footer>
```
显示为：
<header style="background-color: red; width: 600px; margin: 0 auto;">头部</header>
<main style="background-color: green; width: 600px; margin: 0 auto;">内容</main>
<footer style="background-color: yellow; width: 600px; margin: 0 auto;">尾部</footer>

第二种：
```html
<header style="background-color: red;">头部</header>
<main style="background-color: green; width: 600px; margin: 0 auto;">内容</main>
<footer style="background-color: yellow;">尾部</footer>
```
显示为：
<header style="background-color: red;">头部</header>
<main style="background-color: green; width: 600px; margin: 0 auto;">内容</main>
<footer style="background-color: yellow;">尾部</footer>

# 两列
## float + margin
用float将边栏与主要内容拉到一行，然后设置主要内容的margin。
* 左边栏:
```html
<main style="background-color: red;">
  <aside style="background-color: yellow; float: left; width: 50px;">边栏</aside>
  <section style="background-color: green; margin-left: 50px;">主要内容</section>
</main>
```
<main style="background-color: red;">
  <aside style="background-color: yellow; float: left; width: 50px;">边栏</aside>
  <section style="background-color: green; margin-left: 50px;">主要内容</section>
</main>
* 右边栏
```html
<main style="background-color: red;">
<aside style="background-color: yellow; float: right; width: 50px;">边栏</aside>
<section style="background-color: green; margin-right: 50px;">主要内容</section>
</main>
```
<main style="background-color: red;">
<aside style="background-color: yellow; float: right; width: 50px;">边栏</aside>
<section style="background-color: green; margin-right: 50px;">主要内容</section>
</main>

## position: absolute + margin
* 左边栏:
```html
<main style="background-color: red; position: relative;">
  <aside style="background-color: yellow; position: absolute; left: 0; width: 50px;">边栏</aside>
  <section style="background-color: green; margin-left: 50px;">主要内容</section>
</main>
```
<main style="background-color: red; position: relative;">
  <aside style="background-color: yellow; position: absolute; left: 0; width: 50px;">边栏</aside>
  <section style="background-color: green; margin-left: 50px;">主要内容</section>
</main>

* 右边栏
```html
<main style="background-color: red; position: relative;">
<aside style="background-color: yellow; position: absolute; right: 0; width: 50px;">边栏</aside>
<section style="background-color: green; margin-right: 50px;">主要内容</section>
</main>
```
<main style="background-color: red; position: relative;">
<aside style="background-color: yellow; position: absolute; right: 0; width: 50px;">边栏</aside>
<section style="background-color: green; margin-right: 50px;">主要内容</section>
</main>

# 三列布局
比较经典有圣杯布局，以及据说是淘宝UED（玉伯）提出的双飞翼布局。
## 圣杯布局
```html
<header style="background-color: red;">头部</header>
<main style="background-color: black; position: relative; padding: 0 100px 0 90px;">
  <section style="background-color: green; height: 100px; float: left; width: 100%;">主要内容</section>
  <aside style="background-color: yellow; height: 100px; float: left; width: 90px; margin-left: -100%; position: relative; left: -90px;">左边栏</aside>
  <aside style="background-color: yellow; height: 100px; float: left; width: 100px; margin-left: -100px; position: relative; right: -100px;">右边栏</aside>
</main>
<div style="background-color: blue; clear: left;">尾部</div>
```
显示为：
<header style="background-color: red;">头部</header>
<main style="background-color: black; position: relative; padding: 0 100px 0 90px;">
  <section style="background-color: green; height: 100px; float: left; width: 100%;">主要内容</section>
  <aside style="background-color: yellow; height: 100px; float: left; width: 90px; margin-left: -100%; position: relative; left: -90px;">左边栏</aside>
  <aside style="background-color: yellow; height: 100px; float: left; width: 100px; margin-left: -100px; position: relative; right: -100px;">右边栏</aside>
</main>
<div style="background-color: blue; clear: left;">尾部</div>

## 双飞翼布局
传统的双飞翼布局不是这样的， 只是我发现直接在section用padding也可以达到效果。
```html
<header style="background-color: red;">头部</header>
<main style="background-color: black; position: relative;">
  <section style="background-color: green; height: 100px; float: left; width: 100%; padding: 0 100px 0 90px;">主要内容</section>
  <aside style="background-color: yellow; height: 100px; float: left; width: 90px; margin-left: -100%;">左边栏</aside>
  <aside style="background-color: yellow; height: 100px; float: left; width: 100px; margin-left: -100px;">右边栏</aside>
</main>
<div style="background-color: blue; clear: left;">尾部</div>
```
显示为：
<header style="background-color: red;">头部</header>
<main style="background-color: black; position: relative;">
  <section style="background-color: green; height: 100px; float: left; width: 100%; padding: 0 100px 0 90px;">主要内容</section>
  <aside style="background-color: yellow; height: 100px; float: left; width: 90px; margin-left: -100%;">左边栏</aside>
  <aside style="background-color: yellow; height: 100px; float: left; width: 100px; margin-left: -100px;">右边栏</aside>
</main>
<div style="background-color: blue; clear: left;">尾部</div>

圣杯布局和双飞翼布局的原理[这篇文章](http://www.cnblogs.com/star91/p/5773436.html)讲解得比较清楚，我就不再赘述。

# flex布局
flex布局目前已经很常用了，浏览器支持得也很好，甚至连[React Native]()也是用flex布局的，这么重要想想也觉得应该单独成篇啦。后续再写，有兴趣的可以看看阮老师的下面两篇文章。
* http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html
* http://www.ruanyifeng.com/blog/2015/07/flex-examples.html

# Refers
* https://zhuanlan.zhihu.com/p/25565751
* http://www.cnblogs.com/star91/p/5773436.html
* http://www.zhangxinxu.com/wordpress/2013/11/margin-auto-absolute-绝对定位-水平垂直居中/
* https://www.w3schools.com/html/html5_semantic_elements.asp
* http://coolshell.cn/articles/6840.html