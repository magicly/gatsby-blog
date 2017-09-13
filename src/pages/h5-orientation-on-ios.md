---
title: 手机上如何让页面强制横屏
draft: false
tags: [h5]
category: FE
date: "2017-08-07T12:16:16Z"
math: true
---

今天有朋友咨询我说是不是iOS没有企业开发证书， 没办法横屏，搞得我云里雾里。 我说不会吧， 谁告诉你的。 他说是他们外包了一个小游戏， 外包的开发人员给他们说的。。。我给他看了一个appstore里的小游戏，是可以横屏的，而且也是个人开发者。 他问了，然后给我说，开发人员说是因为他们用的H5开发的原因。为了破除这个谣言， 我准备自己测试一下。

<!-- more -->

首先准备一段html内容：
```jsx
  <div id="content">
    <p>谁说html5不能横屏的。。。</p>
    <p>我就是要横屏。。。</p>
    <p>要横屏。。。</p>
    <p>横屏。。。</p>
    <p>屏。。。</p>
    <p>图片也是可以的。<img src="http://img001.photo.21cn.com/photos/album/20120904/o/6A7A403C29766CBCB38C616BDFD48486.jpg" /></p>
  </div>
```
其实原理很简单，只需要把内容向右旋转90度就变成了横屏啊。先把定位修改为`absolute`：
```css
    #content {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    #content p {
      margin: auto;
      margin-top: 20px;
      text-align: center;
    }
    img {
      width: 100px;
    }
```
其实除了`position: absolute;`这行代码其他都是不必要的，其他只是为了做一些居中对齐等。然后我们用js判断是竖屏(portrait)还是横屏(landscape)，如果是竖屏，向右旋转90度。
```js
  const width = document.documentElement.clientWidth;
  const height = document.documentElement.clientHeight;
  if (width < height) {
    console.log(width + " " + height);
    const contentDOM = document.getElementById('content');
    contentDOM.style.width = height + 'px';
    contentDOM.style.height = width + 'px';
    contentDOM.style.top = (height - width) / 2 + 'px';
    contentDOM.style.left = 0 - (height - width) / 2 + 'px';
    contentDOM.style.transform = 'rotate(90deg)';
  }
```
![正确旋转](/blogimgs/landscape-right.png)

但是如果用户的屏幕旋转按钮开着，然后用户又把手机横过来，就悲剧了，如下图。
![错误旋转](/blogimgs/landscape-wrong.png)

所以我们还需要监听屏幕变化，如果用户自己把屏幕横过来，就把之前的旋转去掉。
```js
  const evt = "onorientationchange" in window ? "orientationchange" : "resize";
  window.addEventListener(evt, function () {
    const width = document.documentElement.clientWidth;
    const height = document.documentElement.clientHeight;
    const contentDOM = document.getElementById('content');
    alert('width: ' + width + ' height: ' + height)
    if (width > height) { // 横屏
      contentDOM.style.width = width + 'px';
      contentDOM.style.height = height + 'px';
      contentDOM.style.top = '0px';
      contentDOM.style.left = '0px';
      contentDOM.style.transform = 'none';
    }
    else { // 竖屏，这里微信应该由bug，我切换为竖屏的时候，width:375, height: 323, 导致不能旋转角度。 在safari、chrome上是正确的。
      alert('change to portrait')
      contentDOM.style.width = height + 'px';
      contentDOM.style.height = width + 'px';
      contentDOM.style.top = (height - width) / 2 + 'px';
      contentDOM.style.left = 0 - (height - width) / 2 + 'px';
      contentDOM.style.transform = 'rotate(90deg)';
    }

  }, false);
```

完整的Demo请看[这里](/orientation.html)。

[这篇文章](http://www.gad.qq.com/article/detail/25663)里说了，
> 直到如今有些人仍在说，如果做H5游戏一定要做竖屏游戏，其实要是深入了解一下，说这些话的，很大一部分是2015年或更早进入H5游戏行业中来的，还有一部分是受到那些早期做H5游戏影响的人。

可见不是不能做， 而是他们没有跟上最新的技术步伐， 或者他们嫌太麻烦了或者他们做不出来吧。可见找到一个靠谱的外包服务团队是多么不容易啊。 [漫极客科技](https://www.magicfun.ai)是一家致力于为客户提供高效率高质量服务的靠谱的技术公司，公司创始人曾在人人网、网易游戏、腾讯等多家知名互联网公司工作， 掌握web、app、数据分析、人工智能等多种技术，期待“用技术优化生活”， 改善众多客户的生活质量。有需要请联系他们~

# Refers
* http://www.jianshu.com/p/9c3264f4a405
* http://tgask.qq.com/?/article/4
* http://www.gad.qq.com/article/detail/25663
* https://www.zhihu.com/question/26631812
* https://segmentfault.com/q/1010000006686885