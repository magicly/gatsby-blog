---
title: 编译器-0
draft: false
tags: [compiler, interpreter, golang]
category: Compiler
date: "2018-09-14T21:45:42Z"
---

推荐几个编译学习资料：
* [Writing An Interpreter In Go](https://interpreterbook.com/)， 强烈推荐， 从0开始， 不用任何第三方库， 实现一个像JS的语言， 包括high order function, closure, array, object等复杂功能。
* [Writing A Compiler In Go](https://compilerbook.com/)， 前面的续集， 应该也不错。
* https://www.zhihu.com/question/21515496 ， 里面各种大牛推荐的资料， 不过作为非专业搞编译器的， 感觉传说中的龙、虎、鲸对我来说太厚重了， 准备有时间考虑看一下轮子哥推荐的《Parsing Techniques》
* https://www.zhihu.com/question/27686032 ， 买了《两周自制脚本语言》， 不过里面有用作者开发的工具库， 用Java写的。  感觉完全比不上[Writing An Interpreter In Go](https://interpreterbook.com/)， 话说我是在这里看到推荐的https://www.jianshu.com/p/39b244fda291 。
* Stanford的编译课程， 以前coursera上有， 现在下了，  可以在https://lagunita.stanford.edu/courses/Engineering/Compilers/Fall2014/info 这里看， 视频基本上youtube上也有https://www.youtube.com/results?search_query=Compilers+with+Alex+Aiken 。

# 工具
只推荐一些自己接触过的， 还有很多好工具没有列。
* https://babeljs.io/
* https://pegjs.org/
* https://github.com/antlr/antlr4
* [ConsenSys用peg写的solidity parser](https://github.com/ConsenSys/solidity-parser)

## 一些markdown解析器
* https://github.com/remarkjs/remark
* https://github.com/markedjs/marked
* https://github.com/markdown-it/markdown-it
* https://github.com/xitu/gold-miner/blob/master/TODO/choosing-right-markdown-parser.md