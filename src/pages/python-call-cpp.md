---
title: python调用cpp
draft: false
tags: [python, c++, c, cpp, hpc]
category: AI
date: '2020-02-01T12:55:32Z'
---

<!-- more -->

python 调用 cpp 大概几种方式：

https://www.zhihu.com/question/23003213

- ctypes
- swig
- boost.python
- pybind11
- sockets
- cython
- opencv bindings: https://docs.opencv.org/trunk/da/d49/tutorial_py_bindings_basics.html

# ctypes

简单直接， 只支持 c

- https://zhuanlan.zhihu.com/p/20152309
- https://docs.python.org/3.8/library/ctypes.html
- https://blog.csdn.net/wateryouyo/article/details/72638371
- https://seanlee97.github.io/2018/05/24/Python%E8%B0%83%E7%94%A8C/
- https://note.qidong.name/2018/01/call-cpp-in-python/

# extending

- https://docs.python.org/3/extending/index.html

# cython

- https://zhuanlan.zhihu.com/p/24311879

# pybind11

推荐！ 简单，强大。 简化了 boost.python。

- https://github.com/pybind/pybind11
- https://www.ryanligod.com/2018/10/29/2018-10-29%20pybind11%20%E5%85%A5%E9%97%A8/
- https://github.com/pybind/pybind11/issues/382#issuecomment-244600572

mac 下需要带`-undefined dynamic_lookup`

# swig

支持很多语言，较复杂。

- http://www.swig.org/
- https://segmentfault.com/a/1190000013219667

# boost.python

推荐用 pybind11

- https://www.boost.org/doc/libs/1_58_0/libs/python/doc/

# python -> cpp concurrency

https://pybind11.readthedocs.io/en/master/advanced/misc.html

`When calling a C++ function from Python, the GIL is always held.`

TODO
