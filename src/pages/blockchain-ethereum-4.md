---
title: 区块链系列八：Solidity in Depth
draft: true
tags: [Ethereum, 以太坊, Solidity]
category: Blockchain
date: "2018-04-12T07:51:32Z"
---

[Solidity in Depth](https://solidity.readthedocs.io/en/develop/solidity-in-depth.html)学习笔记。

<!-- more -->

# Solidity Source File结构
## 编译器版本号
文章最开头指定编译器版本号：
```js
pragma solidity ^0.4.0;
```
`^0.4.0`表示可以用`0.4.0`到`0.5.0`之间的编译器编译通过。 版本号规则参考[npm](https://docs.npmjs.com/misc/semver)。

## import其他文件
跟ES6的模块import很像：
```js
import "filename";

import * as symbolName from "filename";

import {symbol1 as alias, symbol2} from "filename";

import "filename" as symbolName;

import "github.com/ethereum/dapp-bin/library/iterable_mapping.sol" as it_mapping;
```
`solc`命令行选项可以指定path的映射规则， 需要的时候参考文档。

## 注释
跟JS类似，`//`和`/* ... */`。 额外增加了一个`///`或者`/** ... */`， 在里面可以用[Doxygen](https://en.wikipedia.org/wiki/Doxygen)标签写文档， 然后通过工具自动生成API文档， 类似于[JSDoc](http://usejsdoc.org/)和[javadoc](https://docs.oracle.com/javase/8/docs/technotes/tools/windows/javadoc.html)。

# contract结构
contract类似于OOP里面的class， 包含状态变量、函数声明、函数修饰符、Events、结构类型、枚举类型等。

**State Variables**是永久存储在contract storage里面的数据。

**Functions**就是代码， **Function Modifiers**类似于宏， 会在编译的时候插进函数代码。

**Events**用来通知客户端， 包括钱包， Web3.js等监听器。

**Struct Types**， 结构类型， 跟其他语言的struct里面差不多， JS里面类似object。

**Enum Types**， 枚举类型。

```js
pragma solidity ^0.4.0;

contract SimpleStorage {
    struct Voter { // Struct
        uint weight;
        bool voted;
        address delegate;
        uint vote;
    }

    enum State { Created, Locked, Inactive } // Enum

    address public seller;
    uint storedData; // State variable

    event HighestBidIncreased(address bidder, uint amount); // Event

    function bid() public payable { // Function
        // ...
        emit HighestBidIncreased(msg.sender, msg.value); // Triggering event
    }

    modifier onlySeller() { // Modifier
        require(msg.sender == seller);
        _;
    }

    function abort() public onlySeller { // Modifier usage
        // ...
    }
}
```






# 参考资料
* https://solidity.readthedocs.io/en/develop/solidity-in-depth.html