---
title: VSCode remote开发
draft: false
date: "2020-11-20T22:04:10Z"
tags: [VSCode, remote, docker]
category: VSCode
---

# ssh

https://code.visualstudio.com/docs/remote/ssh

VSCode可以直接ssh连到server上开发， 体验跟本地完全一致， 再也不担心自己电脑渣了。 有台server开着， 可以一个轻薄本走天下了~

# docker

https://code.visualstudio.com/docs/remote/containers

https://code.visualstudio.com/docs/containers/ssh

VSCode也可以直接连到docker（在本地）， 这个适用于环境比较复杂， 有现成的docker可以直接使用， 避免安装太多依赖， 甚至有些版本冲突的情况。

https://github.com/microsoft/vscode-remote-try-python

# other

可不可以连到远程server里面跑得docker呢？

https://code.visualstudio.com/docs/remote/containers-advanced#_developing-inside-a-container-on-a-remote-docker-host