---
title: 接入微信SDK的坑s
draft: false
date: "2018-02-06T15:44:10Z"
tags: [微信, Wechat, React Native, RN]
category: FE
---

最近做个app要接入一下微信sdk，按理说很简单的， 但是碰到很多坑， 记录一下。

<!-- more -->

APP是用RN做的， 自然想找一个封装好的RN微信，于是找到了https://github.com/yorkie/react-native-wechat ，这个还算是star多得， 有1000多个， 相比另外一个https://github.com/reactnativecn/react-native-wx 貌似要活跃一些，用户也较多， 那就选react-native-wechat吧， 结果也已经7个多月没有更新过了，里面用的android的sdk都是两年多前的， 作者貌似都不知道现在用gradle了。自然也就不支持微信小程序分享。 后来看到有人提交了PR: https://github.com/yorkie/react-native-wechat/pull/324 ，更新了sdk，支持小程序， 不过作者貌似没有merge。 索性干脆直接依赖这个fork吧：https://github.com/LittoCats/react-native-wechat .

然后就是按照说明配置好依赖和appId等。 结果，死活分享不出去。后来能分享出去了， 但是卡死在调用哪里， 都已经用try/catch包起来了， 但是两条路都没有走。
```js
    try {
      const result = await Wechat.shareToTimeline({
        type: 'text',
        description: 'hello, wechat',
      });
      console.log('share text message to time line successful:', result);
    } catch (e) {
      console.error(e.stack);
    }
```
既不成功，也不失败。。。。。

然后去看JS源码，看Java源码。最后发现是Java里面的回调就没有执行：
```java
	// 第三方应用发送到微信的请求处理后的响应结果，会回调到该方法
	@Override
	public void onResp(BaseResp resp) {
    // ...
  }
```
那应该就是包名或签名没有配置好了。 仔细检查没有问题啊， 也用微信提供的签名工具提取了签名。后来下载了微信的demo，一步一步调试和查资料尝试，过程花了两天， 懒得细说了，最后发现下面这些坑s：
## 微信平台审核过之后包名和签名可以修改么？
可以。但是微信有缓存！！！要么卸载微信重装， 要么清楚微信数据， 记住是要从系统设置里面清除， 而不是从微信app里面清除！
* http://ask.dcloud.net.cn/question/18354
* http://blog.csdn.net/ZFY11/article/details/78216278


## 微信后台配置的包名必须是manifest里面的package！！！
这个是最坑的。 因为RN默认生成的package和目录结构是`com.xxx`，而我要取另外的包名，于是在`app/build.gradle`文件里面改了`applicationId`，以为可以了，结果不行！！！微信要的其实根本就不是APP的包名， 而是类的目录结构（也算是Java的包名吧。。。）！！！！
至于manifest里的package和applicationId有什么区别，请看：
* http://blog.csdn.net/qq1072313099/article/details/52872800
* http://blog.csdn.net/u011889786/article/details/54296462

跟同事分析， 微信sdk的工具机制应该是： 微信sdk里面注册了scheme，分享或登录后微信通过scheme通知微信sdk， 然后微信sdk根据“包名”找到我们的代码`{package}.wxapi/WXEntryActivity.java`，然后执行里面的`onResp()`回调函数。所以其实微信要的不是app的包名， 而是需要找到代码的位置！！！

## 微信分享sdk不支持分享多张图片
这个用系统的分享接口反而支持！
https://github.com/yorkie/react-native-wechat/issues/270
