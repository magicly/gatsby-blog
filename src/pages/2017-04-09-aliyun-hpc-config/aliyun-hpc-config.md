---
title: 阿里云HPC深度学习配置从入门到真的放弃
draft: false
tags: [rnn, neural network, dl, ml]
category: ML
date: "2017-04-19T10:03:02Z"
---

深度学习没有GPU的支持可以说完全不能解决实际问题， 稍大一点的数据集可能就要几个小时，GPU能起到10倍以及更高的速度提升。之前我们做了[AWS的深度学习配置](http://magicly.me/2017/04/15/aws-dl-config/)，今天再看看国内阿里云的HPC配置。

<!-- more -->

# 购买 & 登录
在[阿里云hpc页面](https://hpc-buy.aliyun.com/#/postpay)购买，目前按量付费只支持华东1（杭州），G4配置：
> CPU : Intel Xeon E5 v4 CPU 32物理核 
> GPU : Nvidia Tesla M40 x2
> 单机峰值计算能力突破每秒16万亿次单精度浮点运算。

价格是37.50￥/时，价格差不多是AWS p2.xlarge的6倍， 所以我们最后要测试一下AWS p2.xlarge和阿里云HPC的性能对比，看看谁的性价比高。

对了，阿里云HPC目前不支持自定义镜像，只有一种选择CentOS7！！！！所以后面我们必须用docker，不然如果按需付费来使用的话， 每次都得重装所有软件。可以把docker看成轻量级的AMI镜像。

由于HPC是只能内网访问的物理机， 需要先登录跳转机， 然后走内网访问HPC，这样安全一些。华东1购买HPC的时候会分配一个跳转机，需要在[控制台](https://hpc.console.aliyun.com/#/postpay/list/)设置跳转机的初始密码，重启跳转机密码方能生效。HPC物理机的密码会通过阿里云站内消息的方式发给你，好像都是111111，建议在第一次登录的时候用passwd命令修改。

# 配置外网
现在HPC物理机能直接访问外网了？！！
wget能直接访问， 但是yum install的时候就是网络超时，真是蛋疼！

参看[这篇文档](https://yq.aliyun.com/articles/66993?spm=5176.doc48632.2.5.V1yqJr)配置HPC外网。文档里面有好几个地方不对，我重新写一下吧。
## 跳转机ECS配置
1. 下载VPN包，解压并进入VPN-ECS
```
wget http://public-img-test.oss-cn-hangzhou.aliyuncs.com/VPN.tar.gz
tar zxvf VPN.tar.gz && cd VPN/VPN-ECS
```
2. 目录下并没有文档说的run.sh， 而是两个
```
run4centos6.sh
run4centos7.sh
```
用lsb_release命令查看系统版本（还记得我说其实目前只能选centos7么）：
```
[root@iZ23gbdj71dZ VPN-ECS]# lsb_release -a
LSB Version:	:core-4.1-amd64:core-4.1-noarch
Distributor ID:	CentOS
Description:	CentOS Linux release 7.0.1406 (Core)
Release:	7.0.1406
Codename:	Core
```
那就执行run4centos7.sh吧
3. ifconfig检查是否有vpn_ppp0这个网卡
```
ifconfig
vpn_vpn0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.30.11  netmask 255.255.255.0  broadcast 192.168.30.255
        ether 00:ac:66:6f:b0:52  txqueuelen 500  (Ethernet)
        RX packets 1  bytes 42 (42.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 4  bytes 168 (168.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```

## HPC配置
1. 下载VPN包，解压并进入VPN-HPC
由于HPC目前不能访问外网OSS（真是蛋疼， 其实HPC现在访问外网比如http://www.platform.ai/files/dogscats.zip是可以的，但居然真的不能访问http://public-img-test.oss-cn-hangzhou.aliyuncs.com/VPN.tar.gz！！！），所以用scp将之前在跳转机上下载的VPN包copy到HPC。
```
scp root@[跳转机内网IP地址]:/root/VPN.tar.gz .
tar zxvf VPN.tar.gz && cd VPN/VPN-HPC
```
2. 执行run.sh
```
./run.sh [跳转机内网IP地址]
```
3. 测试是否能访问外网
```
ping www.taobao.com
curl www.taobao.com
wget www.baidu.com
```
可以了。 话说我一开始就可以啊！！！！
测试一下wget VPN包呢？
```
[root@AliHPC-M40-410 VPN-HPC]# wget http://public-img-test.oss-cn-hangzhou.aliyuncs.com/VPN.tar.gz
--2017-04-19 10:50:59--  http://public-img-test.oss-cn-hangzhou.aliyuncs.com/VPN.tar.gz
正在连接 10.168.56.7:3128... 失败：没有到主机的路由。
```
居然还是访问不到!!!
4. 文档里面说如果这时候还不行， 看看http_proxy & https_proxy两个变量，如果设置了，删除
```
[root@AliHPC-M40-410 VPN-HPC]# echo $http_proxy
http://10.168.56.7:3128/
[root@AliHPC-M40-410 VPN-HPC]# echo $https_proxy
http://10.168.56.7:3128/
```
确实设置了， 试试看删除之后呢。
```
unset http_proxy
unset https_proxy
wget http://public-img-test.oss-cn-hangzhou.aliyuncs.com/VPN.tar.gz
```
好吧，真的可以了！！！

# 配置docker
参考[这篇https://yq.aliyun.com/articles/64979?spm=5176.doc48632.2.6.V1yqJr](https://yq.aliyun.com/articles/64979?spm=5176.doc48632.2.6.V1yqJr)，其实大部分都不是必须的，只需要下面两步即可。
1. 更新repo，镜像里已经装了docker的，更新一下版本
```
sudo yum update
```
2. 验证docker是否装好
```
sudo docker run hello-world
```
噢啦。。。

## 安装nvidia-docker
nvidia－docker 是 Nvidia 公司为 docker 所做的封装，开源代码可以在[Github](https://github.com/NVIDIA/nvidia-docker)找到。nvidia－docker 可以对GPU做抽象，只要容器中的GPU驱动版本不高于宿主机的GPU驱动版本，即可在容器中使用GPU资源。
```
# Install nvidia-docker and nvidia-docker-plugin
wget -P /tmp https://github.com/NVIDIA/nvidia-docker/releases/download/v1.0.1/nvidia-docker-1.0.1-1.x86_64.rpm
sudo rpm -i /tmp/nvidia-docker*.rpm && rm /tmp/nvidia-docker*.rpm
sudo systemctl start nvidia-docker

# Test nvidia-smi
nvidia-docker run --rm nvidia/cuda nvidia-smi
```

# 测试tensorflow
阿里云HPC服务器在交付时已经安装好TensorFlow （版本 0.8rc），用户无需做任何额外工作即可直接运行。
```
/disk1/deeplearning/anaconda2/bin/python -m "tensorflow.models.image.mnist.convolutional"
```

上两张图，看一下跑起来的时候资源消耗：
![nvidia-smi when tensorflow is run](http://oml1i2pi6.bkt.clouddn.com/nvidia-smi-when-tensorflow-is-run.png)
![htop when tensorflow is run](http://oml1i2pi6.bkt.clouddn.com/htop-when-tensorflow-is-run.png)

# tensorflow docker
我打算用docker跑tensorflow，测试一下性能。结果用[阿里提供的镜像](https://help.aliyun.com/document_detail/51489.html)时候又发现cuda版本问题。
```
[root@AliHPC-M40-410 deeplearning]# nvidia-docker run registry.cn-beijing.aliyuncs.com/tensorflow-samples/alexnet_benchmark:1.0.0-devel-gpu

Status: Downloaded newer image for registry.cn-beijing.aliyuncs.com/tensorflow-samples/alexnet_benchmark:1.0.0-devel-gpu
nvidia-docker | 2017/04/19 13:02:34 Error: unsupported CUDA version: driver 7.5 < image 8.0
```
直接用yum upgrade cuda不行的， 需要添加cuda8的源才能正常安装cuda8， 参看[nvidia文档](https://developer.nvidia.com/cuda-downloads)
```
wget http://developer.download.nvidia.com/compute/cuda/repos/rhel7/x86_64/cuda-repo-rhel7-8.0.61-1.x86_64.rpm
rpm -ivh cuda-repo-rhel7-8.0.61-1.x86_64.rpm
yum install cuda
```
居然有1.3G这么大，花了一个多小时，55555， 有点想放弃了，关键是安装了之后不能制作镜像，如果按需付费下次还得再来一次，每次安装cuda8就得花40块钱？！！！看样子阿里云HPC就是给有钱人准备的,9000￥/月。我已经给阿里云提了工单，请求他们把镜像升级到cuda8.0， 不知道啥时候回响应呢。
```
安装  2 软件包 (+31 依赖软件包)
升级  1 软件包 (+ 4 依赖软件包)

总下载量：1.3 G
Is this ok [y/d/N]: y
```
装好之后居然
```
[root@AliHPC-M40-410 deeplearning]# nvidia-smi                                          │[root@AliHPC-M40-410 deeplearning]# nvidia-docker stop 2448268d9525
Failed to initialize NVML: Driver/library version mismatch
```
额。。。。。。。

在等待cuda安装的时候，我在阿里云的docker hub上找了个[tensorflow镜像](https://dev.aliyun.com/list.html?namePrefix=tensorflow)。这个docker image包含jupyter notebook，默认监听的端口是8888，需要把docker的端口映射到宿主机（HPC）上。
```
nvidia-docker run -p 80:8888 registry.cn-hangzhou.aliyuncs.com/denverdino/tensorflow
```
这时候在HPC上wget localhost就可以访问到jupyter notebook的index.html了，但是我们之前说过HPC只能在内网，所以还需要配置[反向代理](https://help.aliyun.com/document_detail/25836.html)。
1. ECS跳转机部署代理服务器tengine
```
wget http://tengine.taobao.org/download/tengine-2.1.1.tar.gz
tar zxvf tengine-2.1.1.tar.gz
cd tengine-2.1.1/
./configure
make
sudo make install
```
默认安装在/usr/local/nginx/
2. 编辑ECS Tengine配置文件
root权限打开/usr/local/nginx/conf/nginx.conf，增加一个server模块，监听本机的某个端口（比如8888），将所有请求转发到HPC的物理机，配置如下：
```
    server {
        listen       8888;
    #    listen       somename:8080;
    #    server_name  somename  alias  another.alias;

        location / {
            proxy_pass http://10.172.68.130; #10.172.68.130是HPC物理机的内网地址
        }
    }
```
这样之后在ECS下wget localhost:8888可以访问到jupyter notebook的index.html了。但是用ECS公网IP在本地浏览器上访问的时候发现连不上， 应该是防火墙的原因吧，把ECS的8888的端口打开（如果ECS连不上HPC的端口，估计也是防火墙的问题，因为我这里用的是80端口，所以没有报错）。
```
iptables -I INPUT -p TCP --dport 8888 -j ACCEPT
```
AWS里的话是用安全组配置inbound rules，对于不熟悉iptables的用户要友好一些。现在可以在本地浏览器上访问jupyter notebook了。
![hpc jupyter notebook](http://oml1i2pi6.bkt.clouddn.com/hpc-jupyter-notebook.png)

# some tricks
1. 安装tmux
```
yum install tmux
```
2. 安装htop
```
-------------- For RHEL/CentOS 7 --------------
wget http://dl.fedoraproject.org/pub/epel/7/x86_64/e/epel-release-7-9.noarch.rpm
rpm -ihv epel-release-7-9.noarch.rpm 
yum install htop
```
3. 加速下载数据集
话说在HPC上直接下载数据集有点慢（尤其是国外的），可以考虑开一台最低配置的普通ecs，不限制网速，在上面下载好datasets，然后再“内网”（阿里云不同区的服务器是不能内网互联的，比如hk的ecs就不能内网访问杭州的ecs，所以需要用公网ip，但是哪怕用公网ip，速度也是上百倍的差别， 3.4MB/s vs 24.2KB/s）同步到hpc上，如果是国外的datasets，可以开一台低配的相关ecs，0.165￥/时，价格差了200多倍啊。

# 总结
经过几个小时的折腾， 我还没有配好可以正确使用gpu的HPC实例。后来看到这篇[在阿里云HPC和容器服务上，像梵高一样作画](https://yq.aliyun.com/articles/68206)，应该比较简单的， 只是目前必须用北京的HPC才可以这么方便的使用。而北京目前必须按月付费，9000￥/月，暂时我还用不起啊。所以还是先放弃HPC，用AWS吧。。。

# Refers
* https://yq.aliyun.com/articles/66993?spm=5176.doc48632.2.5.V1yqJr
* https://yq.aliyun.com/articles/64979?spm=5176.doc48632.2.6.V1yqJr
* https://help.aliyun.com/document_detail/48632.html?spm=5176.doc52231.6.573.uqYEBN
* https://github.com/NVIDIA/nvidia-docker
* https://opskumu.gitbooks.io/docker/content/chapter5.html