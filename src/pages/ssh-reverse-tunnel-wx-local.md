---
title: 利用SSH反向通道在本地调试微信公共号
draft: false
date: "2015-07-26T11:40:25Z"
tags: [ssh, weixin, 微信]
category: weixin
---

微信公共号现在很火，一些简单的应用，做一个公共号比开发一款app成本要小很多，而且利用朋友圈的转发，相比app去app store里上架等着用户下载，要容易很多。

但是微信公共号的调试有点不方便，必须在微信[管理后台](https://mp.weixin.qq.com/)配置一个微信能访问到（公网）的url，然后在公共号里输入内容，微信以xml格式转发给这个url，url回复之后微信再将response回复给使用公共号的微信用户。当然微信也提供了[调试工具](http://mp.weixin.qq.com/debug)， 可以直接构造数据，方便调试各个接口。 但是依然需要一个公网的url作为接口。于是最原始的开发方式就是，修改代码，上传到server，（如果是有些静态语言还需要重启服务器），然后看是否正常work，如果不行的话，在可能错误的地方打出log，然后又是修改代码，上传server，重启。。。。。就这样，每次改一点点，你都可以泡杯咖啡了，老板就会觉得你很闲。参看[为什么搞计算机工作的人总是看上去很清闲](http://www.oschina.net/news/15579/reasons-why-people-who-work-with-computers-seem-to)。

<!-- more -->

有没有办法可以直接在本地调试呢，简单说，就是微信把数据传到我本地的电脑上，我每次改完代码，不用重新上传server，直接在本地加log等。经过研究，找到几个方法，记录下来，与大家分享，绝对能节约很多很多很多时间，然后就可以去陪妹纸了， 如果你有的话，没有的话[here](http://www.zhihu.com/question/20385321)。

第一种方法，你本地电脑有公网ip。比如家里宽带，没用路由，直接把网线插上，应该就是公网IP，吧。 如果家里有多人使用，你可以再路由器里配置NAT地址转换。自行[Google](https://www.google.com.hk/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q=NAT%20%E5%9C%B0%E5%9D%80%E8%BD%AC%E6%8D%A2)吧。

第二种，也是我搜到的最多的，用ngrok这个神器！网上一堆资料，比如[这个](http://www.mbnow.tk/2014/12/05/ngrok/)，我Google到的最多的也是这个，而且看上去也应该很简单。 [花生壳](http://www.oray.com/)我10年前用过（x，不小心暴露年龄了），应该是一样的。网上说，缺点是
>不过 ngrok 速度较慢，微信服务器对实时性要求较高，每次通信超过 5 秒便超时，所以此法也不建议使用。

我觉得用花生壳的话可能好点，因为是国内的（有兴趣的可以自己去试试哈）。没有用ngrok试一下，因为“无法显示此网页”！网上就是“骗子”多，明明没有的网站，大家都描绘的绘声绘色。

第三种，用ssh建立反向通道。对了，使用此种方法，你还是需要一个公网IP的。 作为一名专业工程师，拥有公网 ip 地址的 VPS 服务器基本成了标配，[腾讯云VPS](http://www.qcloud.com/redirect.php?redirect=1002&cps_key=0a3641075e434bf76a016a44d2918e4a) 最便宜的一款每年也就几百块钱，平时挂挂自己喜欢的服务，做个站长，跑跑自己的开源项目甚爽。
1. 申请[腾讯云](http://www.qcloud.com/redirect.php?redirect=1001&cps_key=0a3641075e434bf76a016a44d2918e4a)
2. 本地安装ssh，如果是linux或mac，都是自带的。如果是windows的话，可以安装[Cygwin](https://www.cygwin.com/)，如果你嫌弃它太重了，安装了[Git](https://git-scm.com/download/gui/win)也是可以的。如果你也不想装或者不会装Git，额，(⊙o⊙)…，好吧，那你还是不要写程序了。
3. 建立ssh反向通道。
这一步里有很多坑，我花了差不多一天才完全搞定。你们可以先参考这几篇文章，了解下原理啥的。
	* [http://blog.zjutoe.net/?p=95](http://blog.zjutoe.net/?p=95)
	* [http://my.oschina.net/abcfy2/blog/177094](http://my.oschina.net/abcfy2/blog/177094)
	* [http://www.zzbaike.com/wiki/PuTTY/Putty%E5%BB%BA%E7%AB%8B%E9%9A%A7%E9%81%93%E7%9A%84%E6%96%B9%E6%B3%95](http://www.zzbaike.com/wiki/PuTTY/Putty%E5%BB%BA%E7%AB%8B%E9%9A%A7%E9%81%93%E7%9A%84%E6%96%B9%E6%B3%95)
	* [http://www.freeoa.net/osuport/netmanage/linux-ssh-tunneling-proxy_1892.html](http://www.freeoa.net/osuport/netmanage/linux-ssh-tunneling-proxy_1892.html)
	* [https://qdan.me/list/VOSXmsI4tv7fIciF](https://qdan.me/list/VOSXmsI4tv7fIciF)

好吧，来看我的具体一步一步做法。

1. ssh -R 9999:localhost:9000 ubuntu@myserver_ip_address，输入密码

2. server上查看一下是否监听了9999端口，netstat -anltp | grep 9999
	```shell
	ubuntu@VM-39-45-ubuntu:~$ netstat -anltp | grep 9999
	(Not all processes could be identified, non-owned process info
	will not be shown, you would have to be root to see it all.)
	tcp        0      0 127.0.0.1:9999          0.0.0.0:*               LISTEN      -
	tcp6       0      0 ::1:9999                :::*                    LISTEN      -
	```
3. 在本地9000（我用的[play 1](https://www.playframework.com/documentation/1.3.x/home)，可以了解下它到底为啥这么好用[Play Framework —— Java开发者的梦想框架](http://segmentfault.com/a/1190000000374033)）上开启web服务

4. 在浏览器里输入http://myserver_ip_address:9999， 居然是没有响应！奇怪！直接在server上用curl http://localhost:9999 是可以的！仔细看netstat输出，发现监听的9999端口是本地的！！！也就是说只能在本地访问，那有xx用啊！！！

5. 看看ssh --help， 原来是可以指定bind_address的， man ssh看看
	> By default, the listening socket on the server will be bound to the loopback interface only.  This may be overridden by specifying a bind_address. An empty bind_address, or the address ‘*’, indicates that the remote socket should listen on all interfaces.  Specifying a remote bind_address will only succeed if the server's GatewayPorts option is enabled (see sshd_config(5)).

  继续看看 man sshd_config
  > GatewayPorts
  Specifies whether remote hosts are allowed to connect to ports forwarded for the client.  By default, sshd(8) binds remote port forwardings to the
  loopback address.  This prevents other remote hosts from connecting to forwarded ports.  GatewayPorts can be used to specify that sshd should allow
	remote port forwardings to bind to non-loopback addresses, thus allowing other hosts to connect.  The argument may be “no” to force remote port
	forwardings to be available to the local host only, “yes” to force remote port forwardings to bind to the wildcard address, or “clientspecified” to
	allow the client to select the address to which the forwarding is bound.  The default is “no”.

 sudo vim /etc/ssh/sshd_config，添加GatewayPorts clientspecified，GatewayPorts yes也可以，退出，sudo service sshd restart，重启ssh服务。重新ssh -R :9999:localhost:9000 ubuntu@myserver_ip_address（仔细看，就9999前多了一个冒号:），输入密码，netstat -anltp | grep 9999，果然
	```
	tcp        0      0 0.0.0.0:9999            0.0.0.0:*               LISTEN      -
	tcp6       0      0 :::9999                 :::*                    LISTEN      -
	```
	浏览器里输入http://myserver_ip_address:9999， 这回可以看到本地打出日志了。

6. 然后发现微信里面配置的url只能是80端口。简单，直接改成ssh -R :80:localhost:9000 ubuntu@myserver_ip_address就可以了，吧！奇怪，直接访问http://myserver_ip_address， 打不开网页！用netstat -anltp | grep 80，居然什么都没有！说明server没有在80端口监听呀！哦，对了ubuntu低于1024的端口是需要用root权限的。

7. ubuntu里root默认是关闭的。sudo passwd root，设置root密码后，可以打开。还需要在sudo vim /etc/ssh/sshd_config	添加
  ```
	#PermitRootLogin without-password
	PermitRootLogin yes
  ```
8. 重启ssh，再重新用root账号连接，ssh -R :80:localhost:9000 root@myserver_ip_address， 一切ok，http://myserver_ip_address， 本地代码打出日志，说明流量已经导入到本地了。
9. 最后，就可以在[微信公众平台接口调试工具](http://mp.weixin.qq.com/debug)里调试了，配合[Play!](http://playframework.com/)的hot reload，随时修改代码，加log，然后马上就可以看到效果，不用重新编译，不用上传server，不用重启。。。。生活真是幸福美满啊。。。。
10. 几个问题说明：
	1. 直接用ssh连接的话，断开之后端口映射就没有了，可以用autossh， 只是我就是临时需要调试用的时候才ssh建立反向隧道，所以我不用autossh。
	2.  直接用root登陆ssh，开通80端口。应该是有安全隐患的， 吧！对安全不是很了解，但感觉直接用root肯定不是最佳实践。网上有各种方法解决这个问题，比如用iptables端口映射，或者nginx反向代理的，[看这里](http://stackoverflow.com/questions/23281895/node-js-eacces-error-when-listening-on-http-80-port-permission-denied)，参看1的原因，我没有采用。还是一次focus一个点吧，不然光环境就配置几天，有点太慢了。

通过本文的配置，可以在本地方便的开发调试微信公共号了。但是对于微信提供的[JS-SDK](http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html)，又存在另外的问题，这个我会[另外写一篇blog来解决](http://my.oschina.net/magicly007/blog/480704)。毕竟，我们程序员应该坚持[Single responsibility principle](https://en.wikipedia.org/wiki/Single_responsibility_principle)嘛。


# Refers
1. [http://www.mbnow.tk/2014/12/05/ngrok/](http://www.mbnow.tk/2014/12/05/ngrok/)
2. [http://my.oschina.net/jfinal/blog/336861](http://my.oschina.net/jfinal/blog/336861)
3. [http://www.mbnow.tk/2014/12/05/ngrok/](http://www.mbnow.tk/2014/12/05/ngrok/)
4. [http://liyaodong.com/2015/07/06/%E5%BE%AE%E4%BF%A1%E8%B0%83%E8%AF%95%E7%9A%84%E9%82%A3%E4%BA%9B%E4%BA%8B/](http://liyaodong.com/2015/07/06/%E5%BE%AE%E4%BF%A1%E8%B0%83%E8%AF%95%E7%9A%84%E9%82%A3%E4%BA%9B%E4%BA%8B/)
5. [http://my.oschina.net/abcfy2/blog/177094](http://my.oschina.net/abcfy2/blog/177094)
6. [http://www.zhihu.com/question/25456655](http://www.zhihu.com/question/25456655)
7. [http://my.oschina.net/atanl/blog/391611](http://my.oschina.net/atanl/blog/391611)

> Written with [StackEdit](https://stackedit.io/).
