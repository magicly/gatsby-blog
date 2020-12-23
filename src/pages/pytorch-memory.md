---
title: PyTorch内存占用分析
draft: false
date: "2020-12-22T08:54:10Z"
tags: [AI, ML, machine learning, deep learning, 深度学习, pytorch]
category: ML
---



# 内存占用估计

model参数其实只有一个小部分， 中间变量占大多数， backward * 2

pytorch有自己的memory allocator和cache， 所以del x之后nvidia-smi并不会看到x的memory。 可以使用torch.cuda.memory* api查看， 可以使用`empty_cache`归还给OS。

* https://pytorch.org/docs/stable/notes/cuda.html
* https://pytorch.org/docs/stable/cuda.html#torch.cuda.empty_cache

* [如何在Pytorch中精细化利用显存](https://oldpan.me/archives/how-to-use-memory-pytorch)
* [浅谈深度学习:如何计算模型以及中间变量的显存占用大小](https://oldpan.me/archives/how-to-calculate-gpu-memory)
* [再次浅谈Pytorch中的显存利用问题(附完善显存跟踪代码)](https://oldpan.me/archives/pytorch-gpu-memory-usage-track)
* 科普帖：深度学习中GPU和显存分析 - 陈云的文章 - 知乎 https://zhuanlan.zhihu.com/p/31558973 ， 很好的一个帖子， 文末还有一个ppt
* 内存不够用的时候， 可以时间换空间： https://pytorch.org/tutorials/recipes/recipes/tuning_guide.html#checkpoint-intermediate-buffers




# 简单分配一个tensor就占用将近1G gpu memory

发现哪怕只是`torch.ones(1, device='cuda')`就会占用将近1G的gpu memor， 具体是1.6 907M， 1.7 961M。 其实不是数据占用的， 是cuda/cudnn等kernel代码占用的。
* https://discuss.pytorch.org/t/moving-a-tiny-model-to-cuda-causes-a-2gb-host-memory-allocation/61282
* Massive initial memory overhead GPU  https://github.com/pytorch/pytorch/issues/12873 , https://github.com/pytorch/pytorch/issues/12873#issuecomment-482916237 这个回复表明不是pytorch的锅， 不过测试发现， 只会占用300多M， 用tensorflow2， 也是占用300多M， 说明pytorch对cuda/cudnn等不是按需加载， 有待改进。 https://github.com/pytorch/pytorch/issues/31881 这里有人提了一个Feature Request
* https://discuss.pytorch.org/t/why-pytorch-used-so-many-cpu-ram/73151/8
* 

# tools

* https://github.com/anderskm/gputil
* https://github.com/stonesjtu/pytorch_memlab
* https://gist.github.com/Stonesjtu/368ddf5d9eb56669269ecdf9b0d21cbe
* https://github.com/stas00/ipyexperiments


# 一些好的资料
* http://blog.ezyang.com/2019/05/pytorch-internals/ pytorch开发者[Edward Z. Yang](https://twitter.com/ezyang)做的一次分享
* https://discuss.pytorch.org/t/when-to-set-pin-memory-to-true/19723 [doc上说pin_memory](https://pytorch.org/docs/stable/data.html#memory-pinning)可以让cpu -> gpu速度更快
* https://developer.nvidia.com/blog/how-optimize-data-transfers-cuda-cc/
* Pytorch有什么节省显存的小技巧？ - 知乎 https://www.zhihu.com/question/274635237
* PyTorch 有哪些坑/bug？ - 知乎 https://www.zhihu.com/question/67209417
* 在使用Pytorch时提前分配显存 https://sparkydogx.github.io/2019/03/16/occupy-gpu-memory-in-advance/
* 多人共用的时候， 提前分配内存 https://discuss.pytorch.org/t/reserving-gpu-memory/25297 哈哈， 还有何种用法
* PyTorch trick 集锦 - 赵剑行的文章 - 知乎 https://zhuanlan.zhihu.com/p/76459295
* https://blog.paperspace.com/pytorch-memory-multi-gpu-debugging/
* [PyTorch Lightning](https://github.com/PyTorchLightning/pytorch-lightning)[作者William Falcon](https://william-falcon.medium.com/)的tips https://towardsdatascience.com/7-tips-for-squeezing-maximum-performance-from-pytorch-ca4a40951259
* pytorch如何将训练提速？ https://cloud.tencent.com/developer/article/1646262
* pytorch 新手提速指南 - 圈圈的文章 - 知乎 https://zhuanlan.zhihu.com/p/119364172
* https://github.com/lartpang/PyTorchTricks
* Pinning data to GPU in Tensorflow and PyTorch: http://deeplearnphysics.org/Blog/2018-10-02-Pinning-data-to-GPU.html
* pytorch论坛上蛮多问内存问题的， 比如 https://discuss.pytorch.org/t/unable-to-allocate-cuda-memory-when-there-is-enough-of-cached-memory/33296

# sharded节约60% memory
* Sharded: A New Technique To Double The Size Of PyTorch Models https://towardsdatascience.com/sharded-a-new-technique-to-double-the-size-of-pytorch-models-3af057466dba
* Introducing PyTorch Lightning Sharded: Train SOTA Models, With Half The Memory https://seannaren.medium.com/introducing-pytorch-lightning-sharded-train-sota-models-with-half-the-memory-7bcc8b4484f2
* https://arxiv.org/abs/1910.02054