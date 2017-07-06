---
title: 所有人都能学会用Python写出RNN-LSTM代码
draft: false
tags: [rnn, neural network, dl, ml]
category: ML
date: "2017-03-09T22:12:59Z"
---

本文翻译自[@iamtrask](https://twitter.com/iamtrask)的[Anyone Can Learn To Code an LSTM-RNN in Python (Part 1: RNN)](http://iamtrask.github.io/2015/11/15/anyone-can-code-lstm/)。本文作者已通过[twitter联系作者，获得授权](https://twitter.com/magicly007/with_replies)。

# 概要
我通过玩具代码一边学习一边调试能达到最好的学习效果。本文通过一个简单的python实现，教会你循环神经网络。

原文作者[@iamtrask](https://twitter.com/iamtrask)说他会在twitter上继续发布第二部分LSTM，敬请关注。

<!-- more -->

# 废话少说， 给我看看代码
```python
import copy, numpy as np
np.random.seed(0) #固定随机数生成器的种子，便于得到固定的输出，【译者注：完全是为了方便调试用的]

# compute sigmoid nonlinearity
def sigmoid(x): #激活函数
    output = 1/(1+np.exp(-x))
    return output

# convert output of sigmoid function to its derivative
def sigmoid_output_to_derivative(output):#激活函数的导数
    return output*(1-output)

# training dataset generation
int2binary = {} #整数到其二进制表示的映射
binary_dim = 8 #暂时制作256以内的加法， 可以调大

## 以下5行代码计算0-256的二进制表示
largest_number = pow(2,binary_dim)
binary = np.unpackbits(
    np.array([range(largest_number)],dtype=np.uint8).T,axis=1)
for i in range(largest_number):
    int2binary[i] = binary[i]

# input variables
alpha = 0.1 #学习速率
input_dim = 2 #因为我们是做两个数相加，每次会喂给神经网络两个bit，所以输入的维度是2
hidden_dim = 16 #隐藏层的神经元节点数，远比理论值要大（译者注：理论上而言，应该一个节点就可以记住有无进位了，但我试了发现4的时候都没法收敛），你可以自己调整这个数，看看调大了是容易更快地收敛还是更慢
output_dim = 1 #我们的输出是一个数，所以维度为1


# initialize neural network weights
synapse_0 = 2*np.random.random((input_dim,hidden_dim)) - 1 #输入层到隐藏层的转化矩阵，维度为2*16， 2是输入维度，16是隐藏层维度
synapse_1 = 2*np.random.random((hidden_dim,output_dim)) - 1
synapse_h = 2*np.random.random((hidden_dim,hidden_dim)) - 1
# 译者注：np.random.random产生的是[0,1)的随机数，2 * [0, 1) - 1 => [-1, 1)，
# 是为了有正有负更快地收敛，这涉及到如何初始化参数的问题，通常来说都是靠“经验”或者说“启发式规则”，说得直白一点就是“蒙的”！机器学习里面，超参数的选择，大部分都是这种情况，哈哈。。。
# 我自己试了一下用【0, 2)之间的随机数，貌似不能收敛，用[0,1)就可以，呵呵。。。

# 以下三个分别对应三个矩阵的变化
synapse_0_update = np.zeros_like(synapse_0)
synapse_1_update = np.zeros_like(synapse_1)
synapse_h_update = np.zeros_like(synapse_h)

# training logic
# 学习10000个例子
for j in range(100000):
    
    # 下面6行代码，随机产生两个0-128的数字，并查出他们的二进制表示。为了避免相加之和超过256，这里选择两个0-128的数字
    # generate a simple addition problem (a + b = c)
    a_int = np.random.randint(largest_number/2) # int version
    a = int2binary[a_int] # binary encoding

    b_int = np.random.randint(largest_number/2) # int version
    b = int2binary[b_int] # binary encoding

    # true answer
    c_int = a_int + b_int
    c = int2binary[c_int]
    
    # where we'll store our best guess (binary encoded)
    # 存储神经网络的预测值
    d = np.zeros_like(c)

    overallError = 0 #每次把总误差清零
    
    layer_2_deltas = list() #存储每个时间点输出层的误差
    layer_1_values = list() #存储每个时间点隐藏层的值
    layer_1_values.append(np.zeros(hidden_dim)) #一开始没有隐藏层，所以里面都是0
    
    # moving along the positions in the binary encoding
    for position in range(binary_dim):#循环遍历每一个二进制位
        
        # generate input and output
        X = np.array([[a[binary_dim - position - 1],b[binary_dim - position - 1]]])#从右到左，每次去两个输入数字的一个bit位
        y = np.array([[c[binary_dim - position - 1]]]).T#正确答案

        # hidden layer (input ~+ prev_hidden)
        layer_1 = sigmoid(np.dot(X,synapse_0) + np.dot(layer_1_values[-1],synapse_h))#（输入层 + 之前的隐藏层） -> 新的隐藏层，这是体现循环神经网络的最核心的地方！！！

        # output layer (new binary representation)
        layer_2 = sigmoid(np.dot(layer_1,synapse_1)) #隐藏层 * 隐藏层到输出层的转化矩阵synapse_1 -> 输出层

        # did we miss?... if so, by how much?
        layer_2_error = y - layer_2 #预测误差是多少
        layer_2_deltas.append((layer_2_error)*sigmoid_output_to_derivative(layer_2)) #我们把每一个时间点的误差导数都记录下来
        overallError += np.abs(layer_2_error[0])#总误差
    
        # decode estimate so we can print it out
        d[binary_dim - position - 1] = np.round(layer_2[0][0]) #记录下每一个预测bit位
        
        # store hidden layer so we can use it in the next timestep
        layer_1_values.append(copy.deepcopy(layer_1))#记录下隐藏层的值，在下一个时间点用
    
    future_layer_1_delta = np.zeros(hidden_dim)
    
    #前面代码我们完成了所有时间点的正向传播以及计算最后一层的误差，现在我们要做的是反向传播，从最后一个时间点到第一个时间点
    for position in range(binary_dim):
        
        X = np.array([[a[position],b[position]]]) #最后一次的两个输入
        layer_1 = layer_1_values[-position-1] #当前时间点的隐藏层
        prev_layer_1 = layer_1_values[-position-2] #前一个时间点的隐藏层
        
        # error at output layer
        layer_2_delta = layer_2_deltas[-position-1] #当前时间点输出层导数
        # error at hidden layer
        # 通过后一个时间点（因为是反向传播）的隐藏层误差和当前时间点的输出层误差，计算当前时间点的隐藏层误差
        layer_1_delta = (future_layer_1_delta.dot(synapse_h.T) + layer_2_delta.dot(synapse_1.T)) * sigmoid_output_to_derivative(layer_1)

        # let's update all our weights so we can try again
        # 我们已经完成了当前时间点的反向传播误差计算， 可以构建更新矩阵了。但是我们并不会现在就更新权重矩阵，因为我们还要用他们计算前一个时间点的更新矩阵呢。
        # 所以要等到我们完成了所有反向传播误差计算， 才会真正的去更新权重矩阵，我们暂时把更新矩阵存起来。
        # 可以看这里了解更多关于反向传播的知识http://iamtrask.github.io/2015/07/12/basic-python-network/
        synapse_1_update += np.atleast_2d(layer_1).T.dot(layer_2_delta)
        synapse_h_update += np.atleast_2d(prev_layer_1).T.dot(layer_1_delta)
        synapse_0_update += X.T.dot(layer_1_delta)
        
        future_layer_1_delta = layer_1_delta
    

    # 我们已经完成了所有的反向传播，可以更新几个转换矩阵了。并把更新矩阵变量清零
    synapse_0 += synapse_0_update * alpha
    synapse_1 += synapse_1_update * alpha
    synapse_h += synapse_h_update * alpha

    synapse_0_update *= 0
    synapse_1_update *= 0
    synapse_h_update *= 0
    
    # print out progress
    if(j % 1000 == 0):
        print("Error:" + str(overallError))
        print("Pred:" + str(d))
        print("True:" + str(c))
        out = 0
        for index,x in enumerate(reversed(d)):
            out += x*pow(2,index)
        print(str(a_int) + " + " + str(b_int) + " = " + str(out))
        print("------------")

```

# 运行时输出
```
Error:[ 3.45638663]
Pred:[0 0 0 0 0 0 0 1]
True:[0 1 0 0 0 1 0 1]
9 + 60 = 1
------------
Error:[ 3.63389116]
Pred:[1 1 1 1 1 1 1 1]
True:[0 0 1 1 1 1 1 1]
28 + 35 = 255
------------
Error:[ 3.91366595]
Pred:[0 1 0 0 1 0 0 0]
True:[1 0 1 0 0 0 0 0]
116 + 44 = 72
------------
Error:[ 3.72191702]
Pred:[1 1 0 1 1 1 1 1]
True:[0 1 0 0 1 1 0 1]
4 + 73 = 223
------------
Error:[ 3.5852713]
Pred:[0 0 0 0 1 0 0 0]
True:[0 1 0 1 0 0 1 0]
71 + 11 = 8
------------
Error:[ 2.53352328]
Pred:[1 0 1 0 0 0 1 0]
True:[1 1 0 0 0 0 1 0]
81 + 113 = 162
------------
Error:[ 0.57691441]
Pred:[0 1 0 1 0 0 0 1]
True:[0 1 0 1 0 0 0 1]
81 + 0 = 81
------------
Error:[ 1.42589952]
Pred:[1 0 0 0 0 0 0 1]
True:[1 0 0 0 0 0 0 1]
4 + 125 = 129
------------
Error:[ 0.47477457]
Pred:[0 0 1 1 1 0 0 0]
True:[0 0 1 1 1 0 0 0]
39 + 17 = 56
------------
Error:[ 0.21595037]
Pred:[0 0 0 0 1 1 1 0]
True:[0 0 0 0 1 1 1 0]
11 + 3 = 14
------------
```

# 第一部分：什么是神经元记忆
顺着背出字母表，你很容易做到吧？

倒着背呢， 有点难哦。

试着想一首你记得的歌词。为什么顺着回忆比倒着回忆难？你能直接跳到第二小节的中间么？额， 好像有点难。 这是为什么呢？

这其实很符合逻辑。 你记忆字母表或者歌词并不是像计算机把信息存储在硬盘上那样的（译者注：计算机可以随机访问磁盘。）。你是顺序记忆的。知道了前一个字母，你很容易知道下一个。这是一种条件记忆，只有你最近知道了前一个记忆，你才容易想起来下一个记忆，就想你熟悉的链表一样。

但是，并不是说你不唱歌的时候，歌就不在你脑子里了。而是说你如果想直接跳到中间那部分，你会发现很难直接找到其在脑中的呈现（也许是一堆神经元）。你想直接搜索到一首歌的中间部分，这是很难的， 因为你以前没有这样做过，所以没有索引可以指向歌曲的中间部分。 就好比你邻居家有很多小路， 你从前门进去顺着路走很容易找到后院，但是让你直接到后院去就不太容易。想了解更过关于大脑的知识，请看[这里](http://www.human-memory.net/processes_recall.html)。

跟链表很像，记忆这样存储很高效。我们可以发现这样存储在解决很多问题时候有优势。

如果你的数据是一个序列，那么记忆就很重要（意味着你必须记住某些东西）。看下面的视频：
<iframe width="700" height="525" src="https://www.youtube.com/embed/UL0ZOgN2SqY" frameborder="0" allowfullscreen></iframe>


每一个数据点就是视频中的一帧。如果你想训练一个神经网络来预测下一帧小球的位置， 那么知道上一帧小球的位置就很重要。这样的序列数据就是我们需要构建循环神经网络的原因。那么， 神经网络怎么记住以前的信息呢？

神经网络有隐藏层。一般而言，隐藏层的状态由输入决定。所以，一般而言神经网络的信息流如下图：
```
input -> hidden -> output
```
这很简单直接。特定的输入决定特定的隐藏层，特定的隐藏层又决定了输出。这是一种封闭系统。记忆改变了这种状况。记忆意味着，隐藏状态是由当前时间点的输入和上一个时间点的隐藏状态决定的。
```
(input + prev_hidden) -> hidden -> output
```
为什么是隐藏层而不是输入层呢？我们也可以这样做呀：
```
(input + prev_input) -> hidden -> output
```
现在，仔细想想，如果有四个时间点，如果我们采用隐藏层循环是如下图：
![hidden layer recurrence](http://oml1i2pi6.bkt.clouddn.com/hidden-recurrence.jpg)
如果采用输入层循环会是：
![input layer recurrence](http://oml1i2pi6.bkt.clouddn.com/input-recurrence.jpg)
看到区别没，隐藏层记忆了之前所有的输入信息，而输入层循环则只能利用到上一个输入。举个例子，假设一首歌词里面有"....I love you..."和"...I love carrots..."，如果采用输入层循环，则没法根据"I love"来预测下一个词是什么？因为当前输入是love，前一个输入是I，这两种情况一致，所以没法区分。 而隐藏层循环则可以记住更久之前的输入信息，因而能更好地预测下一个词。理论上而言，隐藏层循环可以记住所有之前的输入，当然记忆会随着时间流逝逐渐忘却。有兴趣的可以看[这篇blog](http://karpathy.github.io/2015/05/21/rnn-effectiveness/)。
```
            停下来好好想想， 直到你感觉想明白了再继续。
```

# 第二部分：RNN - 神经网络记忆
现在我们已经有了一些直观认识， 接下来让我们更进一步分析。正如在[反向传播这篇blog](http://iamtrask.github.io/2015/07/12/basic-python-network/)里介绍的，神经网络的输入层是由输入数据集决定的。每一行输入数据用来产生隐藏层（通过正向传播）。每个隐藏层又用于产生输出层（假设只有一层隐藏层）。如我们之前所说，记忆意味着隐藏层是由输入数据和前一次的隐藏层组合而成。怎么做的呢？很像神经网络里面其他传播的做法一样， 通过矩阵！这个矩阵定义了当前隐藏层跟前一个隐藏层的关系。

![rnn](http://iamtrask.github.io/img/basic_recurrence_singleton.png)
这幅图中很重要的一点是有三个权重矩阵。有两个我们很熟悉了。SYNAPSE_0用于把输入数据传播到隐藏层。SYNAPSE_1把隐藏层传播到输出数据。新矩阵（SYNAPSE_h，用于循环）把当前的隐藏层（layer_1）传播到下一个时间点的隐藏层（还是layer_1）。
```
            停下来好好想想， 直到你感觉想明白了再继续。
```
![forward](http://iamtrask.github.io/img/recurrence_gif.gif)
上面的gif图展示了循环神经网络的神奇之处以及一些很重要的性质。它展示了四个时间点隐藏层的情况。第一个时间点，隐藏层仅由输入数据决定。第二个时间点，隐藏层是由输入数据和第一个时间点的隐藏层共同决定的。以此类推。你应该注意到了，第四个时间点的时候，网络已经“满了”。所以大概第五个时间点来的时候，就要选择哪些记忆保留，哪些记忆覆盖。现实如此。这就是记忆“容量”的概念。如你所想，更大的隐藏层，就能记住更长时间的东西。同样，这就需要神经网络学会**忘记不相关的记忆**然后**记住重要的记忆**。第三步有没看出什么重要信息？为什么**绿色**的要比其他颜色的多呢？

另外要注意的是隐藏层夹在输入层和输出层中间，所以输出已经不仅仅取决于输入了。输入仅仅改变记忆，而输出仅仅依赖于记忆。有趣的是，如果2，3，4时间节点没有输入数据的话，隐藏层同样会随着时间流逝而变化。
```
        停下来好好想想，确保你明白了刚讲的内容。
```

# 第三部分：基于时间的反向传播
那么循环神经网络是怎么学习的呢？看看下面的图。黑色表示预测结果，明黄色表示错误，褐黄色表示导数。
![bp](http://iamtrask.github.io/img/backprop_through_time.gif)
网络通过从1到4的全部前向传播（可以是任意长度的整个序列），然后再从4到1的反向传播导数来学习。你可以把它看成一个有点变形的普通神经网络，除了我们在不同的地方共享权值（synapses 0,1,and h）。除了这点， 它就是一个普通的神经网络。


# 我们的玩具代码
来，我们用循环神经网络做个模型来实现**二进制加法**。看到下面的图没，你猜猜顶上的彩色的1表示什么意思呢？
![toy code](http://iamtrask.github.io/img/binary_addition.GIF)
方框里的彩色的1表示**进位**。我们就要用循环神经网络来记住这个进位。求和的时候需要记住**进位**（如果不懂，可以看[这里](https://www.youtube.com/watch?v=jB_sRh5yoZk)）。

二进制加法做法就是，从右往左，根据上面两行的bit来预测第三行的bit为1还是0。我们想要神经网络遍历整个二进制序列记住是否有进位，以便能计算出正确的结果。不要太纠结这个问题本身，神经网络也不在乎这个问题。它在乎的只是每个时刻它会收到两个输入（0或者1），然后它会传递给用于记忆是否有进位的隐藏层。神经网络会把所有这些信息（输入和隐藏层的记忆）考虑进去，来对每一位（每个时间点）做出正确的预测。

----------------
下面原文里面是针对每行代码做的注释， 为了方便阅读， 我直接把注释写到了代码里面， 便于大家阅读。


译者注：RNN在自然语言处理里面大量使用，包括机器翻译，对话系统，机器做诗词等，本文只是简单介绍了一下原理。后续我会写一些应用方面的文章，敬请期待。
