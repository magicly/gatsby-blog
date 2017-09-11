---
title: 用Gatsby重写blog
draft: false
tags: [Gatsby, React]
category: React
date: "2017-07-09T11:45:42Z"
---

最近将blog生成器由[Hexo][hexo]换到了[Gatsby][gatsby]，原来页面现保留在这里https://magicly.coding.me/， 留作纪念。

之前用[Hexo](https://hexo.io)写的blog，没有太大问题（反正我也写得少）。由于国内网络环境，托管在[Github](https://github.cm)的页面访问很慢，于是我想，是否可以像用[React](https://facebook.github.io/react/)那样开发， index.html只是一个简单的包装页面， 所有资源都打包放到bundle.js（当然webpack是可以支持code spliting的），这样我可以把index.html放在国外，然后在里面引用放在国内免费CDN上的bundle.js，这样速度就能达到最大化。 至于为什么不把index.html也放国内，因为要备案啊！！！备案啊！！！备案啊！！！一般谁会愿意为了写个blog去折腾呢？

<!-- more -->

于是google搜索react static site generator，浏览之后发现了[Gatsby][gatsby]这个开源项目，简直是神器！不仅是用React实现的项目，而且用[graphql][graphql]来实现支持多数据源，且采用了很多最佳实践，包括[Service Work](https://developers.google.com/web/fundamentals/getting-started/primers/service-workers)、离线使用等。 而且一个React Component是一个页面， 当然markdown通过[Remark](http://remark.js.org/)转化也对应一个页面，这样平时写blog就直接用markdown，有一些复杂的演示项目就可以直接写React Component了，而且后面会支持直接在markdown中应用React Component， 想想就有点小激动呢。

折腾了一周，刚好碰到前两天[发布了1.0版本](https://twitter.com/gatsbyjs/status/883051117013123072)，记录一下使用方式。

# 安装Gatsby
```bash
npm install -g gatsby
```

# 新建gatsby项目
由于项目比较新，目前没有hexo那么成熟的theme，有一些人做了一些starter， 你可以直接用我这个。
```bash
git clone https://github.com/magicly/gatsby-starter-blog.git
git checkout branch myblog
cd gatsby-starter-blog
npm install
```

# 运行
```
gatsby develop
```
热更新真是爽爆！

# 打包部署
```
gatsby build
```
会在public下生成所有的资源，如果你用github pages服务的话， 把public下的目录push上去就可以。

接着我发现了更好的pages服务，[Netlify][netlify]，你直接push源码，Netlify会自动给你打包部署到CDN，所以访问速度也会快很多（但是都在国外，还是会有一些影响）。Netlify之于Gatsby就好比github pages之于[Jekyll][jekyll]，当然Netlify也支持[Jekyll][jekyll]和[Hexo][hexo]等，以及其他很多功能，请访问[Doc](https://www.netlify.com/docs/)。

# 评论
原来用多说，然后多说关了，后来改成网易云跟帖，前几天发公告说8.1关闭服务，额。。。。。然后只好再找了一个[Gitment](https://github.com/imsun/gitment)，github应该不会倒闭吧。 用之前确实考虑了下，只支持github账号，而且国内环境也不太好你懂得，后来一想，反正受众也是coder，如果翻墙和github账号都没有的话， 也就不要评论了吧，这样就可以过滤掉来发小广告的啦。。。

==========================================

研究gatsby之余发现了[JAMStack](https://jamstack.org/)，很多想法跟我不谋而合，有时间好好学习下。


[hexo]: <https://hexo.io>
[gatsby]: <https://github.com/gatsbyjs/gatsby>
[netlify]: <https://netlify.com/>
[jekyll]: <https://github.com/jekyll/jekyll>