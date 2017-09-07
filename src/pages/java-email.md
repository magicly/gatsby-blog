---
title: Java发送邮件
draft: false
date: "2015-07-13T21:34:10Z"
tags: [Java, Email, JavaMail, Apache Commons]
category: Java
photos:
- http://bruce.u.qiniudn.com/2013/11/27/reading/photos-0.jpg
- http://bruce.u.qiniudn.com/2013/11/27/reading/photos-1.jpg
description: this is desc.
---

需要在代码里面发邮件是很经常的事情，包括找回密码，通知用户领奖，监控报警等。

在Java里面实现比较简单，Oracle自己提供了[JavaMail](http://www.oracle.com/technetwork/java/javasebusiness/downloads/java-archive-downloads-eeplat-419426.html#javamail-1.4.7-oth-JPR)， 不过API比较底层，用起来不方便，可以自己封装下，也可以直接使用Apache的开源项目[Commons Email](https://commons.apache.org/proper/commons-email/)。 下面的代码，可以以小马哥的名义给自己发邮件，该功能仅用于测试，请谨慎使用，产生的问题，本人概不负责。 /微笑

<!-- more -->

```java
import org.apache.commons.mail.EmailAttachment;
import org.apache.commons.mail.EmailException;
import org.apache.commons.mail.MultiPartEmail;

import java.net.MalformedURLException;
import java.net.URL;

/**
 * Created by magicalli on 2015/7/6.
 */
public class MultiPartEmailTest {
    public static void main(String[] args) throws EmailException, MalformedURLException {
        MultiPartEmail email = new MultiPartEmail();

        email.setHostName("smtp.tencent.com");
//        email.setAuthentication("youremail@tencent.com", "***");//邮件服务器验证：用户名/密码
        email.setCharset("UTF-8");

        email.setFrom("pony@qq.com", "马化腾");
        email.addTo("magicalli@tencent.com");

        email.setSubject("加油奋斗！");
        email.setMsg("come on! 加油奋斗吧，早晚有一天你会出任CEO，迎娶白富美，走上人生巅峰！ http://www.qq.com\n\n\n pony");

        EmailAttachment attachment = new EmailAttachment();
        attachment.setPath("d:/lzl.jpg");// 本地文件
        attachment.setDisposition(EmailAttachment.ATTACHMENT);
        attachment.setDescription("林志玲1");
        attachment.setName("lzl_1");
        email.attach(attachment);

        EmailAttachment attachment2 = new EmailAttachment();
        attachment2.setURL(new URL("http://mat1.qq.com/datalib_img/star/pic/lib/2007-01-15/2007011511104716122311.jpg"));//远程文件, 如果不是qq.com域名下，内网是访问不了的哈
        attachment2.setDisposition(EmailAttachment.ATTACHMENT);
        attachment2.setDescription("林志玲2");
        attachment2.setName("lzl_2");
        email.attach(attachment2);

        email.send();
    }
}

```

[Commons Email](https://commons.apache.org/proper/commons-email/)支持好几种格式，包括简单文本，html，带附件等。需要的可以自己查看文档。

基于smtp的协议邮件协议很简单，大家甚至可以直接用telnet来发送，可以参考这边文章[Java Mail(一)：telnet实现发送收取邮件](http://blog.csdn.net/ghsau/article/details/8602076). 

一般公司内网没有验证发送方，你可以冒充公司任何一个员工发送邮件（包括你们老板），一般外面的邮件服务器，比如qq, 126, 163等，是需要验证密码的。

重申一遍，别用这个代码干坏事，后果自负， 与本人无关！

# Refers
1. [http://blog.csdn.net/ghsau/article/details/8602076](http://blog.csdn.net/ghsau/article/details/8602076)
2. [http://blog.csdn.net/ghsau/article/details/17839983](http://blog.csdn.net/ghsau/article/details/17839983)
3. [http://haolloyin.blog.51cto.com/1177454/354320](http://haolloyin.blog.51cto.com/1177454/354320)
4. [http://www.runoob.com/java/java-sending-email.html](http://www.runoob.com/java/java-sending-email.html)
5. [https://commons.apache.org/proper/commons-email/](https://commons.apache.org/proper/commons-email/)
6. [http://blog.csdn.net/qiaqia609/article/details/11580589](http://blog.csdn.net/qiaqia609/article/details/11580589)

> Written with [StackEdit](https://stackedit.io/).
