---
title: Docker DRL
draft: false
tags: [pytorch, deep learning, cuda, cudnn, docker, tensorflow]
category: AI
date: '2020-01-20T07:41:32Z'
---

<!-- more -->

# docker / nvidia-docker install

安装 docker:

- https://docs.docker.com/install/
- https://docs.docker.com/install/linux/docker-ce/ubuntu/ ubuntu 安装
- https://docs.docker.com/install/linux/linux-postinstall/ 配置 docker group

安装 Nvidia driver.（参考前文）

安装 nvidia-docker（为了使用 GPU）: https://github.com/NVIDIA/nvidia-docker

# 国内镜像加速

- 配置`/et/docker/daemon.json`
- 重启 docker
  ```bash
  $ sudo systemctl daemon-reload
  $ sudo systemctl restart docker
  ```
- 检查是否生效

  ```bash
  $ docker info
  ```

- https://www.jianshu.com/p/405fe33b9032
- https://juejin.im/post/5cd2cf01f265da0374189441
- https://www.jianshu.com/p/1a4025c5f186
- https://yeasy.gitbooks.io/docker_practice/install/mirror.html
- https://ieevee.com/tech/2016/09/28/docker-mirror.html

测速： https://github.com/silenceshell/docker_mirror
https://blog.csdn.net/CSDN_duomaomao/article/details/73161076

次数太多，报错了。

```bash
See "systemctl status docker.service" and "journalctl -xe" for details.

docker.socket: Failed with result 'service-start-limit-hit'
```

https://github.com/docker/for-linux/issues/162
删掉`/var/lib/docker`重启解决 `Remove /var/lib/docker (rm -rf /var/lib/docker). Restart Docker solved the problem.`

https://forum.manjaro.org/t/docker-service-cant-start-solved/93410/4

```bash
sudo journalctl --no-hostname --no-pager -b -u docker.service
```

https://forum.manjaro.org/t/cant-start-docker-process/35164/5

# pytorch image

https://hub.docker.com/r/pytorch/pytorch/

默认只是用 cpu， 如何使用 gpu(https://github.com/NVIDIA/nvidia-docker)：

```bash
docker run --gpus all
```

# tensorflow image

- https://hub.docker.com/r/tensorflow/tensorflow/
- https://www.tensorflow.org/install/docker?hl=zh-cn
- https://bluesmilery.github.io/blogs/252e6902/

# performance test

cpu/gpu 几乎一致

```python
import torch
import time

print(torch.cuda.is_available())
print(torch.__version__)


N = 20000
a = torch.rand(N, N)
b = torch.rand(N, N)

t1 = time.time()
torch.mm(a, b)
t2 = time.time()
print(f'mm cost: {t2 - t1}')

t1 = time.time()

ac = a.cuda()
bc = b.cuda()

t2 = time.time()
print(f'to cuda cost: {t2 - t1}')


r = torch.mm(ac, bc)

t2 = time.time()
print(f'cuda mm cost: {t2 - t1}')

```

# python

安装 jupyter

必须指定 IP 才可以

```bash
jupyter notebook --port=8889 --ip=0.0.0.0
```

# jupyter notebook 远程

## jupyter 插件

# OpenAI Gym

# ssh 避免自动断开

# 私有仓库

- https://yeasy.gitbooks.io/docker_practice/repository/registry.html
- https://www.jianshu.com/p/2d9d4cdd3af7
- https://www.jianshu.com/p/9cf9d1c8b00c

1. pull registry
2. 启动 registry, -v
3. 添加镜像 tag
4. push
5. http 问题
6. push 权限问题？

`Warning: It’s not possible to use an insecure registry with basic authentication.`

- https://docs.docker.com/registry/insecure/
- https://hacpai.com/article/1536648010107 这个终于配置好

filesystem 是 docker 里面的目录， 还是需要-v 挂在 host 的目录， 否则 restart 后数据会丢失。

## 提交镜像

https://yeasy.gitbooks.io/docker_practice/image/commit.html
