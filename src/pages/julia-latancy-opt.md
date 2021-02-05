---
title: Julia
draft: false
date: "2021-01-10T10:54:10Z"
tags: [julia]
category: HPC
---


Julia启动时间很慢， 因为没有函数都需要Compile， 所以测试时间应该以第二次执行为准。 有几种方法可以改善：

1. [PackageCompiler](https://github.com/JuliaLang/PackageCompiler.jl)预编译一些package以及function

不过按照文档https://julialang.github.io/PackageCompiler.jl/dev/sysimages/#Creating-a-sysimage-using-PackageCompiler-1 操作打出来的sysimage， 里面不能执行`import Example;`或者`using Example`。 

按照https://julialang.github.io/PackageCompiler.jl/dev/devdocs/sysimages_part_1/ 自己打出来的sysimage可以， 感觉应该是PackageCompiler的bug。

2. [Revise](https://github.com/timholy/Revise.jl/)可以不重启julia session来更新函数
