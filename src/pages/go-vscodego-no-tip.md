---
title: VSCode go插件代码提示失效
draft: false
tags: [vscode, go, gocode]
category: Go
date: "2018-03-22T11:15:42Z"
---

最近用Go写代码，在VSCode下安装了vscodego插件， 语法高亮、代码提示、代码跳转、错误提示等都支持， 完美！

不知道哪天突然发现没有代码提示了， 只有提示"PANIC"。。。。。

经过google， 发现代码提示用的是[gocode](https://github.com/nsf/gocode)，也[有人遇到过](https://tonybai.com/2016/12/23/write-go-code-in-vscode/)，手动重启gocode即可。
```bash
gocode close
gocode -s
```
执行之后还是不行， 有报错：
```bash
panic: unknown export format version 5 ("version 5")
```
拿去google， 找到gocode里的[issues](https://github.com/nsf/gocode/issues/456)， 提示说可以升级gocode：
````bash
go get -u -v github.com/nsf/gocode
```
再重启， 一起ok了！

PS， 发现升级之后其实vscode在遇到go代码并且你需要代码提示（按了.）的时候如果没有检测到gocode daemon进程，会自动帮你启动gocode的。会启动一个进程监听`127.0.0.1:37373`端口。
