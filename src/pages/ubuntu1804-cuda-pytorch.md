---
title: Ubuntu18.04 pytorch cuda/cudnn
draft: false
tags: [pytorch, deep learning, cuda, cudnn]
category: Blockchain
date: '2018-08-14T07:41:32Z'
---

<!-- more -->

# python

# pytorch

# cuda/cudann

https://zhuanlan.zhihu.com/p/59618999
https://zhuanlan.zhihu.com/p/72298520
https://www.linuxbabe.com/ubuntu/install-nvidia-driver-ubuntu-18-04

drivers:

```
ubuntu-drivers devices
sudo ubuntu-drivers autoinstall
```

nvidia-smi

可以直接装 cuda，会安装上 drivers
https://docs.nvidia.com/cuda/cuda-quick-start-guide/index.html#ubuntu-x86_64-run

```sh
===========
= Summary =
===========

Driver:   Not Selected
Toolkit:  Installed in /usr/local/cuda-10.1/
Samples:  Installed in /home/wc/, but missing recommended libraries

Please make sure that
 -   PATH includes /usr/local/cuda-10.1/bin
 -   LD_LIBRARY_PATH includes /usr/local/cuda-10.1/lib64, or, add /usr/local/cuda-10.1/lib64 to /etc/ld.so.conf and run ldconfig as root

To uninstall the CUDA Toolkit, run cuda-uninstaller in /usr/local/cuda-10.1/bin

Please see CUDA_Installation_Guide_Linux.pdf in /usr/local/cuda-10.1/doc/pdf for detailed information on setting up CUDA.
***WARNING: Incomplete installation! This installation did not install the CUDA Driver. A driver of version at least 418.00 is required for CUDA 10.1 functionality to work.
To install the driver using this installer, run the following command, replacing <CudaInstaller> with the name of this run file:
    sudo <CudaInstaller>.run --silent --driver

Logfile is /var/log/cuda-installer.log
```

https://docs.nvidia.com/deeplearning/sdk/cudnn-install/index.html#installlinux

```bash
sudo dpkg -i libcudnn7*.deb
```

貌似 conda 安装， 自己会安装 cuda 和 cudnn。
https://zhuanlan.zhihu.com/p/46579831

# jupyter notebook 远程

https://zhuanlan.zhihu.com/p/64524822

## jupyter 插件

https://www.jianshu.com/p/548b893e0b73
https://www.jiqizhixin.com/articles/2018-12-20-12

## yapf

https://github.com/google/yapf

## 检查 pytorch 用到 cuda 加速没

```py
torch.cuda.is_available()


N = 10000
a = torch.rand(N, N)
b = torch.rand(N, N)

%time torch.mm(a, b)

ac = a.cuda()
bc = b.cuda()
%time torch.mm(ac, bc)
```

# OpenAI Gym

render 错误

https://gist.github.com/joschu/e42a050b1eb5cfbb1fdc667c3450467a
https://stackoverflow.com/questions/40195740/how-to-run-openai-gym-render-over-a-server
安装 xvfb

```sh
sudo apt-get install xvf
xvfb-run -s "-screen 0 1400x900x24" /bin/bash
```

xvfb start error
https://stackoverflow.com/questions/16726227/xvfb-failed-start-error
http://blog.sina.com.cn/s/blog_77e21fb901014rw1.html

```sh
xvfb-run -a [mycommand]
```

# ssh 避免自动断开

https://blog.phpgao.com/keep_connect_ssh.html
https://my.oschina.net/clin003/blog/1600138
