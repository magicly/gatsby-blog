---
title: 机器学习计划
draft: false
date: "2019-01-25T15:04:10Z"
tags: [AI, ML, machine learning, deep learning, 深度学习]
category: ML
---

--------2019-01-25 更新---------

18 年上半年做了个区块链项目， 后面继续回来做 AI， 目前创业主要用 Deep Reinforcement Learning 做棋牌类游戏的 AI 引擎， 欢迎有兴趣的勾搭~

- [**fast.ai2018**](https://course.fast.ai/)，新课程改成了他们自己基于[Pytorch](http://pytorch.org/)的一个框架[fastai](https://docs.fast.ai/)
- [**PyTorch**](http://pytorch.org/)，18 年发布了 1.0， 用的人越来越多， 比 tensorflow 简单很多， 准备入坑。 据说 TF2.0 会有很大的改善， 包括整合 Keras 等， 使代码更像 python 而不是一门叫"TensorFlow"的语言， 期待。
- [Intro to Deep Learning with PyTorch](https://in.udacity.com/course/deep-learning-pytorch--ud188)
- 斯坦福的 CS224n NLP 课程现在也用 PyTorch 了， [斯坦福 NLP 组-2019-《CS224n: NLP 与深度学习》-分享](https://zhuanlan.zhihu.com/p/54867978)
- Andrew Ng 的新课程

  - https://www.coursera.org/specializations/deep-learning，这个有点坑， 购买之后上了三节课， 结果最后两课一直没出， 害得我多花了两个月的 money， 然后最后两课还是没出！！！果断注销了， 过了半年才出了最后两课。
  - https://www.coursera.org/learn/ai-for-everyone/, 还没出， 这个应该是科普性质的吧
  - [Machine Learning Yearning](https://www.deeplearning.ai/machine-learning-yearning/)
  - http://cs229.stanford.edu/

- 再推一波台大李宏毅老师的课程哈哈，http://speech.ee.ntu.edu.tw/~tlkagk/courses.html

- [Hands-on Machine Learning with Scikit-Learn and TensorFlow](https://github.com/ageron/handson-ml)， [中文版](https://github.com/apachecn/hands-on-ml-zh)
- 李沐等一堆大神的[《动手学深度学习》](https://zh.d2l.ai/)， 以及相应的[伯克利深度学习 2019 课程](https://courses.d2l.ai/berkeley-stat-157/index.html)
- [100 Days of ML Coding](https://github.com/Avik-Jain/100-Days-Of-ML-Code)[火爆 GitHub 的《机器学习 100 天》，有人把它翻译成了中文版！](https://zhuanlan.zhihu.com/p/54229077)
- [Machine Learning From Scratch](https://github.com/eriklindernoren/ML-From-Scratch)
- [对人工智能有着一定憧憬的计算机专业学生可以阅读什么材料或书籍真正开始入门人工智能的思路和研究？](https://www.zhihu.com/question/44864396)， 话说提到的[grokking Deep Learning](https://github.com/iamtrask/Grokking-Deep-Learning)这本书的作者[Andrew Trask](https://twitter.com/iamtrask)， 我之前翻译过一篇[所有人都能学会用 Python 写出 RNN-LSTM 代码](https://magicly.me/iamtrask-anyone-can-code-lstm/)， 当时有些问题还咨询作者， 人很 nice~
- **传说中的[“花书”](http://www.deeplearningbook.org/)，有[整理好的 pdf](https://github.com/janishar/mit-deep-learning-book-pdf)**
- [重磅 | 深度学习“四大名著”发布！爱可可推荐！](https://redstonewill.com/1834/)
- http://karpathy.github.io/
- [**《Pattern Recognition and Machine Learning》**](https://www.zhihu.com/topic/19674470/hot)，搜了一下，github 上有[Matlab 代码实现](https://github.com/PRML/PRMLT)， 有[python 实现](https://github.com//ctgk/PRML)， 也有[Julia 实现（貌似刚开始做）](https://github.com/uzielnmtz/PRML)。 话说这本书以前老师推荐了还 email 给我， 结果一看， 1000 多页！然后。。。
- 李航博士的[统计学习方法](https://book.douban.com/subject/10590856/)也有不少人推荐，找到一份[python 代码实现](https://github.com/fengdu78/lihang-code)， 参考[机器学习必备宝典-《统计学习方法》的 python 代码实现及课件](https://zhuanlan.zhihu.com/p/50552396) 。
- [有没有必要把机器学习算法自己实现一遍？](https://www.zhihu.com/question/36768514)

# Reinforcement Learning

因为最近用 RL 比较多， 所以单独把 RL 资料整理出来。

- 最佳入门书[**Reinforcement Learning: An Introduction**](http://www.incompleteideas.net/book/the-book.html)，网站上还有很多其他资料， 刚发现代码实现有 Julia 版本的了， 👍。 看完一遍了， 打算再认认真真看第二遍， 把练习自己做一遍。可以参考下[知乎上关于《reinforcement learning :an introduction》的理解？](https://www.zhihu.com/question/50461146)。 除了[网站 Code 页面](http://www.incompleteideas.net/book/code/code2nd.html)推荐的几分代码，github 上另外找到两个不错的：
  - https://github.com/dennybritz/reinforcement-learning
  - https://github.com/JKCooper2/rlai-exercises
- http://www0.cs.ucl.ac.uk/staff/D.Silver/web/Teaching.html（完成）
- [**李宏毅深度强化学习(国语)课程(2018)**](https://www.youtube.com/playlist?list=PLJV_el3uVTsODxQFgzMzPLa16h6B8kWM_)，bilibili 上有https://www.bilibili.com/video/av24724071
- **伯克利的 CS294(现在改叫 CS285 了？)**， 因为有多个版本， 我把找到的一些链接放着， 看的时候建议直接看最新版：
  - http://rail.eecs.berkeley.edu/deeprlcourse/
  - [CS294 深度增强学习 这门课的质量是不是不大好？](https://www.zhihu.com/question/61171437)
  - [CS 294: Deep Reinforcement Learning Note（1）](https://zhuanlan.zhihu.com/p/29080505)， 这个应该是以前的版本吧
  - [学到了！UC Berkeley CS 294 深度强化学习课程（附视频与 PPT）](https://www.jiqizhixin.com/articles/uc-berkeley-cs294)
  - [【Berkeley CS 294：深度增强学习，2017 年春季学期】学习资源（附字幕）](https://zhuanlan.zhihu.com/p/25298020)
- **伯克利的 CS188**， 也是有很多年的：
  - [2018](https://inst.eecs.berkeley.edu/~cs188/fa18/)
  - [UC Berkeley《人工智能基础-2018》课程及视频教程（带中英文字幕）分享](https://zhuanlan.zhihu.com/p/54162811)
  - http://ai.berkeley.edu/home.html
- [**DeepMind 深度学习高级课程，视频已全部放出**](https://zhuanlan.zhihu.com/p/50737282)
- [**Practical Reinforcement Learning**](https://www.coursera.org/learn/practical-rl)
- [**Machine Learning and Reinforcement Learning in Finance**](https://www.coursera.org/specializations/machine-learning-reinforcement-finance)
- [**OpenAI Spinning Up**](https://spinningup.openai.com/en/latest/index.html)
- https://classroom.udacity.com/courses/ud600/
- http://mcts.ai/
- https://github.com/yandexdataschool/Practical_RL
- http://www.wildml.com/2016/10/learning-reinforcement-learning/
- [强化学习资料汇总](https://www.tinymind.cn/articles/119)
- [Deep Reinforcement Learning 深度增强学习资源 (持续更新）](https://zhuanlan.zhihu.com/p/20885568)， 大部分前面都已经涵盖了
- [强化学习从入门到放弃的资料](https://zhuanlan.zhihu.com/p/34918639)
- [深度强化学习（Deep Reinforcement Learning）入门：RL base & DQN-DDPG-A3C introduction](https://zhuanlan.zhihu.com/p/25239682)
- [David Silver 强化学习公开课中文讲解及实践](https://zhuanlan.zhihu.com/reinforce)
- [关于《reinforcement learning :an introduction》的理解？](https://www.zhihu.com/question/50461146)
- [Simple Reinforcement Learning with Tensorflow Part 0: Q-Learning with Tables and Neural Networks](https://medium.com/emergent-future/simple-reinforcement-learning-with-tensorflow-part-0-q-learning-with-tables-and-neural-networks-d195264329d0)
- https://lilianweng.github.io/lil-log/2018/02/19/a-long-peek-into-reinforcement-learning.html
- https://github.com/sergeim19/SinglePlayerMCTS
- [Information Set Monte Carlo Search Trees in the game Coconuts](https://www.youtube.com/watch?v=nJiHYJnKKxo)
- http://www.aifactory.co.uk/

# AlphaGo/AlphaGo Zero/AlphaZero

- https://zhuanlan.zhihu.com/p/31804976
- https://zhuanlan.zhihu.com/p/36353764
- https://github.com/pytorch/ELF
- https://zhuanlan.zhihu.com/p/30262872
- [AlphaGo Documentary 2017](https://www.youtube.com/watch?v=9gzMQOa5MD4)
- [The 3 Tricks That Made AlphaGo Zero Work](https://hackernoon.com/the-3-tricks-that-made-alphago-zero-work-f3d47b6686ef)
- [The AlphaGo Zero cheat sheet](https://medium.com/applied-data-science/alphago-zero-explained-in-one-diagram-365f5abf67e0)
- [How to build your own AlphaZero AI using Python and Keras](https://medium.com/applied-data-science/how-to-build-your-own-alphazero-ai-using-python-and-keras-7f664945c188)
- [A Simple Alpha(Go) Zero Tutorial](https://web.stanford.edu/~surag/posts/alphazero.html)
- https://github.com/tejank10/AlphaGo.jl
- [https://zhuanlan.zhihu.com/p/34433581](AlphaZero实践——中国象棋（附论文翻译）)
- [深入浅出看懂 AlphaGo Zero - PaperWeekly 第 51 期](https://yq.aliyun.com/articles/226363)
- 跟 poker 结合：
  - [So, when will Deepmind AlphaZero play poker versus Libratus](https://forumserver.twoplustwo.com/29/news-views-gossip/so-when-will-deepmind-alphazero-play-poker-versus-libratus-1729898/)
  - [【NIPS 最佳论文引发深度学习论战】AlphaZero 能击败冷扑大师吗？No（Science 论文）](https://zhuanlan.zhihu.com/p/32154212)
  - https://www.deepstack.ai/

# Math

- 线性代数：
  - 最常被提起的莫过于 MIT 的课程了，[**网易公开课上有：麻省理工公开课：线性代数**](http://open.163.com/special/opencourse/daishu.html)， 最近[作者还在更新教材](http://math.mit.edu/~gs/linearalgebra/)
  - [**Linear Algebra and Learning from Data**](http://math.mit.edu/~gs/learningfromdata/)
  - [Introduction to Applied Linear Algebra – Vectors, Matrices, and Least Squares](https://web.stanford.edu/~boyd/vmls/), [VMLS.jl](https://github.com/VMLS-book/VMLS.jl)
- 微积分，看了这个[**普林斯顿微积分读本（修订版）**](https://book.douban.com/subject/26899701/)，复习一下挺好的
- 概率统计：
  - [**统计思维：程序员数学之概率统计**](https://book.douban.com/subject/24381562/)
  - [**An Introduction to Statistical Learning with Applications in R**](http://www-bcf.usc.edu/~gareth/ISL/)
  - [Seeing Theory: A visual introduction to probability and statistics.](https://seeing-theory.brown.edu/)
  - **https://www.coursera.org/specializations/statistics**
  - **https://www.coursera.org/specializations/jhu-data-science**
- [**Mathematics for Machine Learning 专项课程**](https://www.coursera.org/specializations/mathematics-machine-learning)

# Julia

单独把 Julia 拎出来， 是我觉得 Julia 拿来做 ML 真是很适合的啊， 虽然现在主流框架都是 python， 但是我觉得 Julia 很有潜力（确实还有很长的路要走， 基本找不到一个 stars 破千的 github repo....）。说个段子， 我不愿意用 python， 是因为， 我怕蛇啊。。。。

- [On Machine Learning and Programming Languages](https://julialang.org/blog/2017/12/ml&pl)
- [Machine Learning and Artificial Intelligence](https://juliacomputing.com/domains/ml-and-ai.html)
- Julia DL 框架比较流行的目前有[**Flux**](http://fluxml.ai/)和[Knet](https://github.com/denizyuret/Knet.jl)
- https://github.com/JuliaReinforcementLearning
- https://github.com/JuliaML
- https://github.com/CarloLucibello/DeepRLexamples.jl
- [Translating PyTorch models to Flux.jl Part1: RNN](https://philtomson.github.io/blog/2018-06-15-translating-pytorch-models-to-flux.jl-part1-rnn/)
- **https://github.com/JuliaPOMDP/POMDPs.jl**

# 好玩的

- deepfake， 自己 google
- https://github.com/deeppomf/DeepCreamPy
- [提高驾驶技术：用 GAN 去除(爱情)动作片中的马赛克和衣服](https://zhuanlan.zhihu.com/p/27199954)
- https://github.com/NVIDIA/vid2vid

--------2017-02-12 22:04:10----------

机器学习已经影响了我们生活中的每一个地方， 了解一些机器学习知识， 便于提高竞争力， 避免被机器替代。
下面是我参考咨询了很多大牛之后搜集整理的一些学习资料， 基本都是该领域世界最顶尖的高手亲自授课，以及一些最流行的工具库， 值得学习。

<!-- more -->

- 台湾大学李宏毅老师的机器学习和深度学习课程，http://speech.ee.ntu.edu.tw/~tlkagk/courses.html， bilibili 上有视频：https://www.bilibili.com/video/av10590361/ , https://www.bilibili.com/video/av9770302/ 。 另外有个很好的 pdf 可以快速了解机器学习内容：https://www.slideshare.net/tw_dsconf/ss-62245351 （完成）
- Fast.ai 课程，http://course.fast.ai/ ， 中文版http://geek.ai100.com.cn/tag/fast-ai ，已完成，这个是我目前觉得最好的课程。
- Andrew NG https://www.coursera.org/learn/machine-learning （已完成）
- Andrew NG Unsupervised Feature Learning and Deep Learning http://deeplearning.stanford.edu/tutorial/ （学习 ing）
- http://neuralnetworksanddeeplearning.com/ （已完成）
- Andrew NG, standford 的机器学习课程之一， http://cs229.stanford.edu/
- Neural Networks for Machine Learning https://www.coursera.org/learn/neural-networks by Geoffrey Hinton, Professor(深度学习创始人) （学习中），有点后悔， 这个课程并不是适合初学者。参考[这里](https://www.quora.com/Is-it-wise-to-learn-deep-learning-from-Hintons-course-on-Coursera) （完成）
- 李飞飞课程http://cs231n.github.io/
- 斯坦福自然语言处理 http://web.stanford.edu/class/cs224n/
- Tensorflow for Deep Learning Research http://web.stanford.edu/class/cs20si/
- 伯克利人工智能课程 http://www-inst.eecs.berkeley.edu/~cs188/archives.html
- http://www.deeplearningbook.org/, by Ian Goodfellow and Yoshua Bengio（深度学习四大金刚之一） and Aaron Courville
- udacity 深度学习课程 tensorflow https://classroom.udacity.com/courses/ud730/ （已完成）
- https://keras.io
- https://scikit-learn.org
- https://www.tensorflow.org
- http://deeplearning.net/
- https://www.kaggle.com
