---
title: 大规模分布式深度强化学习
draft: false
tags: [pytorch, deep learning, RL, docker, tensorflow]
category: AI
date: '2020-11-10T07:41:32Z'
---


# Impala

Scalable Distributed Deep-RL with Importance Weighted Actor-Learner Architectures

https://arxiv.org/abs/1802.01561

Deepmind提出， 一个learner， 一堆actor， 通过V-trace算法改善了actor和learner之间off policy的问题， 效果比较好。 论文里训练了一个智能体玩所有的Atari， 和DMLab-30， 据说是第一次有人尝试成功， 证明了multi-task之间transfer的可能性。

https://github.com/deepmind/scalable_agent 代码很老， 直接跑不起来， 依赖TF1.x， 不推荐使用， 建议使用TorchBeast。

# TorchBeast

https://github.com/facebookresearch/torchbeast

https://arxiv.org/abs/1910.03552

Impala的pytorch实现， 代码很清晰。

# SeedRL

https://github.com/google-research/seed_rl

Impala里面actor是用CPU推理的， 如果网络比较大会有点慢， SeedRL用gprc把obs传回learner， 用GPU统一推理。 其实rlpyt等都实现了， 只是SeedRL支持多机。 github库里实现了Impala(V-trace)， R2D2和SAC算法。 

按照文档直接跑起来效果不是很好。

# rlpyt

https://github.com/astooke/rlpyt

https://arxiv.org/abs/1909.01500

BAIR作品， 工程实现很好， 跑起来性能也很不错， 只支持单机， 其实大部分时候够用了， 实现了很多算法， 包括DQN/A2C/PPO/DDPG/SAC/TD3等。

> Modular, optimized implementations of common deep RL algorithms in PyTorch, with unified infrastructure supporting all three major families of model-free algorithms: policy gradient, deep-q learning, and q-function policy gradient. Intended to be a high-throughput code-base for small- to medium-scale research (large-scale meaning like OpenAI Dota with 100's GPUs).

https://github.com/astooke/accel_rl 这个库的改进版本。

# Acme

https://github.com/deepmind/acme

一个比较新的框架， 包含了很多算法， 包括MCTS、R2D2、Impala等。 TF2和JAX。 用[Reverb](https://github.com/deepmind/reverb)做的分布式replay buffer， 感觉不用acme也可以用这个， 很方便。 

比较符合个人taste的一个。

# RLlib

基于Ray， Ray有一整套完整的机器学习套件，之前文档有问题， 很多链接404。 之前改[Tianshou](https://github.com/thu-ml/tianshou)的时候还发现过[一个Bug](https://github.com/ray-project/ray/issues/10134)， 不过修复很快， 现在出1.1了， 应该好很多了吧。


# Dopamine

https://github.com/google/dopamine

> Dopamine is a research framework for fast prototyping of reinforcement learning algorithms.

偏学术研究， prototyping的。 主要实现了`Rainbow, DQN, Quantile, Implicit Quantile`算法， 用的TF2和JAX。

> Dopamine now runs on TensorFlow 2. However, Dopamine is still written as TensorFlow 1.X code. This means your project may need to explicity disable TensorFlow 2 behaviours with:

# Sample Factory

https://github.com/alex-petrenko/sample-factory

[Sample Factory: Egocentric 3D Control from Pixels at 100000 FPS with Asynchronous Reinforcement Learning](https://arxiv.org/abs/2006.11751)标题很霸气！

也是单机算法， 跟rlpyt类似。

# PARL

百度的， 基于PaddlePaddle，也有pytorch（不过算法没有paddlepaddle的那么多）， 包括DQN, PPO, SAC, Impala, MADDPG, COMA等算法。

分层很合理，代码清晰。

里面有一份进化算法的代码EvoKit， 不过全是C++写的。

# MuZero

https://github.com/werner-duvaud/muzero-general

# Baselines

https://github.com/openai/baselines OpenAI提供， 比较老了， 基于TF1.x。 有人嫌弃代码结构不清晰， fork了一份出来改： https://github.com/hill-a/stable-baselines 

作者从新基于pytorch实现了一份： https://github.com/DLR-RM/stable-baselines3 ， 但是目前算法没有stable-baselines全。


# ReAgent

https://github.com/facebookresearch/ReAgent

以前叫Horizon， 

工业级的， 不过不适合游戏。

> Horizon is an end-to-end platform designed to solve industry applied RL problems where datasets are large (millions to billions of observations), the feedback loop is slow (vs. a simulator), and experiments must be done with care because they don’t run in a simulator.


# A3C

Asynchronous methods for deep reinforcement learning

被引用数4k+了， RL paper基本都会提到， 曾经的STOA。 16年的工作了， 比较老， 不推荐使用。 对于offpolicy， 简单的视而不见。


# 进化算法

# Envs
## gym
## retro