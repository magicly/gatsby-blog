---
title: 区块链系列五：Ethereum学习笔记
draft: false
tags: [BTC, 密码学, crytography ]
category: Blockchain
date: "2018-04-06T08:51:32Z"
---

Ethereum的一些笔记。

<!-- more -->


# 账号管理
externally owned accounts (EOAs) and contract accounts

# Contracts and Transactions
This execution needs to be completely deterministic, its only context is the position of the block on the blockchain and all data available. 

## Gas
Clearly Ethereum is not about optimising efficiency of computation. Its parallel processing is redundantly parallel.

The fact that contract executions are redundantly replicated across nodes, naturally makes them expensive, which generally creates an incentive not to use the blockchain for computation that can be done offchain.

## Estimating transaction costs 
`Total cost = gasUsed * gasPrice`

Contracts generally serve four purposes:
* Maintain a data store
* “forwarding contract”
* Manage an ongoing contract or relationship between multiple users.
* serving as a software library.

# Dapps
Remember that because of the redundant nature of computation on the Ethereum network, the gas costs of execution will always be higher than private execution offchain. This incentivizes dapp developers to restrict the amount of code they execute and amount of data they store on the blockchain.

* Dapp directories
* Dapp browsers
* IDE / frameworks
* console
* Whisper
* Swarm
* RANDAO
* ...
* EVM

# 开发工具
* [Solidity](https://solidity.readthedocs.io/)
* [Web3.js](https://github.com/ethereum/web3.js/)
* [Truffle](https://github.com/trufflesuite/truffle)
* [OpenZeppelin](https://github.com/OpenZeppelin/zeppelin-solidity)
* [Remix IDE](https://remix.readthedocs.io/en/latest/)
* [VSCode solidity](https://github.com/juanfranblanco/vscode-solidity)
* [Oraclize](http://www.oraclize.it/)
* [PageSigner](https://tlsnotary.org/pagesigner.html)

# 其他
* [IPFS](https://ipfs.io/)
* [Parity](https://github.com/paritytech/parity)
* [Quorum](https://github.com/jpmorganchase/quorum)