---
title: AWS深度学习配置
draft: false
tags: [rnn, neural network, dl, ml]
category: ML
date: "2017-04-15T08:24:24Z"
---

深度学习的流行跟计算能力的大大提高密不可分，尤其是GPU的大量使用，Nvidia去年股价涨了500%呢。用CPU要运行一个月的项目， 可能用GPU几个小时就运行完了，效率和速度不可同日耳语。工欲善其事必先利其器，所以正确地配置好GPU是进入深度学习的开端，而用AWS的GPU服务是最快捷方便的，本文就教你如何快速的配置好AWS的p2实例，提高深度学习效率。

<!-- more -->

# 安装AWS Instance
## Instance选择
AWS提供很多实例，有计算型的（CPU比较好）， 有内存型的（内存比较高），有高磁盘IO型的，也有适合用于深度学习的GPU型。具体不同型号的特点配置以及价格参见[AWS Pricing](https://aws.amazon.com/ec2/pricing/on-demand/)。

这里我们选择p2.xlarge，4核CPU，61G内存，一个Nvidia GPU（有2496个并行处理核，12G内存），具体信息可以看[这里](https://aws.amazon.com/blogs/aws/new-p2-instance-type-for-amazon-ec2-up-to-16-gpus/)。

当然p2.xlarge的价格(0.9$/h)当然比t2.xlarge的价格(0.188$/h)要高， 所以我的建议是，在本机或者t2上写好代码，找一个小一点的数据集跑一下， 调试得差不多了， 然后启动p2.xlarge，在全量数据集上run。这里说一下，如果数据集是国外的（大部分都是），aws下载能达到20MB/s，相比国内下载速度，真是爽得不要不要的。

## AMI选择
AWS Instance安装的时候支持选择镜像。还记得以前重装windows系统么， 装完之后需要安装各种驱动，输入法、qq、浏览器、word。。。blabla一堆软件，有可能几个小时就过去了。所以后来出了Ghost盘，安装好各种软件后，做个Ghost盘，然后以后重装的时候就只需要装Ghost盘，十分钟就可以装好，然后所有该要的软件都有了，大大节约了时间。AWS的镜像叫AMI。

社区已经有很多人制作了深度学习的AMI，我们也可以选择自己制作。用云服务要改变传统开发思维，要有”随要随开，用完即走“的思想。所以用aws的基本流程如下：
1. 选择一个基础的AMI
2. 安装好Instance
3. 安装各种需要的软件，比如python，numpy，matplot，tensorflow，keras，cuda等
4. 在AWS管理控制台右键选中instance，点image，create image。然后就等着，几分钟就好了。
5. 做相应的开发，写代码，下载数据集等blabla。。。
6. 工作一段时间之后要休息了，制作新的AMI
7. 释放instance
8. 第二天来，新开instance，用5制作的AMI，继续上次的工作。

这里推荐几个社区制作的深度学习相关的AMI，[Deep Learning AMI Amazon Linux Version](https://aws.amazon.com/marketplace/pp/B01M0AXXQB), Deep Learning AMI Ubuntu Linux - 1.3_Apr2017 - ami-638c1e03, [TFAMI](https://github.com/ritchieng/tensorflow-aws-ami)。我因为最近在看[Fast.ai](http://course.fast.ai/)课程， 所以选择了课程对应的AMI。话说[这个课程有完整的脚本](https://github.com/fastai/courses/tree/master/setup)来创建、开启、连接、关闭AWS实例，很是方便， 大家可以看看。这是一个实战性很强的课程， 推荐一下。

# jupyter notebook
jupyter notebook的作用和好处以及基本的安装我就不多说了， 自行google吧。主要说一下要在AMS上配置jupyter notebook需要注意的事项。

1. 需要在AMS Instance的安全组里打开8888端口。
2. 由于会在公网上访问，为了安全， 需要给jupyter notebook设置一个密码，方法如下：
```bash
ubuntu@ip-10-0-0-14:~/nbs$ ipython
In [1]: from IPython.lib import passwd
In [2]: passwd()
Enter password:
Verify password:
Out[2]: 'sha1:XXXXXXXXXXXXXXX'
In [3]: exit
```
将上诉生成的密码copy到~/.jupyter/jupyter_notebook_config.py（如果没有此文件， 先运行jupyter notebook --generate-config）里:
```
vim ~/.jupyter/jupyter_notebook_config.py
c.NotebookApp.password = u'sha1:XXXXXXXXXXXXXX'
c.NotebookApp.ip = '*' #如果没有这行，会只监听localhost:8888，外网无法访问
```
然后就可以在浏览器里输入http://[ip]:8888访问jupyter notebook，开心地开始写代码吧。

数据存放位置
```
ubuntu@ip-10-0-0-14:~/courses/deeplearning1/nbs$ find ~ -name vgg16.h5
/home/ubuntu/.keras/models/vgg16.h5
```

# 竞价实例
竞价实例是一种特殊的实例，能够以超低的价格提供配置一样的实例，和普通实例的差别在于不可停止，因此当你想跑比较大的网络的时候（训练时间大于1小时），用竞价实例会非常划算。0.9美元每小时的 p2.xlarge 在竞价实例一个月的历史记录里很少超过0.3美元。即使超过了，也不会出高于0.9美元的价格。

# 选择哪个区的AWS
这个建议看看自己的网络环境下，连哪个区的速度快。用[CloudPing.info](http://www.cloudping.info/)测试一下就可以，貌似国内访问美西要快点，我的网络好的情况下ping值能在200ms，差的时候500ms+。

# 推荐几个软件
## tmux
可以在一个ssh连接里面同时开启多个窗口，比如一个启动jupyter notebook，一个打开htop，一个执行正常的命令。并且用Ctrl + B d离开tmux后， 下次再进来（哪怕是重新ssh登录），直接用tmux attach可以回到上次的回话，相当方便。
## htop
监控内存、CPU占用等。
## screen
避免离开ssh后jupyter notebook挂掉。

# 坑
* 用fast.ai课程提供的脚本创建Instance的话，再次安装的时候报错
```
An error occurred (InvalidKeyPair.NotFound) when calling the RunInstances operation: The key pair 'aws-key-fast-ai' does not exist
```
尝试着把~/.ssh/aws-key-fast-ai.pem删除后好了。

要想做深度学习，GPU简直是必须的。举个例子， 我在t2.xlarge上用VGG16跑[kaggle dogs vs cats比赛](https://www.kaggle.com/c/dogs-vs-cats-redux-kernels-edition)，要花一个多小时，而用p2.xlarge，只需要600多s，速度提升了10倍啊！上次听AWS技术分享会，他们提到，云服务重新定义了一个公式1 \* 1000 === 1000 \* 1，是说你用1台服务器跑1000个小时所花的费用，跟1000台服务器跑1小时的费用是一样的，但这样几乎把效率提升了1000倍啊！这在没有云的时代，谁敢想象随随便便调用1000台服务器呢。

另外国内的阿里云也有针对深度学习的配置，叫[HPC](https://www.aliyun.com/product/hpc?spm=5176.8142029.388261.36.6n7Ioo)，后面也会再写篇关于阿里云HPC的配置。

# Refers
* http://www.jiqizhixin.com/article/2608
* https://zhuanlan.zhihu.com/p/25066187
* http://www.cnblogs.com/meelo/p/5994505.html
