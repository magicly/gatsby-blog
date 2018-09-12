---
title: 区块链系列十八：solidity的一些问题（续）
draft: false
tags: [Eth, Ethereum, solidity]
category: Blockchain
date: "2018-09-10T07:20:32Z"
---

最近开发solidity遇到的一些问题。

<!-- more -->

# 合约如何接受eth
contract中function被payable修饰， 则可以接受eth， solidity中可以通过msg.value获得transfer的eth。

每个contract有一个匿名函数，如果调用合约找不到匹配的函数， 就会调用此函数， 设置为payable即可接受eth。 注意， solidity每个版本的文档都有点不一样， 建议参考对应或者最新版本的文档。

* https://solidity.readthedocs.io/en/v0.4.24/contracts.html#fallback-function
* https://solidity.readthedocs.io/en/develop/contracts.html#fallback-function


# 能否由contract支付gas
额， 目前而言还不能， 估计等到SERENITY可以吧。 当然， 目前也可以通过refund方式， 由调用者支付了gas， contract里面再退给调用者eth或者等价的token吧。

* https://ethereum.stackexchange.com/questions/12860/self-paying-contract

`tx.gasprice`可以获取到gasprice， 而消耗的gas数量， 可以提前预估出来（remix中把鼠标放在某个函数前，右上角就有Execution cost）， 当然预估不一定完全准确，比如如果有动态分配内存或者访问数组之类的， 可能就不准。

* https://solidity.readthedocs.io/en/develop/units-and-global-variables.html#block-and-transaction-properties

# 如果contract再调用contract， 第二次调用的gas谁出？
最开始的调用者， 即`tx.origin`! 

* https://ethereum.stackexchange.com/questions/1452/who-pays-gas-when-a-contract-function-that-creates-calls-another-contract-is-cal

# 如果contract再调用contract， 第二个contract里的msg.sender是谁
`msg.sender`是前一个合约， `tx.origin`是最开始的发起方。

* https://ethereum.stackexchange.com/questions/28972/who-is-msg-sender-when-calling-a-contract-from-a-contract
* https://stackoverflow.com/questions/48562483/solidity-basics-what-msg-sender-stands-for
* https://ethereum.stackexchange.com/questions/21029/difference-between-msg-owner-and-msg-sender
* https://solidity.readthedocs.io/en/develop/units-and-global-variables.html#block-and-transaction-properties

`tx.origin`有些问题， 建议不要使用： https://github.com/ethereum/solidity/issues/683 。