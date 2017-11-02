---
title: 前端高性能计算之一：WebWorkers
draft: false
tags: [js, hpc]
category: FE
date: "2017-09-22T17:09:52Z"

---

最近做一个项目，里面涉及到在前端做大量计算，直接用js跑了一下，大概需要15s的时间， 也就是用户的浏览器会卡死15s，这个完全接受不了。

虽说有V8这样牛逼的引擎，但大家知道js并不适合做CPU密集型的计算，一是因为单线程，二是因为动态语言。我们就从这两个突破口入手，首先搞定“单线程”的限制，尝试用WebWorkers来加速计算。

<!-- more -->

# 什么是WebWorkers
简单说，[WebWorkers][WebWorkers]是一个HTML5的新API，web开发者可以通过此API在后台运行一个脚本而不阻塞UI，可以用来做需要大量计算的事情，充分利用CPU多核。

大家可以看看这篇文章介绍https://www.html5rocks.com/en/tutorials/workers/basics/， 或者[对应的中文版](https://www.html5rocks.com/zh/tutorials/workers/basics/)。
> The Web Workers specification defines an API for spawning background scripts in your web application. Web Workers allow you to do things like fire up long-running scripts to handle computationally intensive tasks, but without blocking the UI or other scripts to handle user interactions. 

可以打开[这个链接](https://nerget.com/rayjs-mt/rayjs.html)自己体验一下WebWorkers的加速效果。

现在浏览器基本都[支持WebWorkers了](https://caniuse.com/#search=webworkers)。
![can i use webworkers](/blogimgs/caniuse-webworkers.png)

# Parallel.js 
直接使用[WebWorkers][WebWorkers]接口还是太繁琐，好在有人已经对此作了封装：[Parallel.js][]。

注意[Parallel.js][]可以通过node安装：
```bash
$ npm install paralleljs
```
不过这个是在node.js下用的，用的node的cluster模块。如果要在浏览器里使用的话， 需要直接应用js:
```html
<script src="parallel.js"></script>
```
然后可以得到一个全局变量，`Parallel`。`Parallel`提供了`map`和`reduce`两个函数式编程的接口，可以非常方便的进行并发操作。

我们先来定义一下我们的问题，由于业务比较复杂，我这里把问题简化成求1-1,0000,0000的和，然后在依次减去1-1,0000,0000，答案显而易见： 0！ 这样做是因为数字太大的话会有数据精度的问题，两种方法的结果会有一些差异，会让人觉得并行的方法不可靠。此问题在我的mac pro chrome61下直接简单地跑js运行的话大概是1.5s（我们实际业务问题需要15s，这里为了避免用户测试的时候把浏览器搞死，我们简化了问题）。
```js
const N = 100000000;// 总次数1亿

// 更新自2017-10-24 16：47：00
// 代码没有任何含义，纯粹是为了模拟一个耗时计算，直接用
//   for (let i = start; i <= end; i += 1) total += i;
// 有几个问题，一是代码太简单没有任何稍微复杂一点的操作，后面用C代码优化的时候会优化得很夸张，没法对比。
// 二是数据溢出问题， 我懒得处理这个问题，下面代码简单地先加起来，然后再减掉，答案显而易见为0，便于测试。
function sum(start, end) {
  let total = 0;
  for (let i = start; i <= end; i += 1) {
    if (i % 2 == 0 || i % 3 == 1) {
      total += i;
    } else if (i % 5 == 0 || i % 7 == 1) {
      total += i / 2;
    }
  }
  for (let i = start; i <= end; i += 1) {
    if (i % 2 == 0 || i % 3 == 1) {
      total -= i;
    } else if (i % 5 == 0 || i % 7 == 1) {
      total -= i / 2;
    }
  }

  return total;
}

function paraSum(N) {
  const N1 = N / 10;//我们分成10分，没分分别交给一个web worker，parallel.js会根据电脑的CPU核数建立适量的workers
  let p = new Parallel([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .require(sum);
  return p.map(n => sum((n - 1) * 10000000 + 1, n * 10000000))// 在parallel.js里面没法直接应用外部变量N1
    .reduce(data => {
      const acc = data[0];
      const e = data[1];
      return acc + e;
    });
}

export { N, sum, paraSum }
```
代码比较简单，我这里说几个刚用的时候遇到的坑。
* **require所有需要的函数**

比如在上诉代码中用到了`sum`，你需要提前`require(sum)`，如果sum中由用到了另一个函数`f`，你还需要`require(f)`，同样如果`f`中用到了`g`，则还需要`require(g)`，直到你require了所有用到的定义的函数。。。。

* **没法`require`变量**

我们上诉代码我本来定义了`N1`，但是没法用

* **`ES6`编译成`ES5`之后的问题以及Chrome没报错**

实际项目中一开始我们用到了`ES6`的特性：[数组解构](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)。本来这是很简单的特性，现在大部分浏览器都已经支持了，不过我当时配置的babel会编译成`ES5`，所以会生成代码`_slicedToArray`，大家可以[在线上Babel测试](http://babeljs.io/repl/#?babili=false&browsers=&build=&builtIns=false&code_lz=GYVwdgxgLglg9mABMAFAbQIYBpECMC6AlIgN4BQiiATgKZQhVIaIDUeA3GQL5lkDmiALzJ0AJhwBmImQgIAznAA2NAHSK4fFH0JA&debug=false&circleciRepo=&evaluate=true&lineWrap=false&presets=es2015%2Creact%2Cstage-2&prettier=false&targets=&version=6.26.0)，然后Chrome下面始终不work，也没有任何报错信息，查了很久，后来在Firefox下打开，有报错信息：
```html
ReferenceError: _slicedToArray is not defined
```
看来Chrome也不是万能的啊。。。

大家可以在[此Demo页面](./parallel-test)测试， 提速大概在4倍左右，当然还是得看自己电脑CPU的核数。
另外我后来在同样的电脑上Firefox55.0.3（64位）测试，上诉代码居然只要190ms！！！在Safari9.1.1下也是190ms左右。。。

# Refers
* https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API/Using_web_workers
* https://www.html5rocks.com/en/tutorials/workers/basics/
* https://parallel.js.org/
* https://johnresig.com/blog/web-workers/
* http://javascript.ruanyifeng.com/htmlapi/webworker.html
* http://blog.teamtreehouse.com/using-web-workers-to-speed-up-your-javascript-applications


[WebWorkers]: http://www.whatwg.org/specs/web-workers/current-work/
[parallel.js]: https://parallel.js.org/