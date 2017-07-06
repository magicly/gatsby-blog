---
title: aws上配置docker
draft: false
tags: [aws, docker, ml]
category: ML
date: "2017-04-19T17:45:42Z"
---

# 如何查看cuda版本
http://www.cnblogs.com/shrimp-can/p/5253672.html

默认目录为：local，进入local：cd /usr/local

输入命令：ls，查看该目录下的文件，可以看到安装的cuda在此处

进入cuda文件：cd cuda-7.5（我的是7.5），此处为安装的东西

<!-- more -->

# 安装docker
https://docs.docker.com/engine/installation/linux/ubuntu/
# 安装nvidia-docker
https://github.com/NVIDIA/nvidia-docker
# docker端口映射
https://opskumu.gitbooks.io/docker/content/chapter5.html


# 遇到的问题
## dpkg lock
> dpkg: error: dpkg status database is locked by another process

https://askubuntu.com/questions/219545/dpkg-error-dpkg-status-database-is-locked-by-another-process
```
sudo rm /var/lib/dpkg/lock
sudo dpkg --configure -a
```
