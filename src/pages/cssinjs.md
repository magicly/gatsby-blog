---
title: CSS In JS
draft: false
tags: [css, js, react]
category: FE
date: "2017-08-29T13:15:42Z"
---

自从2014年Christopher Chedeau做了[CSS in JS](http://blog.vjeux.com/2014/javascript/react-css-in-js-nationjs.html)的演讲之后， cssinjs的各种库纷纷出现，已经[有好几十种了](https://github.com/MicheleBertoli/css-in-js)。

[css modules][css modules]应该是很流行的了， 说实话我没有用过， 不过在浏览作者主页的时候意外发现了[styled-components][sc]，发现这就是我想要的！大家可以看看下面几个视频，先有个大概印象。

<!-- more -->

[styled-components][sc]作者[Max Stoiber][mxstbr]在2017年React大会上的演讲：
<iframe width="560" height="315" src="https://www.youtube.com/embed/2j9rSur_mnk" frameborder="0" allowfullscreen></iframe>

[css modules][css modules]作者[@glenmaddern][glen]在2017年欧洲CSS大会上分享[styled-components][sc]。
<iframe width="560" height="315" src="https://www.youtube.com/embed/MT4D_DioYC8" frameborder="0" allowfullscreen></iframe>

[css modules][css modules]作者[@glenmaddern][glen]分享[styled-components][sc]， 玩得很high啊。
<iframe width="560" height="315" src="https://www.youtube.com/embed/qu4U7lwZTRI" frameborder="0" allowfullscreen></iframe>

想要了解更多[styled-components][sc]， 可以看[React实战课程](https://react-course.magicfun.ai/css/)内容。


这有一篇[Material UI](https://github.com/callemall/material-ui)的一位作者[讲他们如何在各种cssinjs中做的选型](https://github.com/oliviertassinari/a-journey-toward-better-style)，介绍对比了各种cssinjs库的一些特性，大家可以了解一下， 这里是[PPT](https://oliviertassinari.github.io/a-journey-toward-better-style/)。

再提一下[Pete Hunt](https://twitter.com/floydophone)大神的[jsxstyle](https://github.com/smyte/jsxstyle)，之前看的时候还是[1.0刚发布](https://medium.com/smyte/announcing-jsxstyle-1-0-3ef469d1863a)，貌似现在快出2.0了。 大概思路是封装了用于布局的一些components，包括：
* Block
* Flex
* Inline
* InlineBlock
* InlineFlex
* Table
* TableCell
* TableRow
* Row
* Col

不过给我的感觉，有点像用[React Native](https://facebook.github.io/react-native/)来开发web的思想， 比如[react-native-web](https://github.com/necolas/react-native-web)以及淘宝出的[react-web](https://github.com/taobaofed/react-web)，不过都不太符合我的口味。

[Max Stoiber](mxstbr)最近又发布了一个新的库[polished](https://github.com/styled-components/polished)，大概看了一下，也很符合我的口味，利用currying function去组合各种基本样式， 后面有时间再研究一下。阮老师已经写了[一篇文章介绍](http://www.ruanyifeng.com/blog/2017/04/css_in_js.html)啦。

[sc]: https://github.com/styled-components/styled-components
[css modules]: https://github.com/css-modules/css-modules
[mxstbr]: https://twitter.com/mxstbr
[glen]: https://twitter.com/glenmaddern