---
title: PyTorch multiprocessing slow
draft: false
tags: [python, RL, HPC, pytorch]
category: AI
date: '2020-05-12T08:15:32Z'
---

# pytorch 并发
* https://pytorch.org/docs/stable/notes/cpu_threading_torchscript_inference.html
* https://github.com/pytorch/pytorch/issues/975 
* https://pytorch.org/docs/stable/notes/multiprocessing.html
* https://pytorch.org/docs/stable/multiprocessing.html
* https://github.com/pytorch/pytorch/issues/19213
* https://discuss.pytorch.org/t/is-evaluating-the-network-thread-safe/37802
* https://stackoverflow.com/questions/48822463/how-to-use-pytorch-multiprocessing


# python multiprocessing的坑
https://pythonspeed.com/articles/python-multiprocessing/

# 查看cpu cache size

https://stackoverflow.com/questions/30207256/how-to-get-the-size-of-cpu-cache-in-linux
```bash
lscpu | grep cache


getconf -a | grep CACHE
```

# cache miss
https://stackoverflow.com/questions/10082517/simplest-tool-to-measure-c-program-cache-hit-miss-and-cpu-time-in-linux

```bash
/usr/bin/time -v YourProgram.exe
```

# 多进程vs多线程
https://www.quora.com/Which-one-is-a-better-option-to-go-with-for-a-single-process-multithreading-or-multiprocessing

# 可能是cpu切换process， context switch
* https://blog.csdn.net/guotianqing/article/details/80958281
* https://blog.csdn.net/test1280/article/details/87991302
* https://www.jianshu.com/p/f59d7df06432 图中可看出， L3cache是多个cpu共用的， 所以memory太大就会造成多process之间竞争
* https://niyanchun.com/taskset-command.html
* https://jin-yang.github.io/post/linux-cgroup-cpuset-subsys-introduce.html
* https://zhuanlan.zhihu.com/p/38541212

> 软亲和性（affinity）: 就是进程要在指定的 CPU 上尽量长时间地运行而不被迁移到其他处理器，Linux 内核进程调度器天生就具有被称为 软 CPU 亲和性（affinity） 的特性，这意味着进程通常不会在处理器之间频繁迁移。这种状态正是我们希望的，因为进程迁移的频率小就意味着产生的负载小。

做了cpu绑定， 似乎没有影响。 如果绑定得不对（都绑定到一个）， 会严重降低效率。

# cpu资源隔离
* https://zouliwei.wordpress.com/2016/01/08/cgroup-%E4%BB%8Ecpu%E8%B5%84%E6%BA%90%E9%9A%94%E7%A6%BB%E8%AF%B4%E8%B5%B7/
* https://www.cnblogs.com/shishaochen/p/9735114.html
