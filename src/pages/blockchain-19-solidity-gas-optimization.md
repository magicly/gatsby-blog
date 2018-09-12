---
title: 区块链系列十九：Gas优化
draft: false
tags: [Eth, Ethereum, solidity, gas]
category: Blockchain
date: "2018-09-11T07:20:32Z"
---

优化Gas，节约money！

<!-- more -->

# Gas Price / Gas Limit / Gas Used / Block gas limit
Gas Price是单价， 单位一般是**Gwei(10^9 wei)**。  从https://ethgasstation.info/ 的数据可以得知， 目前一般是4.2Gwei， 平均等待时间30s左右， 如果比较着急， 可以提高gas price， 如果不着急， 可以降低， 慢慢等确认。

Gas Limit是你愿意消耗的最大gas（数量）， 如果没有消耗完会退给你。

Gas Used是实际消耗的， 每一条instruction以及存储数据都需要一定数量的gas， 这些在[黄皮书](https://ethereum.github.io/yellowpaper/paper.pdf)里都有规定。 下面是Stack Overflow上有人给的table：
```js
Operation         Gas           Description

ADD/SUB           3             Arithmetic operation
MUL/DIV           5             Arithmetic operation
ADDMOD/MULMOD     8             Arithmetic operation
AND/OR/XOR        3             Bitwise logic operation
LT/GT/SLT/SGT/EQ  3             Comparison operation
POP               2             Stack operation 
PUSH/DUP/SWAP     3             Stack operation
MLOAD/MSTORE      3             Memory operation
JUMP              8             Unconditional jump
JUMPI             10            Conditional jump
SLOAD             200           Storage operation
SSTORE            5,000/20,000  Storage operation
BALANCE           400           Get balance of an account
CREATE            32,000        Create a new account using CREATE
CALL              25,000        Create a new account using CALL
```
参考：
* https://ethereum.stackexchange.com/questions/28813/how-to-write-an-optimized-gas-cost-smart-contract
* https://ethereum.stackexchange.com/questions/11474/is-there-a-table-of-evm-instructions-and-their-gas-costs

`Total cost = gasUsed * gasPrice`， 即总花费等于单价乘以数量！ 如果Total cost大于了Gas Limit， 会抛异常`out of gas`， 钱花了， 但是事儿没办好（tx回滚！）

gasPrice决定了你的tx上链速度（价格越高，miner越有动力挖你）； gasUsed取决于你的contract代码复杂程度， 当然是越简单越好咯。

Block gas limit是一个block能接受的最大gas！ 为什么要设置个block gas limit呢？ 不然的话， miner就一直等着， 搜集很多tx才打包一次block， 出block速度就会很慢。

>  Similar to the maximum block size in Bitcoin (measured in bytes), its purpose is to keep block propagation and processing time low, thereby allowing for a sufficiently decentralized network. In contrast to Bitcoin, it is however not a constant. Instead, miners have the option to increase or decrease it every block by a certain factor. 

* https://ethereum.stackexchange.com/questions/7359/are-gas-limit-in-transaction-and-block-gas-limit-different
* https://hudsonjameson.com/2017-06-27-accounts-transactions-gas-ethereum/
* https://github.com/ethereum/wiki/wiki/Design-Rationale#gas-and-fees
* https://bitcoin.stackexchange.com/questions/39132/what-is-gas-limit-in-ethereum
* https://medium.com/@piyopiyo/how-to-get-ethereum-block-gas-limit-eba2c8f32ce

注意， block gas limit是可以调整的， 目前Mainnet上是8M， 而Ropsten上是默认值4.7M(4712388)，所以测试的时候要小心， 有可能Ropsten上没问题， 上了Mainnet就有问题了。  可以用Ganache修改block gas limit来测试。

# Optimization
* https://medium.com/coinmonks/optimizing-your-solidity-contracts-gas-usage-9d65334db6c7
* https://labs.imaginea.com/post/contract-code-optimization/


对于**"freed" storage**的操作， 还有refund。
* https://stackoverflow.com/questions/51804756/does-solidity-optimize-gas-usage-based-on-total-storage-used-before-and-after-a/51804778
* https://ethereum.stackexchange.com/questions/32419/is-refunded-gas-for-freed-storage-given-to-the-contract-the-allocator-or-t

https://medium.com/joyso/solidity-save-gas-in-smart-contract-3d9f20626ea4 中有两个table， 列出了每一个指令的gas。 作者的文章有很多关于gas优化的（因为他们在做交易所https://joyso.io/ ）， 比如函数名居然会影响gas？！！！
* https://medium.com/joyso/solidity-智能合約函式名稱對gas消耗的影響-63e17b89153a


https://ethereum.stackexchange.com/questions/28813/how-to-write-an-optimized-gas-cost-smart-contract 里面列了几条：
* 去除unused code
* 少用expensive操作， 可以合理利用&& / ||的Short Circuiting特性
* 合并loop等
* 用Fixed-size bytes
* **Not using libraries when implementing the functionality is cheaper for simple usages. 是因为DELEGATECALL要贵一些？**
* 开启编译器优化
* inline assembly会更低一些， 可以在loop里考虑

https://solidity.readthedocs.io/en/latest/miscellaneous.html#internals-the-optimizer 讲了一些solidity自己的优化。

https://vomtom.at/what-exactly-is-the-gas-limit-and-the-gas-price-in-ethereum/ 这篇文章也讲得比较详细。

居然有paper研究gas优化： [Under-Optimized Smart Contracts Devour Your Money](https://arxiv.org/pdf/1703.03994.pdf)

这里有一个具体的优化案例： https://www.horizon-globex.com/a-cure-for-gas-optimising-an-ethereum-contract/ 。

另外推荐一下 [ConsenSys写的Best Practices](https://github.com/ConsenSys/smart-contract-best-practices)， 涉及很多contract开发的最佳实践， 包括安全等。