---
title: 一些调试技巧
draft: false
tags: [debug, tips]
category: Tips
date: "2018-12-01T16:58:42Z"
---

调试是一门大学问， 好的工程师能快速分析、查找并解决问题。 有效的调试技能是通往高级工程师的必修课。 最近刚好看到别人总结的一些调试技巧， 整理了一下经常遇到的问题以及对应的方法等， 分享一下。

<!-- more -->

# 步骤

Debug 就像科学实验， 有假设、做实验、验证猜想、推翻重来等等步骤。

## Reading 读代码

认认真真多读几遍代码， 确保看懂了然后再去开始调试。 很多时候， 光靠阅读代码自己就能发现问题了。 **这个真的很重要！！！**

## Running 运行

把程序运行起来， 看看到底哪里出错了。

## Ruminating 反复思考

分析一下， 错误属于哪种： 语法错误， 运行时错误， 语义错误？ 有哪些线索， 是最近改什么东西导致错误的呢？ 如果不分析问题， 很容易进入“random walk programming”， 通俗点说就是瞎蒙碰运气。

## Rubberducking 橡皮鸭调试法

很多时候， 你把问题解释给别人听，很有可能， 问题还没有说完， 你已经突然发现问题所在了。相信很多人都遇到过吧。 因为你在叙述的过程中，需要重新总结归纳问题， 很有可能就找到了问题所在。 而事实证明， 你并不需要真的跟一个“人”说， 随便找个玩具对着它解释也可以， 比如橡皮鸭。 参加： https://en.wikipedia.org/wiki/Rubber_duck_debugging 。

## Retreating 后退

退一步海阔天空。 有时候最好的方法就是回退到没有问题的版本， 然后把修改一点一点加进去。 **不要怕删代码！**你可以 copy 一份， 或者新建一个 branch 等。

最好能构建一个能复现问题的最小化场景。 如果是在庞大的系统中去测试修改某个 bug， 效率是极低的， 因为 feedback 速度很慢。 需要经过分析， 把问题剥离出来， 构建一个尽量小的问题场景， 便于分析和快速修复问题。 比如， 你绝对不应该在一个管理系统的代码中去测试 splice 和 slice 的区别。

# 一些常见的错误类型

## Syntax Errors

一般编译器会告诉你， 如果是 JS 之类的动态语言， 可以配置 Lint 等工具， 也能帮助发现很多潜在的问题。 当然编译器不一定很准确， 错误有可能是在编译器报错的附近， 比如前一行等。

- I keep making changes and it makes no difference

  看看你改的代码是不是没有 Save， 或者改的代码跟运行的是不是不是同一份。 想起以前有人做饭， 嫌汤太淡了， 一直加盐都还是淡， 最后发现一直喝的是最开始盛起来的那碗汤。 方法是在代码最开始， 故意弄个错误， 看看编译器有没有报这个错误。

## Runtime Errors

- My program hangs

  程序“卡住了”， 很可能是死循环或者无限递归， 可以在 for 或者 function 里面添加一些打印信息， 看看条件为啥一直不变。

## Semantic Errors

- I’ve got a big hairy expression and it doesn’t do what I expect

  适当加一些临时变量， 比如：

```js
addcard(game.hands[i], popcard(game.hands[findneighbor(game, i)]));
```

变成

```js
neighbor = findneighbor(game, i);
pickedcard = popcard(game.hands[neighbor]);
addcard(game.hands[i], pickedcard);
```

如果运算符优先级不清楚的， 建议用()明确地表示清楚。

- I’ve got a function that doesn’t return what I expect

  返回之前把返回值打印出来：

```js
return removematches(game.hands[i]);
```

变成

```js
count = removematches(game.hands[i]);
println(count);
return count;
```

- I’m really, really stuck and I need help

  **站起来出去玩会儿。 没开玩笑， 我是认真的！** 我从高中的时候就知道死盯着书解决不了问题， 有道很难的几何题我是在操场上看着树影的样子想到解法的。 作者说长时间盯着电脑找不到 bug， 很可能会出现以下症状：

  - 泄气和愤怒
  - Superstitious beliefs (“the computer hates me”) and magical thinking (“the program only works when I wear my hat backward”). ======这个很有意思， 我不翻译了哈。
  - Random walk programming

- No, I really need help

  如果之前的方法都试了， 还是不行， 没关系， 再牛的大神都有需要帮助的时候。 但是在找人帮助之前， 请做好以下事情：

  - If there is an error message, what is it and what part of the program does it indicate?
  - What was the last thing you did before this error occurred? What were the last lines of code that you wrote, or what is the new test case that fails?
  - What have you tried so far, and what have you learned?

# 总结

等最后找到了 bug， 记得总结反思， 问题是怎么导致的， 以及很重要的， **你是怎么发现 bug 的**， **如果你怎么做的话可以早点发现 bug**！ 记住， 我们的目标不是仅仅让程序 work， 而是学习怎样使程序 work！

> Remember, the goal is not just to make the program work. The goal is to learn how to make the program work.

推荐大家看一下原文， 虽然是讲 Julia 编程的， 但是讲了很多好的编程方法和习惯以及调试技巧等。调试部分可以直接看：

- https://benlauwens.github.io/ThinkJulia.jl/latest/book.html#_debugging_11
- https://benlauwens.github.io/ThinkJulia.jl/latest/book.html#chap21

欢迎加入知识星球一起分享讨论高效的调试技巧。

![星球jsforfun](/blogimgs/xq-jsforfun.jpg)
