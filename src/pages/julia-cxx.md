---
title: Julia CXX
draft: false
date: "2021-01-01T10:54:10Z"
tags: [julia, C, C++, Rust]
category: HPC
---

https://docs.julialang.org/en/v1/manual/calling-c-and-fortran-code/

https://discourse.julialang.org/t/invalid-elf-header-0-7-0-beta-built-from-source/12054/3 需要指定完整的so名， `libc.so.6`， 只用`libc.so`不行。

https://docs.julialang.org/en/v1/base/c/#ccall


# Julia 并发
一个坑 https://stackoverflow.com/questions/52936189/julia-parallelism-distributed-slower-than-serial

addprocs的时候需要指定`exenaem`和`dir`， 不然要求跟当前机器的保持一致， 参考https://docs.julialang.org/en/v1/stdlib/Distributed/

通过指定`--machine-file`启动参数的方式， 貌似不能设置`exename`？

如何多机运行代码： https://discourse.julialang.org/t/multiple-computer-example/10518/9?u=magicly ， 作者做过一个Workshop还不错https://github.com/crstnbr/JuliaWorkshop19 。 奇怪的是jupyter notebook直接在该目录下启动会报错， 将notebooks文件复制到其他目录再启动就可以了。

一个相关的帖子https://discourse.julialang.org/t/using-a-machine-file-on-a-cluster-but-also-propagating-environment-to-the-remote-workers/38948/6

Julia 中的分布式计算 https://cosx.org/2017/08/distributed-learning-in-julia/