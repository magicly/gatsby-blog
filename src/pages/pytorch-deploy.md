---
title: PyTorch模型部署
draft: false
tags: [pytorch, deep learning, c++]
category: AI
date: '2020-02-21T17:41:32Z'
---

<!-- more -->

https://pytorch.org/blog/model-serving-in-pyorch/
pytorch 模型部署有几种方式， 部署成 server， 部署到云平台， 部署到终端等。

# http server 部署

最简单的方式， 直接用 Python Server 部署， 如用 Flask。 参考： https://pytorch.org/tutorials/intermediate/flask_rest_api_tutorial.html

# 部署到云平台

查看相应云平台文档

# c++部署

步骤：

1. python model -> torchscript jit model

Pytorch 提供了[TorchScript](https://pytorch.org/tutorials/beginner/Intro_to_TorchScript_tutorial.html)，功能类似于 TF，通过中间表示 IR 将 model 转化为静态图，这样可以独立于语言，跨语言部署。 为了在某些不支持 python 环境的地方（比如手机）部署模型， 就可以导出成 TorchScript， 然后用 C++调用。

有两种方式：

```python
traced_model = torch.jit.trace(Model(), (input1, input2))
```

或者

```python
script_model = torch.jit.script(Model())
```

注意， `trace`方法不支持`if/else`， 因为 trace 原理是用`input1, input2`调用`model`然后记录下实际走过的路径，`if/else`这些判断会“固化”下来， 实际留下来的`traced_model`里是没有`if/else`的。

而`torch.jit.script`是通过编译的方式， 可以保留所有代码。 两者可以混用。 适合用`traced`的方式：

> Some situations call for using tracing rather than scripting (e.g. a module has many architectural decisions that are made based on constant Python values that we would like to not appear in TorchScript)

2. 保存 jit model

```python
traced_model.save('model.pt')
```

可以在 python 中加载， 不过意义不大：

```python
loaded_model = torch.jit.load('model.pt')
```

3. 在 C++中加载 jit model
   按`https://pytorch.org/tutorials/advanced/cpp_export.html`中安装 libtorch，配置 CMake。 注意，这里如果是 GPU 版本， 需要提前安装 Nvidia Drivers 和 Cuda/CuDNN 等， 可以参考：

- https://zhuanlan.zhihu.com/p/59618999
- https://zhuanlan.zhihu.com/p/72298520

注意， 这里有一个大坑。 按上面配置出来的 C++代码， **推理速度居然比 python 慢 3 倍！！！** 经过多次尝试， 用`nightly`版本才可以。在这里反馈了 issuses：

- https://github.com/pytorch/pytorch/issues/20156
- https://discuss.pytorch.org/t/c-forward-3x-slower-than-python-for-traced-model/52882/10

这里只是用 C++调用训练好并导出的 jit model， 其实 PyTorch 是有完整的 C++ API 的， 可以用 C++写训练代码， 感觉想不开呢~

- https://pytorch.org/tutorials/advanced/cpp_frontend.html
- https://pytorch.org/cppdocs/

**参考**:

1. https://pytorch.org/tutorials/beginner/Intro_to_TorchScript_tutorial.html
2. https://pytorch.org/tutorials/advanced/cpp_export.html
3. https://stackoverflow.com/questions/7724569/debug-vs-release-in-cmake
4. https://pytorch.org/cppdocs/installing.html
5. https://pytorch.org/docs/master/jit.html

# ONNX 部署

导出成 ONNX 格式， 通过 ONNX Runtime 实现跨平台高性能部署。

- https://pytorch.org/tutorials/advanced/super_resolution_with_onnxruntime.html
