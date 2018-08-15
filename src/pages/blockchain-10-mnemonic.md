---
title: 区块链系列十：Mnemonic和Hierarchically Derived Keys
draft: false
tags: [Mnemonic, Hierarchically Derived Keys, HDKeys, Ethereum, BTC, BIP39, BIP32]
category: Blockchain
date: "2018-08-14T07:41:32Z"
---

区块链里面账户就是一对公私钥(public/private key)， 有了private key就有了一切， 丢失了就丢掉了所有的token， 没有密码找回！ 没有密码找回！ 没有密码找回！

为了方便备份， 就有了通过Mnemonics来方便保存记忆private key的BIP39。

<!-- more -->

# BIP39
可以先用这两个在线工具体验一下： https://iancoleman.io/bip39/ , https://ethtools.com/ropsten/wallet/create/ 。
然后阅读[BIP39](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki).

大概思路就是初始化一个随机entropy， 比如128bits，然后加上sha256(128bits)， 取128 / 32 = 4位， 拼接起来， 每11为作为一个数字index， 去wordlist里面对应一个单词。 这个初始的128bits可以作为seed， 根据其他算法生成其他的private/public keys， 比如用[Hierarchically Derived Keys -- BIP32](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki)。

## ENT
有一些工具可以判断系统或者文件的entropy。
* https://unix.stackexchange.com/questions/31779/tool-for-measuring-entropy-quality
* https://wiki.alpinelinux.org/wiki/Entropy_and_randomness
* https://github.com/lsauer/entropy
* http://blog.iopsl.com/calculate-the-entropy-of-a-file-using-ent/
* https://calomel.org/entropy_random_number_generators.html 
* 

## 实现
有各种语言版本的实现， 阅读了[bitcoinjs/bip39](https://github.com/bitcoinjs/bip39)，还算是蛮简单的。

## UTF-8 NFKD
* https://stackoverflow.com/questions/7931204/what-is-normalized-utf-8-all-about
* https://github.com/walling/unorm

## PBKDF2
* https://en.wikipedia.org/wiki/PBKDF2
* https://segmentfault.com/a/1190000004261009
* https://github.com/crypto-browserify/pbkdf2

### Diceware
* https://en.wikipedia.org/wiki/Diceware 
* http://world.std.com/~reinhold/diceware.html

还发现一个[小女儿在家掷骰子来帮别人选密码](http://www.dicewarepasswords.com/)， nb！


# BIP32

https://bitcore.io/api/mnemonic/ 难懂一点。

bitcore的JS实现： https://bitcore.io/api/lib/hd-keys 。


# Ethereum的讨论

* https://github.com/ethereum/EIPs/issues/75
* https://github.com/ethereum/EIPs/issues/76


