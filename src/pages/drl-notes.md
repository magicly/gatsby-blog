---
title: DRL notes
draft: false
date: "2020-12-01T22:04:10Z"
tags: [DRL, Deep Learning, Reinforcement Learning]
category: AI
---



# baselines

指标：
explained_variance

 # Calculates if value function is a good predicator of the returns (ev > 1)
            # or if it's just worse than predicting nothing (ev =< 0)
            ev = explained_variance(values, returns)

discount:
```python
    return scipy.signal.lfilter([1],[1,-gamma],x[::-1], axis=0)[::-1]
````

common/models.py 各种网络模型。

mpi

SegmentTree
wrapper


ppo2:
 nminibatches: int                 number of training minibatches per update. For recurrent policies,
                                      should be smaller or equal than number of environments run in parallel.


baselines ppo2: nminibatches（多少个batch） 跟 ppo1 optim_batchsize（batch_size大小） 貌似不是一个意思？！！

https://medium.com/aureliantactics/ppo-hyperparameters-and-ranges-6fc2d29bccbe

> Lambda and gamma perform a bias-variance trade off of the trajectories and can also be viewed as a form of reward shaping. GAE  


from the PPO paper: 不share parameters就不用了？

> If using a neural network architecture that shares parameters between the policy and value function, we must use a loss function that combines the policy surrogate and a value function error term.