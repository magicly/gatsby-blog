---
title: udacity课程ud730深度学习学习笔记
draft: false
tags: [ml, udacity, tensorflow, AI, cnn, rnn, lstm, word2vec]
category: ML
date: "2017-03-31T09:48:11Z"
---

最近在看Udacity的[ud730课程](https://classroom.udacity.com/courses/ud730/)，号称是tensorflow官方宣传片哈哈，因为用到的代码直接在[tensorflow的代码里面](https://github.com/tensorflow/tensorflow/tree/master/tensorflow/examples/udacity)。

课程主要包括四大部分：
* 机器学习的基本概念
* 深度神经网络
* 卷积神经网络
* 循环神经网络

<!-- more -->

# 机器学习基本概念
* softmax
* cross-entropy
* overfitting & regularization
* train / validate / test dataset的用途
* SGD，随机梯度下降算法
* Momentum & learning rate decay，动量法和学习率调节下降
* Hyper-parameter，超参数空间

# 深度神经网络
* 线性模型的局限
* ReLu
* Chain Rule， 链式法则
* Back propagation，反向传播
* Regularization，正则化
* Dropout

# 卷积神经网络
* Statistical Invariants，统计不变性
* Convolutional NN，Convnets，卷积网络
  * feature map
  * stride
  * max pooling

# 循环神经网络
* Embeddings
* word2vec
* tSNE
* RNN
* 梯度消失/爆炸
* LSTM
* Beam搜索

课程总共有6个tasks，目前完成了3个， 代码在[github上](https://github.com/magicly/udacity-ud730)，后续会继续更新本文和代码， 欢迎有兴趣的关注。

To be continued...
