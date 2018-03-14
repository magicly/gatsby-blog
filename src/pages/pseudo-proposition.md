---
title: 为什么说“XXX是个伪命题”是个伪命题？
draft: false
tags: [伪命题, 逻辑]
category: Others
date: "2018-03-14T14:37:42Z"
---

已经太多次听到这样的言论：“XXXX是个伪命题”， 也太多次看到这样的标题：“为什么说XXX是个伪命题？”。 绝大多数时候使用者其实都没明白“伪命题”一词的含义， 一部分是把它跟“假命题”混淆了， 一部分人纯粹就是为了装13。

每次听到这样的话， 我都起一身鸡皮疙瘩。最近区块链火的不行，到处都能看到相关文章，似乎一夜之间很多人都成了区块链专家。今天看到一篇，“区块链是个伪命题”， 还有一篇“为什么说区块链的去中心化是个伪命题？”。大哥， 你这就好比说，“鸡蛋是个伪命题”， “为什么说鸡蛋的蛋壳是个伪命题”一样， 听了自己不会觉得奇怪的么？

<!-- more -->

在我印象中， “伪命题”表示的是“没办法证伪的命题”， 英文是pseudo proposition。 而命题是一个陈述句，用于说明某种事实，如果这事实为真，则叫真命题(True proposition)，如果为假，则为假命题(False proposition)。比如“5 > 3”是真命题，"3 > 5"则是一个假命题。而如果说"X > 5"，因为你不知道X到底是啥，所以这个命题既有可能是真， 也有可能是假，没办法判断，所以是“伪命题”。 所以我们说一个东西是“伪命题”，至少得这个东西是一个完整的陈述句啊！“区块链”是一句陈述句么？“鸡蛋的颜色”是一句陈述句么？

上面只是我的想法，为了严谨， 我还是查一下资料吧。发现知乎上早就已经有人受不了，问过[「伪命题」一词是否被滥用了？](https://www.zhihu.com/question/20105937)，我比较赞同下面这条回答：

<div style="background-color:yellow; color: #8590a6">
离散数学经典教材<a href="https://book.douban.com/subject/1786209/">Discrete Mathematics and Its Applications</a>开篇第一章就对命题做出的如下的定义：

> A proposition is a declarative sentence (that is, a sentence that declares a fact) that is either true or false, but not both.

翻译过来就是：命题是一个非真即假的陈述语句，但绝不可能即真又假.

然后又举了4个不是命题（也就是伪命题）的例子：

> 1. What time is it?
> 2. Read this carefully.
> 3. x + 1 = 2.
> 4. x + y = z.

原因如下：
> 1,2明显不是陈述语句。3,4因为它们既不是真的，也不是假的，也就是说我们无法判断

作者：张斌斌
链接：https://www.zhihu.com/question/20105937/answer/26284295
来源：知乎
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
</div>

在wiki上搜了一下， 没有查到“伪命题”，只查到[Proposition](https://en.wikipedia.org/wiki/Proposition)：

> Often propositions are related to closed sentences to distinguish them from what is expressed by an open sentence. In this sense, propositions are "statements" that are truth-bearers. This conception of a proposition was supported by the philosophical school of logical positivism.

也就是说，“命题”得是一句关于事实判断的完整的陈述句。

百度百科的关于[伪命题](https://baike.baidu.com/item/%E4%BC%AA%E5%91%BD%E9%A2%98/7507754)的解释：
<div style="background-color:yellow; color: #8590a6">

> 伪命题是指不真实的命题。所谓不真实，有两种情况：其一是不符合客观事实；其二是不符合一般事理和科学道理。 另一种解释是指没有意义的命题，无法断定其真假，既不是先天的分析命题，也不是可以通过经验判断的综合命题。比如，“团结比原子弹还厉害”，”凡事都有例外”这类命题就属于伪命题。

> 外文名 False proposition
</div>
可以看到，这里百度百科把“伪命题”当做是“假命题(False proposition)”，然后又包含了“无法断定其真假”的那部分。

ok， 现在我们来看一下为什么说`“XXX是个伪命题”是个伪命题`。首先这句话的主语是“XXX是个伪命题”，这是一个完整的陈述句，但是它是命题么？不是！为啥，因为我们不知道`XXX`是什么，所以这句话既有可能是真，也有可能是假。比如，`XXX是"3 > 2"`, 则“3 > 2是个伪命题”就是错的，即是“假命题False proposition”，如果`XXX是x > 2`， 则“x > 2是个伪命题”，就是对的，即是“真命题True proposition”。所以“XXX是个伪命题”，我们既不能判断是真，也不能判断是假，所以是个伪命题。也就是说`“XXX是个伪命题”是个伪命题`，这句话本身是一个真命题！

另外，我们可以看出，由于“伪”在中文里本身有“假”的意思，所以很多人将“伪命题”当成是“假命题”来用，这个我还尚可理解。但即使是这样，我们在说某个东西是“假命题”的时候， 前提也得是这个东西本身是个“命题”或者至少是个完整的陈述句啊。比如某人想说区块链的去中心化不是很NB， 可以说“区块链的去中心化很NB，这是个假命题”。或者你把“伪命题”当“假命题”用，说“区块链的去中心化很NB，这是个伪命题”，那也能勉强接受， 但不能说“区块链的去中心化是个假命题”，或者说“区块链的去中心化是个伪命题”啊。 甚至直接说“区块链是个伪命题”， 这是个啥意思嘛？


简单来说，命题就好比是布尔类型，只能是True或False，你非得要把数字或字符串赋值给布尔类型， 那我们只能说不好意思，我们不支持自动类型转化， 编译失败！

另外可参考下面的资料：
* [可证伪性](https://zh.wikipedia.org/wiki/%E5%8F%AF%E8%AF%81%E4%BC%AA%E6%80%A7)
* [伪科学](https://zh.wikipedia.org/wiki/%E4%BC%AA%E7%A7%91%E5%AD%A6)