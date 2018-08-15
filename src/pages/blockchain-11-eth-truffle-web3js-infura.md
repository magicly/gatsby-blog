---
title: 区块链系列十一：Truffle/Web3.js/infura开发eth
draft: false
tags: [Ethereum, 以太坊, trufle, web3.js, infura]
category: Blockchain
date: "2018-08-14T19:51:32Z"
---

[Truffle](https://truffleframework.com/)框架很好用， [web3.js](https://github.com/ethereum/web3.js)让你可以在js里很方便的通过[JSON-RPC](https://github.com/ethereum/wiki/wiki/JSON-RPC)跟调用[eth client](http://www.ethdocs.org/en/latest/ethereum-clients/index.html)的功能， [infura](https://infura.io/)可以让你不用自己搭建client。  eth同步是一个很痛苦的事情！

<!-- more -->

# Truffle
truffle很不错的框架， 很多项目都在用， 包括[OpenZeppelin](https://github.com/OpenZeppelin/openzeppelin-solidity)。  ps， 据说[Embark](https://embark.status.im/)也很不错， 有机会试一下。

提供了compile, test, deploy等， 还提供了一个client， 方便开发测试。 建议把docs和tutorials都阅读一下。

# infura
[infura](https://infura.io/)提供了一套client， 可以不用自己部署ETH client了。

truffle跟infura结合使用， 可以参考https://truffleframework.com/tutorials/using-infura-custom-provider 。

# web3.js

https://github.com/ethereum/web3.js 简化了js通过JSON-RPC调用eth client的过程， 注意目前是1.0 beta， 跟truffle用的0.2接口不一致。

# web3的其他语言实现

## java
* https://github.com/web3j/web3j
* https://www.jianshu.com/p/ae80a869366e

## C#
https://github.com/Nethereum/Nethereum

当然你也可以完全自己封装一下json-rpc即可。

# 一些问题
如果把Ganache重启了可能遇到问题：
```js
the tx doesn't have the correct nonce
```
原因是eth里每个账号都有递增的nonce， 来保证tx的唯一性。 metamask记住之前发过的tx， 而Ganache重启后， 全部重来， nonce对不上。 可以把[MetaMask重置一下](https://stackoverflow.com/questions/45585735/testrpc-ganache-the-tx-doesnt-have-the-correct-nonce)。

# 一些工具
* https://etherscan.io/
* https://ethgasstation.info/
* https://faucet.metamask.io/
* https://www.ethernodes.org/network/1
* 
* 

