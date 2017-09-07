---
title: bezier-curve
draft: false
tags: [js, css, animation, beizer curve]
category: FE
date: "2016-11-29T11:09:52Z"

---

# 什么是贝塞尔曲线

最近做一个动画效果时需要将物体做曲线移动， 本来记得css3里的动画是可以指定beizer curve的， 结果用的时候发现css3的beizer curve只用来做easing timing function。简单来说就是拿来控制动画“非线性”移动，比如越来越快（ease-in）， 越来越慢（ease-out），先慢后快再慢（ease-in-out）等， 让动画效果更“灵动”， 避免线性（linear）的死板。

可以看看这两个页面， 有一个直观的感受。

<!-- more -->

* http://cubic-bezier.com/
* http://easings.net/zh-cn

beizer curve在css3中的使用， 可以自己google一下， 或者看下：
* http://www.w3school.com.cn/css3/css3_transition.asp
* http://www.ruanyifeng.com/blog/2014/02/css_transition_and_animation.html

引用wiki上的介绍：

        在数学的数值分析领域中，贝塞尔曲线（英语：Bézier curve）是计算机图形学中相当重要的参数曲线。更高维度的广泛化贝塞尔曲线就称作贝塞尔曲面，其中贝塞尔三角是一种特殊的实例。
        贝塞尔曲线于1962年，由法国工程师皮埃尔·贝塞尔（Pierre Bézier）所广泛发表，他运用贝塞尔曲线来为汽车的主体进行设计。贝塞尔曲线最初由Paul de Casteljau于1959年运用de Casteljau算法开发，以稳定数值的方法求出贝塞尔曲线。

有数学功底或者有兴趣的可以参考下面几篇文章， 我就不赘述了（最讨厌那种什么都要copy过来，弄得好像跟是自己写的样， 别人已经写得很清楚了， 干嘛再重复劳动一遍呢， 又没有自己的新的见解，赠人链接， 手留余香。 😁哈）。

* https://en.wikipedia.org/wiki/B%C3%A9zier_curve
* https://zh.wikipedia.org/wiki/%E8%B2%9D%E8%8C%B2%E6%9B%B2%E7%B7%9A
* http://www.html-js.com/article/1628
* http://www.cnblogs.com/hnfxs/p/3148483.html
* 

# 在线工具

下面是几个比较有用的工具， 方便大家。

* http://blogs.sitepointstatic.com/examples/tech/canvas-curves/quadratic-curve.html
* http://myst729.github.io/bezier-curve/
* http://xuanfengge.com/easeing/ceaser/
* http://yisibl.github.io/cubic-bezier/#.17,.67,.83,.67
* http://cubic-bezier.com/#.17,.67,.83,.67


# 实现

前面资料都是把bezier curve拿来当timing function的， 而我的需求是要让物体（某个dom节点）沿着某条beizer curve移动，于是继续google， 找到了几个。

* Android实现: https://github.com/Yasic/QQBubbleView

Android的我用不到， 放这里主要是里面的gif图很直观，哈哈。

* CSS实现：http://jinlong.github.io/2016/01/14/moving-along-a-curved-path-in-css-with-layered-animation/， 原文：http://tobiasahlin.com/blog/curved-path-animations-in-css/

CSS的实现真是相当tricky， 我解释一下。CSS里面的animation translate是直接按照直线移动到目的地的， 这是因为沿X轴和Y轴都是匀速运动（linear），所以合成之后的速度必然是斜角45°移动过去的。我们可以把X轴看成时间轴， 这时如果Y轴的移动函数是某个beizer curve，那合成之后的移动曲线就是beizer curve了。具体实现的时候还用到了:after伪元素了。

复杂一点的我觉得还是需要用js去控制， 于是自然想到了用js代码去按照beizer curve公式实现。

* JS实现： http://blog.csdn.net/cuixiping/article/details/6872095

这个用的公式不直观，应该是进行了变换之后的， 我直接照着公式写了一个。
```javascript{1-2,22}
function PointOnCubicBezier2(cp, t)  {
   // B(t) = P0 * (1-t)^3 + 3 * P1 * t * (1-t)^2 + 3 * P2 * t^2 * (1-t) + P3 * t^3
        const one_t = 1.0 - t;
        const P0 = cp[0];
        const P1 = cp[1];
        const P2 = cp[2];
        const P3 = cp[3];
        const x =  (P0.x * Math.pow(one_t, 3) + 3 * P1.x * t * Math.pow(one_t, 2) + 3 * P2.x * Math.pow(t, 2) * one_t + P3.x * Math.pow(t, 3));
        const y =  (P0.y * Math.pow(one_t, 3) + 3 * P1.y * t * Math.pow(one_t, 2) + 3 * P2.y * Math.pow(t, 2) * one_t + P3.y * Math.pow(t, 3));
        const pointF = new Point2D(x, y);
        return pointF;
}
```
对比了一下两个函数的输出值， 完全是一样的， 应该就是数学变换而已， 我懒得去做推倒了。

后来找到一个三阶beizer curve的实现，看这里
https://github.com/gre/bezier-easing， 这个实现可能有点NB，以至于[React Native](https://facebook.github.io/react-native/)、[Velocity](http://velocityjs.org/)等项目都使用了，屌屌的。

用[benchmark](https://github.com/bestiejs/benchmark.js)跑一下分：[看这里](https://jsperf.com/beizer-curve5)， chrome下我写的方法居然慢了94%！看样子代码可读性是要付出代价的哈。我还是老老实实用https://github.com/gre/bezier-easing吧。

刚刚又搜到一篇文章， 讲解地更细致深入， 害得我不想继续写了。 直接看这里吧。http://www.jianshu.com/p/55c721887568


# 如何将多个点用贝塞尔曲线连起来
* http://www.zheng-hang.com/?id=43
* http://www.cnblogs.com/hnfxs/p/3148743.html
