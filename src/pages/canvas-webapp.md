---
title: 照片合成webapp项目总结
draft: false
tags: [React, canvas, svg, html2canvas, HOC]
category: FE
date: "2018-01-29T14:48:24Z"
---

最近做了一个小项目， 在微信里面根据用户选择的模板、用户微信头像、昵称、用户选择上传的照片合成一个图片，用户可以保存到手机上，然后发朋友圈。

说复杂其实不复杂， 总结一下其中踩过的坑。

<!-- more -->

# 用Canvas合成照片
最开始是打算自己写Canvas，绘制照片、文字等， 最后调用canvas的`toDataURI()`方法合成照片的。但是canvas上又不方便响应用户点击等操作，还得用dom写一遍， 感觉就有点重复了。 后来想起以前用过的[html2canvas库](https://github.com/niklasvh/html2canvas)，果断用之，很方便。顺便还搜到几个其他的库，不过暂时没用过，先mark一下：
* https://github.com/tsayen/dom-to-image

这里有几篇blog介绍使用的，可以看看，当然官网文档永远是最权威的，适当的时候还需要看下源码。
* https://segmentfault.com/a/1190000011478657
* https://www.jianshu.com/p/a99312eacf4f
* https://www.h5jun.com/post/convert-code-to-image-via-html2canvas.html

# Retina屏幕下canvas模糊
马上问题来了， retina屏幕下（mac pro、iphone6+）保存出来的图片是模糊的。这个主要是canvas宽高的单位跟css单位不一致，retina屏幕下用了4倍像素渲染造成的。需要了解CSS像素、物理像素、逻辑像素、PPI、devicePixelRatio等概念，可以参考下面几篇。
* https://segmentfault.com/q/1010000002391424
* https://segmentfault.com/a/1190000003730246
* https://www.html5rocks.com/en/tutorials/canvas/hidpi/
* https://github.com/jondavidjohn/hidpi-canvas-polyfill
* https://github.com/jawil/blog/issues/21
* https://div.io/topic/1092
* http://www.dengzhr.com/frontend/html/1050
* https://benweizhu.github.io/blog/2017/03/25/css-retina-image/
* https://www.zhihu.com/question/21653056
* https://github.com/strues/retinajs
* https://mutian.wang/tech/1386
* https://www.webdesignerdepot.com/2015/08/the-state-of-responsive-images/
* https://coderwall.com/p/vmkk6a/how-to-make-the-canvas-not-look-like-crap-on-retina
*


## 弧形文字
设计稿有一个模板里面文字是弧形的，用svg实现了：
* https://www.w3cplus.com/css3/css-secrets/circular-text.html

结果发现html2canvas没法保存svg。google之后发现html2canvas支持svg有问题：
* https://github.com/niklasvh/html2canvas/issues/95
* https://github.com/niklasvh/html2canvas/issues/197
* https://github.com/niklasvh/html2canvas/issues/267

我用inline svg也是没法绘制出来的， 开启了`foreignObject`选项，结果svg文字是可以保存了， 但是很多我不想要的内容也出来了。
[foreignObject](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/foreignObject)这个不是很了解，以后再看吧。

搜了一下，发现一些把svg转成canvas的库， 大概看了一下觉得没必要引入，还不如直接自己canvas画好了。这些库mark一下：
* https://github.com/canvg/canvg
* https://github.com/kangax/fabric.js/
* http://flashcanvas.net/

没有解决，后来还是考虑自己用canvas画算了，参考下文：
* https://segmentfault.com/a/1190000006258726

## canvas裁剪圆
* https://www.kancloud.cn/dennis/canvas/340120

## canvas透明背景
* http://www.dengzhr.com/frontend/html/1096

## iPhone上竖屏拍摄图片旋转bug
iphone和部分三星手机上竖屏拍摄图片会旋转， 需要用[]()读取Orientation，来自己纠正。
* https://www.jianshu.com/p/8afd55beca5a
* https://www.bbsmax.com/A/VGzlMnYNJb/
* https://github.com/exif-js/exif-js/
* https://segmentfault.com/a/1190000009990033
* https://aotu.io/notes/2017/05/25/canvas-img-rotate-and-flip/index.html



## 轮播图
轮播图太通用不过了，网上也有很多代码或者插件（很多jQuery的插件）实现。推荐两个：
* https://github.com/kenwheeler/slick/
* https://github.com/nolimits4web/swiper/
两个功能几乎一样，不过slick需要jquery。
当然，两个都有react的移植：
* https://github.com/akiran/react-slick
* https://github.com/kidjp85/react-id-swiper
我最后用了react-id-swiper，可以根据自己需要选择。

## 图片裁剪
html5里面有[FileReader](https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader)特性， 可以在前端读取修改文件内容，再结合canvas，很容易就实现前端裁剪图片了。
* https://segmentfault.com/a/1190000000754560
结果看到有人说微信android版本，不支持长按保存base64方式的图片（canvas.toDataURI）的， 吓我一大跳，结果现在好像已经修复此bug了：
* https://mzkmzk.gitbooks.io/web_accumulate/wei_xin_base64_tu_pian_bao_cun_shi_bai.html
* https://segmentfault.com/q/1010000007709767
* http://www.cnblogs.com/Travel/p/4624929.html
* https://www.codecasts.com/blog/post/crop-image-local-using-html5-canvas
* https://dailc.github.io/2017/11/16/imageclip_rotate_compress.html
* http://www.cnblogs.com/Travel/p/4624929.html
* https://www.codecasts.com/blog/post/crop-image-local-using-html5-canvas
* https://github.com/DominicTobias/react-image-crop
* http://hpoenixf.com/%E4%B8%80%E4%B8%AA%E5%9F%BA%E4%BA%8Ereact%E7%9A%84%E5%9B%BE%E7%89%87%E8%A3%81%E5%89%AA%E7%BB%84%E4%BB%B6.html
* https://github.com/nitin42/react-imgpro
* https://github.com/AlloyTeam/AlloyImage
* https://github.com/AlloyTeam/AlloyFinger
* https://github.com/AlloyTeam/AlloyCrop
* https://github.com/AlloyTeam/AlloyTouch/wiki


## 读取图片每个像素点的RGB
* https://zhidao.baidu.com/question/752983355955636524.html
* http://js8.in/2013/01/02/html5-canvas-%E5%9B%BE%E7%89%87%E5%83%8F%E7%B4%A0/
* https://segmentfault.com/a/1190000004084956
* http://yijiebuyi.com/blog/58bcb7af4a0e3846d02d10def9fdeecc.html
* http://www.cnblogs.com/zichi/p/html5-file-api.html
* https://www.xiabingbao.com/html5/2015/05/20/html5-filereader-natural.html


## 滑动到屏幕底部
需要了解viewport、clientHeight、offsetHeight、scrollHeight、scrollTop等概念。
* http://www.cnblogs.com/w-wanglei/p/5863240.html
* http://imweb.io/topic/57c5409e808fd2fb204eef52
* https://www.jianshu.com/p/d267456ebc0d
* https://exp-team.github.io/blog/2017/02/25/js/infinite-scroll/
* https://stackoverflow.com/questions/22675126/what-is-offsetheight-clientheight-scrollheight
* https://cauu.github.io/2017/04/React-infinite-scroll-list/
* https://www.jianshu.com/p/97f5cbc66577


## ReactRouter v4在非组件页面使用history
* https://github.com/brickspert/blog/issues/3



## React高阶组件
最后用React高阶组件把各个模板重构了一下。
https://reactjs.org/docs/higher-order-components.html
> Concretely, a higher-order component is a function that takes a component and returns a new component.

注意，高阶组件是一个`function`，而不是component， 所以你只能`hoc(config)(ComponentA)`这样调用， 而不能`<Hoc config={config} component={ComponentA} />`这样调用， 因为调用过一次之后，返回的已经是React.Elements了。具体可以看https://reactjs.org/blog/2015/12/18/react-components-elements-and-instances.html

* https://reactjs.org/docs/higher-order-components.html
* https://segmentfault.com/a/1190000004598113
* https://medium.com/@franleplant/react-higher-order-components-in-depth-cf9032ee6c3e
* https://github.com/acdlite/recompose

高阶组件概念来自于函数式编程里面的高阶函数，如果不熟悉函数式编程， 可以看看下面的资料：
* https://github.com/MostlyAdequate/mostly-adequate-guide
* https://github.com/llh911001/mostly-adequate-guide-chinese
* http://eloquentjavascript.net/05_higher_order.html
* https://github.com/stoeffel/awesome-fp-js
* https://github.com/lodash/lodash/wiki/FP-Guide
* http://ramdajs.com/
* https://github.com/ramda/ramda-fantasy
* https://medium.freecodecamp.org/functional-programming-in-js-with-practical-examples-part-1-87c2b0dbc276


## React 16
在开发的过程中发现如下代码：
```jsx
f() {
  this.setState({...})
};
this.a += 1;
...
render() {
  ...
}
```
居然`render()`在`this.a += 1`之前执行？！！！跟setState函数是异步调用的说法不一致啊， 不知道是不是React16Fiber带来的特性， 抽空得好好研究下React16了。
