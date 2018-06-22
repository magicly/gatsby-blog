---
title: 手机抓socket包
draft: false
tags: [socket, proxy, tcp]
category: Network
date: "2018-06-22T20:45:42Z"
---

需要抓一个 app 的包， 不是 http， 一开始以为是 websocket 走了一些弯路， 最后发现是 socket。

<!-- more -->

# 抓 Http/Https

这个很容易， 有很多 proxy 可以， 比如 charles, fiddler, mitmproxy 等， 以及很多开源项目， 用 go 写的， 用 nodejs 写的都很多， 比如：

- https://github.com/nodejitsu/node-http-proxy
- https://github.com/alibaba/anyproxy
- https://github.com/avwo/whistle
- https://github.com/snail007/goproxy
- https://github.com/elazarl/goproxy

这里遇到一个坑， android7.0 之后已经抓不到 https 包了， 哪怕你装了证书， 还需要在 app 内部配置， 也就是说你只能抓自己的 app 的包， 或者破解别人的 app 更改配置后重新打包， 或者 root 之后用 Xposed 的插件 JustTrueMe。

- https://pediy.com/thread-219283.htm
- https://www.jianshu.com/p/e1ffb66e459c
- https://blog.csdn.net/u011045726/article/details/76064048

# ios 抓 socket 包

转战 ios 抓， https 抓到了。发现 charles 里面看不到， 因为是 realtime 应用， 考虑估计用的是 websocket， 然后考虑把 ios 的流量全部导入代理（普通的只能代理 http/https）。

有人推荐了用 rvi 或者 mac 共享热点的方式， 然后用 wireshark 抓：

- https://www.jianshu.com/p/eeb7fd12ef11
- https://blog.netspi.com/intercepting-native-ios-application-traffic/
- http://www.find-bug.com/archives/4901
- https://www.v2ex.com/t/383671
- https://www.zhihu.com/question/20467503
- https://github.com/sundy-li/wechat_brain/issues/18

但是 wireshark 不能通过简单地导入 ssl 证书抓 https， 配置稍微复杂：

- http://joji.me/zh-cn/blog/walkthrough-decrypt-ssl-tls-traffic-https-and-http2-in-wireshark
- https://imququ.com/post/how-to-decrypt-https.html
- https://imququ.com/post/http2-traffic-in-wireshark.html

后来发现 android 可以用 Drony 代理 socks 代理， ios 应该也有吧。 找了好久终于发现可以用 AnyLink， 免费好用！

然后就简单了， 开启 socks5 代理， 将全部流量导入 charles，charles 是支持 websocket 的， 结果发现其实是普通 socket， 也 ok。

然而 charles 貌似不能编程， 那很简单， 找一个支持 tcp 的开源代理项目就 ok 了。

- https://github.com/armon/go-socks5
- https://github.com/mscdex/socksv5

懒得看，何不自己用 node.js 自己写一个， 几行代码的事情：

- https://github.com/whtiehack/socket-proxy
- https://my.oschina.net/waterbear/blog/289739
- https://github.com/gonzalo123/nodejs.tcp.proxy

但是发现获取不到目标 ip 地址， 直接获取到的都是代理地址， 找了个项目

- https://github.com/mscdex/socksv5

这个可以得到目标地址，具体实现是自己去解析 tcp 包， 这个是 socks5 的规范。

> DSTPORT andDSTIP 两个域分别是目标主机的端口和 IP 地址。

- https://blog.csdn.net/kalman2008/article/details/45919741

剩下的就是分析包了。

一些可能有用的资料：

- https://github.com/txthinking/brook
- https://5socks.net/Manual/rdp_iphone_eng.htm
- https://github.com/chrisballinger/ProxyKit
- https://github.com/twotreeszf/PrettyTunnel
- https://github.com/halogenica/iphone-socks-proxy

Android 破解的一些资料：

- http://www.520monkey.com/
- https://www.anquanke.com/post/id/91588
- https://blog.csdn.net/guolin_blog/article/details/49738023
- https://www.jianshu.com/p/9e0d1c3e342e
- https://juejin.im/entry/585f3646da2f600065903ff7
- https://segmentfault.com/a/1190000005133219
- https://medium.com/@fwouts/blocking-websites-on-android-90958a1aca5
- https://blog.csdn.net/dreamer2020/article/details/52761606
- https://www.jianshu.com/p/eb766d2bb837
- http://unclechen.github.io/2016/09/07/Android%E5%8F%8D%E7%BC%96%E8%AF%91%E6%8A%80%E6%9C%AF%E6%80%BB%E7%BB%93/
- https://github.com/ufologist/onekey-decompile-apk
- https://github.com/alibaba/dexposed
- https://blog.csdn.net/jiangwei0910410003/article/details/51671019
-
