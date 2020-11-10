---
title: Cocos2d JSC解密
draft: false
tags: [JS, c++, cocos, spidermonkey]
category: AI
date: '2020-10-22T22:55:32Z'
---



jsc反编译工具编写探索之路 https://zhuanlan.zhihu.com/p/42403161

cocos2d游戏jsc文件格式解密，SpideMonkey大冒险 https://www.cnblogs.com/protosec/p/11625206.html  https://github.com/yeyiqun/cocos2d-jsc-decompiler

照着这个做， 有几个坑：
1. autoconf-2.13， 一定要用2.13版本， ubuntu18.04是高版本， 需要卸载了重装， 或者自己找bin安装
2. ../configure --enable-debug --disable-optimize 报错https://support.mozilla.org/bm/questions/1271793， 需要修改config文件 `The sed expression should be [[:space:]] instead of [:space:]`
3. 然后就可以用decjsc了， 位于`cocos2d-jsc-decompiler/js/src/build-linux/dist/bin`， 默认生成的jsc里面是包含源码的。 decode只能反汇编， 不是反编译，即只能拿到字节码。

cocos creator生成的jsc没法decode， 怀疑是加密了。发现cocos creator build选项里面如果选定`加密脚本`就是jsc， 否则是js， 所以怀疑是加密而不是编译。

密码是在`libcocos2djs.so`中：
```bash
strings libcocos2djs.so | grep [password]
```
`password`可以通过frida hook方式拿到， 我发现字符串是`xxxxxxxx-xxxx-xx`这种模式， 直接找到了。

cocos creator跟cocos2d-x的一些关系： https://www.heqiangfly.com/2020/02/10/cocos-creator-start/

找了一个xxtea解密的脚本https://github.com/xxtea/xxtea-python， 解开！ 解开之后是gzip压缩的， 需要解压，得到js！