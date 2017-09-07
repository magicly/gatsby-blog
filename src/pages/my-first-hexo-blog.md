---
title: 我的第一个hexo Blog
draft: false
date: "2015-07-26T11:09:45Z"
tags: [hexo, github, githubPages]
category: default
---

引用[阮老师](http://www.ruanyifeng.com/blog/2012/08/blogging_with_jekyll.html)的话，

> 喜欢写Blog的人，会经历三个阶段。
> 
	第一阶段，刚接触Blog，觉得很新鲜，试着选择一个免费空间来写。
	第二阶段，发现免费空间限制太多，就自己购买域名和空间，搭建独立博客。
	第三阶段，觉得独立博客的管理太麻烦，最好在保留控制权的前提下，让别人来管，自己只负责写文章。

自己比较懒惰，也就偶尔在[OC](http://my.oschina.net/magicly007/blog)上写点闲散的笔记，最近觉得还是应该要把自己的知识系统地梳理一下，便决定开一个独立的域名，自己记录Blog。

之前就了解Github Pages，也断断续续用MarkDown写过几篇放着，但是没有用[jekyll](http://jekyllrb.com/)，或者[octpress](http://octopress.org/)等串起来，上个月再次想配置好jekyll，结果在mac下始终配置不好（怪我咯）。今天决定一定要配置好，搜集了大量资料（google “jekyll 像黑客一样”），结果意外在[http://www.douban.com/group/topic/39939196/](http://www.douban.com/group/topic/39939196/)的回复中看到“用pelican吧 python的 还有hexo是nodejs的 ”。因为最近刚好在看nodejs，觉得很有兴趣，于是改为尝试[hexo](https://hexo.io/zh-cn/)。

<!-- more -->

# 简介

[http://ibruce.info/2013/11/22/hexo-your-blog/](http://ibruce.info/2013/11/22/hexo-your-blog/)
> hexo出自台湾大学生[tommy351](https://twitter.com/tommy351)之手，是一个基于[Node.js](https://nodejs.org/)的静态博客程序，其编译上百篇文字只需要几秒。hexo生成的静态网页可以直接放到GitHub Pages，BAE，SAE等平台上。先看看tommy是如何吐槽Octopress的 →＿→ [Hexo颯爽登場](http://zespia.tw/blog/2012/10/11/hexo-debut/)。

# 安装

首先安装Node.js，然后运行
``` shell
	npm install -g hexo-cli
	npm install hexo --save
```

# 初始化配置

``` shell
	hexo init
	npm install
```

# 写blog

``` shell
	hexo n
```

# 生成

``` shell
	hexo g
```

# 本地预览

``` shell
	hexo s
```

# 发布

``` shell
	hexo d
```

实在觉得没必[重复造轮子](https://en.wikipedia.org/wiki/Reinventing_the_wheel)，重写已经有很详细资料的东西。强烈推荐[这篇](http://ibruce.info/2013/11/22/hexo-your-blog/)。 我觉得基本涵盖了方方面面，如果以后有新东西这里面没有的，我再写吧~

# Refers
1. [http://ibruce.info/2013/11/22/hexo-your-blog/](http://ibruce.info/2013/11/22/hexo-your-blog/)
2. [http://wsgzao.github.io/post/hexo-guide/](http://wsgzao.github.io/post/hexo-guide/)
3. [http://www.jianshu.com/p/05289a4bc8b2](http://www.jianshu.com/p/05289a4bc8b2)
4. [http://yangjian.me/workspace/building-blog-with-hexo/](http://yangjian.me/workspace/building-blog-with-hexo/)
5. [http://yangjian.me/workspace/building-blog-with-hexo/](http://yangjian.me/workspace/building-blog-with-hexo/)
6. [http://blog.csdn.net/jackystudio/article/details/16117585](http://blog.csdn.net/jackystudio/article/details/16117585)


> Written with [StackEdit](https://stackedit.io/).
