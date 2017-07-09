---
title: 用LSTM生成武侠人名
draft: false
tags: [rnn, neural network, dl, ml]
category: ML
date: "2017-04-07T15:42:58Z"
---

之前翻译了[一篇介绍RNN的文章](//magicly.me/2017/03/09/iamtrask-anyone-can-code-lstm/)，一直没看到[作者](https://twitter.com/iamtrask)写新的介绍LSTM的blog，于是我又找了其他资料学习。本文先介绍一下LSTM，然后用LSTM在金庸、古龙的人名上做了训练，可以生成新的武侠名字，如果有兴趣的，还可以多搜集点人名，用于给小孩儿取名呢，哈哈，justforfun，大家玩得开心...

<!-- more -->

# RNN回顾
RNN的出现是为了解决状态记忆的问题，解决方法很简单，每一个时间点t的隐藏状态h(t)不再简单地依赖于数据，还依赖于前一个时间节点t-1的隐藏状态h(t-1)。可以看出这是一种递归定义（所以循环神经网络又叫递归神经网络Recursive Neural Network），h(t-1)又依赖于h(t-2)，h(t-2)依赖于h(t-3)...所以h(t)依赖于之前每一个时间点的输入，也就是说h(t)记住了之前所有的输入。
![rnn](//colah.github.io/posts/2015-08-Understanding-LSTMs/img/RNN-rolled.png)
上图如果按时间展开，就可以看出RNN其实也就是普通神经网络在时间上的堆叠。
![rnn-unrolled](//colah.github.io/posts/2015-08-Understanding-LSTMs/img/RNN-unrolled.png)

# RNN问题：Long-Term Dependencies
一切似乎很完美，但是如果h(t)依赖于h(t - 1000)，依赖路径特别长，会导致计算梯度的时候出现梯度消失的问题，训练时间很长根本没法实际使用。下面是一个依赖路径很长的例子：
```
我老家【成都】的。。。【此处省去500字】。。。我们那里经常吃【火锅】。。。
```
# LSTM
Long Short Term Memory神经网络，也就是LSTM，由[ Hochreiter & Schmidhuber于1997年发表](http://deeplearning.cs.cmu.edu/pdfs/Hochreiter97_lstm.pdf)。它的出现就是为了解决Long-Term Dependencies的问题，很来出现了很多改进版本，目前应用在相当多的领域（包括机器翻译、对话机器人、语音识别、Image Caption等）。

标准的RNN里，重复的模块里只是一个很简单的结构，如下图：
![rnn structure](//colah.github.io/posts/2015-08-Understanding-LSTMs/img/LSTM3-SimpleRNN.png)

LSTM也是类似的链表结构，不过它的内部构造要复杂得多：
![lstm structure](//colah.github.io/posts/2015-08-Understanding-LSTMs/img/LSTM3-chain.png)
上图中的图标含义如下：
![lstm components](//colah.github.io/posts/2015-08-Understanding-LSTMs/img/LSTM2-notation.png)

LSTM的核心思想是cell state（类似于hidden state，有LSTM变种把cell state和hidden state合并了， 比如GRU）和三种门：输入门、忘记门、输出门。

cell state每次作为输入传递到下一个时间点，经过一些线性变化后继续传往再下一个时间点（我还没看过[原始论文](http://deeplearning.cs.cmu.edu/pdfs/Hochreiter97_lstm.pdf)，不知道为啥有了hidden state后还要cell state，好在确实有改良版将两者合并了，所以暂时不去深究了）。
![cell state](//colah.github.io/posts/2015-08-Understanding-LSTMs/img/LSTM3-C-line.png)

门的概念来自于电路设计（我没学过，就不敢卖弄了）。LSTM里，门控制通过门之后信息能留下多少。如下图，sigmoid层输出[0, 1]的值，决定多少数据可以穿过门， 0表示谁都过不了，1表示全部通过。
![gate](//colah.github.io/posts/2015-08-Understanding-LSTMs/img/LSTM3-gate.png)

下面我们来看看每个“门”到底在干什么。

首先我们要决定之前的cell state需要保留多少。 它根据h(t-1)和x(t)计算出一个[0, 1]的数，决定cell state保留多少，0表示全部丢弃，1表示全部保留。为什么要丢弃呢，不是保留得越多越好么？假设LSTM在生成文章，里面有小明和小红，小明在看电视，小红在厨房做饭。如果当前的主语是小明， ok，那LSTM应该输出看电视相关的，比如找遥控器啊， 换台啊，如果主语已经切换到小红了， 那么接下来最好暂时把电视机忘掉，而输出洗菜、酱油、电饭煲等。
![forget gate](//colah.github.io/posts/2015-08-Understanding-LSTMs/img/LSTM3-focus-f.png)

第二步就是决定输入多大程度上影响cell state。这个地方由两部分构成， 一个用sigmoid函数计算出有多少数据留下，一个用tanh函数计算出一个候选C(t)。 这个地方就好比是主语从小明切换到小红了， 电视机就应该切换到厨房。
![input gate](//colah.github.io/posts/2015-08-Understanding-LSTMs/img/LSTM3-focus-i.png)

然后我们把留下来的（t-1时刻的）cell state和新增加的合并起来，就得到了t时刻的cell state。
![combine to cell state](//colah.github.io/posts/2015-08-Understanding-LSTMs/img/LSTM3-focus-C.png)

最后我们把cell state经过tanh压缩到[-1, 1]，然后输送给输出门（[0, 1]决定输出多少东西）。
![output](//colah.github.io/posts/2015-08-Understanding-LSTMs/img/LSTM3-focus-o.png)

现在也出了很多LSTM的变种， 有兴趣的可以看[这里](//colah.github.io/posts/2015-08-Understanding-LSTMs/)。另外，LSTM只是为了解决RNN的long-term dependencies，也有人从另外的角度来解决的，比如[Clockwork RNNs by Koutnik, et al. (2014).](http://arxiv.org/pdf/1402.3511v1.pdf)

# show me the code!
我用的[Andrej Karpathy大神](http://karpathy.github.io/2015/05/21/rnn-effectiveness/)的代码， 做了些小改动。这个代码的好处是不依赖于任何深度学习框架，只需要有numpy就可以马上run起来！
{% gist magicly/df9e5806fbd44ed5ec73dce9444afb30 %}

然后从网上找了[金庸小说的人名](http://www.oocities.org/sg/ye_feng_dengmi/h/hucai6-02.htm)，做了些预处理，每行一个名字，保存到input.txt里，运行代码就可以了。古龙的没有找到比较全的名字， 只有这份[武功排行榜](https://tieba.baidu.com/p/1559430344)，只有100多人。

下面是根据两份名单训练的结果，已经将完全一致的名字（比如段誉）去除了，所以下面的都是LSTM“新创作发明”的名字哈。来， 大家猜猜哪一个结果是金庸的， 哪一个是古龙的呢？
```
{'姜曾铁', '袁南兰', '石万奉', '郭万嗔', '蔡家', '程伯芷', '汪铁志', '陈衣', '薛铁', 
'哈赤蔡师', '殷飞虹', '钟小砚', '凤一刀', '宝兰', '齐飞虹', '无若之', '王老英', '钟', 
'钟百胜', '师', '李沅震', '曹兰', '赵一刀', '钟灵四', '宗家妹', '崔树胜', '桑飞西', 
'上官公希轰', '刘之余人童怀道', '周云鹤', '天', '凤', '西灵素', '大智虎师', '阮徒忠', 
'王兆能', '袁铮衣商宝鹤', '常伯凤', '苗人大', '倪不凤', '蔡铁', '无伯志', '凤一弼', 
'曹鹊', '黄宾', '曾铁文', '姬胡峰', '李何豹', '上官铁', '童灵同', '古若之', '慕官景岳', 
'崔百真', '陈官', '陈钟', '倪调峰', '妹沅刀', '徐双英', '任通督', '上官铁褚容', '大剑太', 
'胡阳', '生', '南仁郑', '南调', '石双震', '海铁山', '殷鹤真', '司鱼督', '德小', 
'若四', '武通涛', '田青农', '常尘英', '常不志', '倪不涛', '欧阳', '大提督', '胡玉堂', 
'陈宝鹤', '南仁通四蒋赫侯'}
```
```
{'邀三', '熊猫开', '鹰星', '陆开', '花', '薛玉罗平', '南宫主', '南宫九', '孙夫人',
'荆董灭', '铁不愁', '裴独', '玮剑', '人', '陆小龙王紫无牙', '连千里', '仲先生', 
'俞白', '方大', '叶雷一魂', '独孤上红', '叶怜花', '雷大归', '恕飞', '白双发', 
'邀一郎', '东楼', '铁中十一点红', '凤星真', '无魏柳老凤三', '萧猫儿', '东郭先凤', 
'日孙', '地先生', '孟摘星', '江小小凤', '花双楼', '李佩', '仇珏', '白坏刹', '燕悲情', 
'姬悲雁', '东郭大', '谢晓陆凤', '碧玉伯', '司实三', '陆浪', '赵布雁', '荆孤蓝', 
'怜燕南天', '萧怜静', '龙布雁', '东郭鱼', '司东郭金天', '薛啸天', '熊宝玉', '无莫静',
'柳罗李', '东官小鱼', '渐飞', '陆地鱼', '阿吹王', '高傲', '萧十三', '龙童', '玉罗赵', 
'谢郎唐傲', '铁夜帝', '江小凤', '孙玉玉夜', '仇仲忍', '萧地孙', '铁莫棠', '柴星夫', 
'展夫人', '碧玉', '老无鱼', '铁铁花', '独', '薛月宫九', '老郭和尚', '东郭大路陆上龙关飞', 
'司藏', '李千', '孙白人', '南双平', '王玮', '姬原情', '东郭大路孙玉', '白玉罗生', '高儿', 
'东珏天', '萧王尚', '九', '凤三静', '和空摘星', '关吹雪', '上官官小凤', '仇上官金飞', 
'陆上龙啸天', '司空星魂', '邀衣人', '主', '李寻欢天', '东情', '玉夫随', '赵小凤', '东郭灭', '邀祟厚', '司空星'}
```

感兴趣的还可以用古代诗人、词人等的名字来做训练，大家机器好或者有时间的可以多训练下，训练得越多越准确。

# 总结
RNN由于具有记忆功能，在NLP、Speech、Computer Vision等诸多领域都展示了强大的力量。实际上，RNN是[图灵等价的](http://binds.cs.umass.edu/papers/1995_Siegelmann_Science.pdf)。
```
If training vanilla neural nets is optimization over functions, training recurrent nets is optimization over programs.
```
LSTM是一种目前相当常用和实用的RNN算法，主要解决了RNN的long-term dependencies问题。另外RNN也一直在产生新的研究，比如Attention机制。有空再介绍咯。。。


# Refers
* http://colah.github.io/posts/2015-08-Understanding-LSTMs/
* http://karpathy.github.io/2015/05/21/rnn-effectiveness/
* https://www.zhihu.com/question/29411132
* https://gist.github.com/karpathy/d4dee566867f8291f086
* https://deeplearning4j.org/lstm.html
