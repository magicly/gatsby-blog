---
title: 区块链系列十三：sign & verify
draft: false
tags: [Ethereum, 以太坊, 签名]
category: Blockchain
date: "2018-08-16T07:21:32Z"
---

要在eth链上验证一个签名， 可以用solidity内置的`ecrecover`函数， 但是。。。。

<!-- more -->

# ecrecover
可以先用这两个工具试一下：
* https://etherscan.io/verifySig
* https://www.myetherwallet.com/signmsg.html

myetherwallet这个我感觉有点问题， 对于带`0x`的message签名出来跟我调用`web3.eth.sign`或者etherscan的签名不一样， 估计是把`0x`开头的消息特殊处理了。


签名可以直接通过web3.js的`web3.eth.sign`去签名， 实际上还是走的`eth client`的签名。 然而要验证签名， 居然eth client没有提供这个功能， 网上教程全是部署一个合约， 然后用solidity的`ecrecover`去验证的， 感觉好奇怪。 

## 几个坑
### r/s/v的获取
根据[官方文档](https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethsign)说法， 签名出来表示成hex是`0x...`， 如果把`0x`一起算上总长度是130哦，最好理解的是如下：
```js
// https://ethereum.stackexchange.com/questions/15364/ecrecover-from-geth-and-web3-eth-sign
    var h = web3.sha3(msg)
    var sig = web3.eth.sign(address, h).slice(2)
    var r = `0x${sig.slice(0, 64)}`
    var s = `0x${sig.slice(64, 128)}`
    var v = web3.toDecimal(sig.slice(128, 130)) + 27
```
注意， v要加27哦， [web3.js里的example](https://github.com/ethereum/web3.js/blob/develop/example/signature-verifier.js#L119-L124)就没有添加， 而且注意那段代码里的sig是含`0x`的， 所以长度是132！！！
```js
function splitSig(sig) {
  return {
    v: ethWeb3.toDecimal('0x' + sig.slice(130, 132)),
    r: sig.slice(0, 66),
    s: sig.slice(66, 130)
  }

}
```
因为sig含了`0x`， 所以r取`sig.slice(0, 66)`已经有了`0x`， 而s还没有， 所以在[114行](https://github.com/ethereum/web3.js/blob/develop/example/signature-verifier.js#L114)， 加了`0x`， 导致代码很难读：
```js
 var finalAddress=sigContractInstance.verify.call(strPrefixedMsg, res.v, res.r, '0x'+ res.s);
```
### 自定义前缀
为了避免[arbitrary payloads](https://github.com/ethereum/go-ethereum/issues/3731)的问题， eth里的签名添加了`\x19Ethereum Signed Message:\n<length of message>`前缀， 所以要用`ecrecover`去verify的时候， 也要加上！

# 不用eecrecover
如果我只是要验证签名（不需要在链上验证）， 完全没有理由说我还要部署一个smart contract去做这个事情啊。

bitcoin和eth都用的是ECC(elliptic curve cryptography)， eth用的是secp256k1， 这个是有标准的， 理论上而言， 你用任何语言都可以实现（实际上也是有各种语言版本的开源代码啦）。

至于为什么都用ECC而不是常见的RSA呢， 简单来说， 同样的安全强度， ECC有更短的private key和更快的速度。

后面专门写一篇介绍ECC。



# Refs
* https://medium.com/@angellopozo/ethereum-signing-and-validating-13a2d7cb0ee3
* https://github.com/ethereum/go-ethereum/issues/3731
* https://gist.github.com/bas-vk/d46d83da2b2b4721efb0907aecdb7ebd
* https://medium.com/taipei-ethereum-meetup/%E7%94%A8ecrecover%E4%BE%86%E9%A9%97%E7%B0%BD%E5%90%8D-694fa8ae3638
* https://ethereum.stackexchange.com/questions/15364/ecrecover-from-geth-and-web3-eth-sign
* http://me.tryblockchain.org/web3js-sign-ecrecover-decode.html
* http://me.tryblockchain.org/web3js-sign-ecrecover-decode.html
