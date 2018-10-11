---
title: 区块链系列二十二：在浏览器中开发Eth
draft: false
tags: [Eth, Ethereum, js]
category: Blockchain
date: "2018-10-11T07:20:32Z"
---

在浏览器中开发Eth用到的一些工具和库。

<!-- more -->

# EthereumJS
各方面的工具库都比较全面， 虽然star数较少， 不过看上去相对比较靠谱。 著名的[MetaMask](https://github.com/MetaMask/metamask-extension)和[ConsenSys](https://github.com/ConsenSys)下的很多工具都有用到EthereumJS下的库。

* https://github.com/ethereumjs/ethereumjs-wallet
用于产生privateKey， 导出成Eth V3类型的keystore文件等。

* https://github.com/ethereumjs/ethereumjs-tx
可以在本地sign tx， 这样就可以用[infura](https://infura.io/)操作eth链上数据了。 注意， [Eth JSON-RPC中的eth-sign](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_sign)并不能在infura上使用， 因为eth-sign其实是eth的client（比如geth）帮你管理的privateKey， 你不可能让infura管你的privateKey吧。

* https://github.com/ethereumjs/ethereumjs-util 工具库


# MetaMask
[MetaMask](https://metamask.io/)作为很方便的浏览器插件， [旗下](https://github.com/MetaMask)有很多项目可以参考。

# ConsenSys
[ConsenSys](https://github.com/ConsenSys)也有一些Javascript的项目可以参考， 然后可以从`package.json`文件里看到它所依赖的项目， 进而找到一些比较靠谱的工具库。

* https://github.com/ConsenSys/eth-signer 用于签名
* https://github.com/ConsenSys/eth-lightwallet 钱包

# EthJS
[EthJS](https://github.com/ethjs)也有很多eth js工具， MetaMask和ConsenSys都有用到。

# How to use sendRawTransaction
* https://ethereum.stackexchange.com/questions/26770/how-to-use-sendrawtransaction-properly
```js
var Tx = require('ethereumjs-tx');
var privateKey = new Buffer('e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109','hex')
var rawTx = {
  nonce: '0x00',
  gasPrice: '0x09184e72a000', 
  gasLimit: '0x2710',
  to: '0x0000000000000000000000000000000000000000', 
  value: '0x00', 
  data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057'
}
var tx = new Tx(rawTx);
tx.sign(privateKey);
var serializedTx = tx.serialize();
//console.log(serializedTx.toString('hex'));
//0xf889808609184e72a00082271094000000000000000000000000000000000000000080a47f74657374320000000000000000000000000000000000000000000000000000006000571ca08a8bbf888cfa37bbf0bb965423625641fc956967b81d12e23709cead01446075a01ce999b56a8a88504be365442ea61239198e23d1fce7d00fcfc5cd3b44b7215f
web3.eth.sendRawTransaction(serializedTx.toString('hex'), function(err, hash) {
  if (!err)
    console.log(hash); // "0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385"
});
```
注意， 自己签名Tx的话， 一定要保证nonce是对的， 可以通过[eth_getTransactionCount](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_gettransactioncount)获取到。

data的编码方式需要参考[ABI spec](https://solidity.readthedocs.io/en/develop/abi-spec.html)， 函数的hash用得是keccak256， 可以用这个[Keccak-256在线工具](http://emn178.github.io/online-tools/keccak_256.html)。

# 其他工具
* https://github.com/ethers-io/ethers.js/ 看样子更新还比较勤
* https://github.com/bitcoinjs/bip39 ， 虽然是bitcoin， 但是Mnemonic和HD都是一样的。
* https://github.com/ricmoo/scrypt-js
* https://github.com/MikeMcl/bignumber.js/ 和 https://github.com/indutny/bn.js/ 有些工具两个库都用了， 感觉有点重复啊？
* https://github.com/brix/crypto-js
* https://github.com/feross/buffer
* https://github.com/feross/safe-buffer
* https://github.com/neocotic/qrious
* https://github.com/cozmo/jsQR