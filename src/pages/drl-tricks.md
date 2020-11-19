---
title: 深度强化学习的一些训练tricks
draft: false
tags: [deep learning, RL]
category: AI
date: '2020-11-18T07:41:32Z'
---


# TRPO、PPO的作者John Schulman的调参经验

slides： http://joschu.net/docs/nuts-and-bolts.pdf

视频： https://www.youtube.com/watch?v=8EcdaCk9KaQ

视频B站搬运： https://www.bilibili.com/s/video/BV1i64y1T7JX

中文整理 https://mp.weixin.qq.com/s/HvcwR_fJXPVP4cNXhaPiSw

DRL葵花宝典，DeepRLHacks-ZH - 王小惟的文章 - 知乎 https://zhuanlan.zhihu.com/p/31810802

https://github.com/williamFalcon/DeepRLHacks


# ICLR2020满分论文: Implementation Matters in Deep RL: A Case Study on PPO and TRPO

简单总结：

  1. PPO相比TRPO性能提升，来自于CodeLevel， PPO的clip没啥用
  2. 光有clip没有codelevel的优化， 跟trpo一样
  3. 有codelevel优化没有clip，跟ppo一样，性能没损失
  4. trpo加上codelevel的优化， 提升到ppo一样

* https://openreview.net/forum?id=r1etN1rtPB
* https://iclr.cc/virtual_2020/poster_r1etN1rtPB.html
* https://arxiv.org/abs/2005.12729
* https://github.com/implementation-matters/code-for-paper
* ICLR2020满分论文：PPO带来的性能提升来源于code-level? - 风清云的文章 - 知乎 https://zhuanlan.zhihu.com/p/99061859
* https://medium.com/@justin_L/literature-review-implementation-matters-in-deep-policy-gradients-a-case-study-on-ppo-and-trpo-488b4ce978c2
* https://zhuanlan.zhihu.com/p/142483450
* https://vitalab.github.io/article/2020/01/14/Implementation_Matters.html
* 【DRL-17】TRPO vs. PPO - Frank Tian的文章 - 知乎 https://zhuanlan.zhihu.com/p/142483450


# The 32 Implementation Details of Proximal Policy Optimization (PPO) Algorithm 

https://costa.sh/blog-the-32-implementation-details-of-ppo.html 做了更多的实验

https://github.com/vwxyzjn/cleanrl

https://arxiv.org/abs/2006.05990

# Reinforcement Learning Tips and Tricks

https://stable-baselines.readthedocs.io/en/master/guide/rl_tips.html


# PPO Hyperparameters

https://medium.com/aureliantactics/ppo-hyperparameters-and-ranges-6fc2d29bccbe

https://docs.google.com/spreadsheets/d/1fNVfqgAifDWnTq-4izPPW_CVAUu9FXl3dWkqWIXz04o/edit#gid=0

# 其他
* 师姐的一篇好文， 总结了很多PG算法： https://lilianweng.github.io/lil-log/2018/04/08/policy-gradient-algorithms.html
* 这里有一篇深度强化学习劝退文 - Frankenstein的文章 - 知乎 https://zhuanlan.zhihu.com/p/33936457
* Deep Reinforcement Learning Doesn't Work Yet https://www.alexirpan.com/2018/02/14/rl-hard.html
* 强化学习中的调参经验与编程技巧(on policy 篇) - 启人zhr的文章 - 知乎 https://zhuanlan.zhihu.com/p/207435700
* https://openai.com/blog/openai-baselines-ppo/
* https://channel9.msdn.com/Events/Neural-Information-Processing-Systems-Conference/Neural-Information-Processing-Systems-Conference-NIPS-2016/Deep-Reinforcement-Learning-Through-Policy-Optimization