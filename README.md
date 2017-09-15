# gatsby-blog

Gatsby starter for creating a blog. Have a look at [My Blog](https://magicly.me/) first.

# Powered By
* [Gatsby][gatsby]
* [Styled Components][sc]
* [Gitment][gitment]
* [IconFont+][iconfont]

theme inspired by [Yilia][yilia], but not exact same due my css ability.

# Get started
```bash
npm install

gatsby develop
```

# Deploy
```bash
gatsby build
```
then you can deploy what's in `public/` to whatever you choose, e.g. [Git Pages](https://pages.github.com/) or [Netlify](https://www.netlify.com/).

After you deploy successfully once, you may use `deploy.sh` to help you. Maybe you need change sth in `deploy.sh`.


==================================================================
# 中文

用[Gatsby][gatsby]写的blog。可以先看看[我的blog](https://magicly.me/)。

使用了这些项目：
* [Gatsby][gatsby]
* [Styled Components][sc]
* [Gitment][gitment]
* [IconFont+][iconfont]

主题参考了[Yilia][yilia], 之前微博私信了[作者](http://weibo.com/litten225)想邀约他一起移植[Yilia][yilia]主题到[Gatsby][gatsby]的， 不过作者一直没回复我， 我就大概参考着写了下CSS样式。由于不熟悉SCSS，有些细节移植得不好，动画也没有做，iconfont我用的阿里的[IconFont+][iconfont]自己找的。

# 开始使用
直接clone本项目，然后安装启动就可以了。
```bash
npm install

gatsby develop
```

# 部署
执行
```bash
gatsby build
```
然后`public/`目录下的内容就是生成的所有静态内容，可以直接部署到[Git Pages](https://pages.github.com/)或者[Netlify](https://www.netlify.com/)，相比github pages更推荐Netlify，值得尝试一下。 不过两个都是海外的， 如果想在国内快点，可以用[Coding.net](https://coding.net/)，国内快很多。

部署过一次之后应该配置好了git等， 下次用的时候就可以直接执行`deploy.sh`文件了，你可以根据自己的需要调整一下。

[gatsby]: https://github.com/gatsbyjs/gatsby
[sc]: https://github.com/styled-components/styled-components
[gitment]: https://github.com/imsun/gitment
[iconfont]: http://iconfont.cn/
[yilia]: https://github.com/litten/hexo-theme-yilia