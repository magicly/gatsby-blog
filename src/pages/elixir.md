---
title: Elixir/Erlang
draft: false
tags: [Elixir, Erlang, OTP, BEAM]
category: Prog
date: "2018-11-10T15:22:42Z"
---

最近在学习 Elixir， 有很多 Ruby 的特性（作者是 Rails 的核心开发者）， 编译运行在 Erlang/OTP 上， 所以特别适合用于高并发、稳定性要求很高的 server 开发。 Elixir 语言本身也很不错， 函数式， 不可变数据， pattern matching, protocols 等用起来都很舒服。

推荐几个学习资料：

- [elixir-lang.org 官网文档挺好的](https://elixir-lang.org/)
- [Elixir in Action](https://www.theerlangelist.com/)， 我觉得读起来行云流水啊， 有评论说不适合“初学者”， 反正我已经不是初学者了哈哈哈
- [Programming Elixir 1.6 Functional |> Concurrent |> Pragmatic |> Fun](https://pragprog.com/book/elixir16/programming-elixir-1-6)， Dave Thomas 写的， 很多人推荐， 不过我觉得没有 Action 那本好呢。 ps， 网上有 1.6 最新电子版， 自己搜索哈哈。。。
- [Programming Phoenix 1.4](https://pragprog.com/book/phoenix14/programming-phoenix-1-4)， 还未看
- [Metaprogramming Elixir](https://pragprog.com/book/cmelixir/metaprogramming-elixir)， 还未看
- [Introducing Elixir, 2nd Edition](http://shop.oreilly.com/product/0636920030584.do), 还未看
- https://github.com/sger/ElixirBooks
- https://github.com/0xAX/erlang-bookmarks
- [Property-Based Testing with PropEr, Erlang, and Elixir](https://pragprog.com/book/fhproper/property-based-testing-with-proper-erlang-and-elixir), 以前用过 Scala 的 property based testing， 很爽

# Webframework

毫无疑问， https://phoenixframework.org/ ， Elixir 的作者也是 Phoenix 的核心开发， 上面推荐的[Programming Phoenix 1.4](https://pragprog.com/book/phoenix14/programming-phoenix-1-4)，作者就有 Elixir 的作者和 Phoenix 的作者， 所以很值得看的。

# vs Go?

为什么跟[Go](https://golang.org/)对比呢， 因为 go 这两年在国内很火， 有人甚至称为云时代的 C 语言。 go 有很多优点， 比如语言简单， 很容易上手， 编译快速， 跨平台， 打包成一个二进制文件， 运行效率也挺高， goroutine/channel， 统一的格式 blabla。。。别误会， 我也挺喜欢 go。 不过说实话， go 语言本身的设计，比较不那么“现代化”，比如没有泛型，没有 macro 等， 也被很多人吐槽。 不过没有任何语言是完美的， 大家也越来越接受每种语言都有自己的定位和设计原则， 比如 go 很强调工程化， 什么是工程化呢？

> Software engineering is what happens to programming when you add time and other programmers. -— Russ Cox

说白了，就是很多人的时候大家还能一起把程序写好， 像 Google 这种级别的公司， 有几万工程师， 代码据说几十亿行， 没有统一的规范， 没有快速编译， 语言不够简单， 大家怎么可能把事情做好呢。 这个方面， Go 是很不错的选择。

不过， 我现在既不需要掌握一门“主流语言”去找工作， 也不打算带一个很大的团队， 所以不需要去迎合所谓的主流。 我理想的团队是像 37signals 这样的公司， 很小的团队， 作出很 nb 的事情。 这个视频很有意思， https://www.youtube.com/watch?v=blGJ_p4plbc ，作者说他们当时选择 Elixir 不是因为高并发、稳定等等， 而是为了招人， 故意用一门特别小众有意思的语言， 招到很靠谱的人， 组成一个小团队。

另外， 建议大家学那些跟自己已经掌握的知识差异最大化的东西， 这样能大大开阔自己的视野， 即使工作中用不到， 也是很有好处的。

生命苦短， 学你觉得有意思好玩的就行。
