---
title: 区块链系列十七：solidity的一些问题
draft: false
tags: [Eth, Ethereum, solidity]
category: Blockchain
date: "2018-09-05T07:20:32Z"
---

最近开发solidity遇到的一些问题。

<!-- more -->

# 如何调试Solidity
最基本的调试是用打印输出， 然而solidity不支持， 可以用Event。
* https://ethereum.stackexchange.com/questions/7139/whats-the-solidity-statement-to-print-data-to-the-console
* https://ethereum.stackexchange.com/questions/22912/debugging-ethereum-contract-by-printing-the-values
* https://www.cnblogs.com/huahuayu/p/8593774.html
* http://me.tryblockchain.org/blockchain-solidity-event.html

注意， Event中string indexed有问题： https://ethereum.stackexchange.com/questions/6840/indexed-event-with-string-not-getting-logged 。

当然， 为了调试而用Event还是不方便，Event更多地是为了通知“客户端”（调用合约方法者）有一些事情发生。 调用方可以监听Event。 

另外如果用[Trufle](https://truffleframework.com/)的话， 其支持debug：
* https://truffleframework.com/tutorials/debugging-a-smart-contract 
* https://truffleframework.com/tutorials/debugger-variable-inspection

# 获取solidity方法返回值
在外面调用solidity的方法有几种方式(https://zhuanlan.zhihu.com/p/26089385)：
* ins.testFunc.sendTransaction(); 会创建tx， 返回值是tx
* ins.testFunc(); 如果是view/pure调用本地方法， 有返回值， 不消耗gas； 如果没有view/pure会sendTransaction， 返回值是tx
* ins.testFunc.call(); 调用本地方法， 有返回值， 不消耗gas

如果是sendTransaction，返回值是tx， 由于tx上链要有一段时间， 并没有办法获取返回值， 一种方法是通过前面说的Event来实现， 一种是合约里面提供一个查询方法自己去轮询。  另外要查询tx的状态， 可以用https://etherscan.io/apis 。

如果要自己调用`sendTransaction`， 可以按照[JSON RPC](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_sendtransaction)调用，to是合约地址， 也可以用`contract = Contract.at(address); contract.sendTransaction({...})`调用， 就不再需要设置`to`。 其中的data方法需要按照[Eth ABI](https://github.com/ethereum/wiki/wiki/Ethereum-Contract-ABI)设置， 前4个字节是函数签名的hash值， 计算hash可以用http://emn178.github.io/online-tools/keccak_256.html ， 要在JS代码用可以用https://github.com/cryptocoinjs/keccak 。

至于view, constant, 以及pure的区别可以看：
* https://ethereum.stackexchange.com/questions/25200/solidity-what-is-the-difference-between-view-and-constant
* https://solidity.readthedocs.io/en/latest/miscellaneous.html#modifiers

注意， 设置成view/pure还是可以修改状态， 只是会给警告， 能编译通过， 小心！！！

即使是view/pure方法， 用sendTransaction调用， 还是会上链花费gas！！！


# 迭代mapping
solidity中的mapping是不能迭代的， 因为它是假设容纳了所有的key：
```
Mappings can be seen as hash tables which are virtually initialized such that every possible key exists and is mapped to a value whose byte-representation is all zeros: a type’s default value. The similarity ends here, though: The key data is not actually stored in a mapping, only its keccak256 hash used to look up the value.
```
真要在solidity中迭代， 可以多用一个Array把key存起来， 一个好的实现可以参考： https://medium.com/@blockchain101/looping-in-solidity-32c621e05c22 。


# 如何用token支付合约的服务
如果用eth支付的话， 很简单，把方法设置成`payable`， 然后在`msg.value`中可以获取到转账金额， 但是用其他token会比较麻烦， 推荐两篇很好的文章：
* https://medium.com/@jgm.orinoco/ethereum-smart-service-payment-with-tokens-60894a79f75c
* https://medium.com/@jgm.orinoco/understanding-erc-20-token-contracts-a809a7310aa5


# 如何返回struct或者stuct数组
简单说来， 目前还不支持， 可以开启`pragma experimental ABIEncoderV2`， 但是不推荐在production中使用。  返回struct改为返回tuple， 返回struct数组改为分别返回某个属性的数组。
* https://medium.com/coinmonks/solidity-tutorial-returning-structs-from-public-functions-e78e48efb378
* https://ethereum.stackexchange.com/questions/7317/how-can-i-return-struct-when-function-is-called
* https://ethereum.stackexchange.com/questions/3589/how-can-i-return-an-array-of-struct-from-a-function

# string的一些问题
```
  mapping (string => Room) public rooms;
```
会报错:
```
Internal compiler error: Accessors for mapping with dynamically-sized keys not yet implemented
```
要么把string更改为bytes32， 要么把public去掉：
```
  mapping (bytes32 => Room) public rooms;
  mapping (string => Room) rooms;
```

* https://ethereum.stackexchange.com/questions/2397/internal-compiler-error-accessors-for-mapping-with-dynamically-sized-keys-not-y
* https://gist.github.com/axic/ce82bdd1763c04ef8138c2b905985dab

Event中如果要`indexed`的话， 也不能用`string`， 不然会报错：
```js
Error: Number can only safely store up to 53 bits
```
改为`bytes32`即可。
* https://github.com/ethereumjs/ethereumjs-vm/issues/114#issuecomment-312067727
* https://ethereum.stackexchange.com/questions/6840/indexed-event-with-string-not-getting-logged/7170#7170

# struct中包含mapping的问题

struct中的mapping是存储在storage中的， 不算是struct的字段， 构造struct的时候也不用指定mapping类型的字段。

struct中的mapping概念上应该是有个pointer指向当前对象。

```js
pragma solidity ^0.4.24;

contract TestStructMapping {
  MyObject ob;

  struct MyObject {
    uint a;
    mapping(uint8 => uint) map;
  }

  mapping(uint8 => MyObject) public obs;
  uint8 public num;

  event Output(uint number);

  function getObValue() public view returns(uint) {
    return ob.a;
  }

  function getObMap(uint8 index) public view returns(uint) {
    return ob.map[index];
  }

  function makeNew(uint value) public {
    ob = MyObject(value);
    ob.map[0] += 1;
    emit Output(ob.map[0]);
  }

  function makeNew2() public {
    MyObject memory ob2 = MyObject(100);
    obs[num++] = ob2;
    emit Output(ob.map[0]);
  }

  function inc(uint8 objIndex, uint8 index) public returns(uint) {
    MyObject storage obj = obs[objIndex];
    obj.map[index] += 1;
    return obs[objIndex].map[index];
  }

  function getValue(uint8 objIndex, uint8 index) public view returns(uint) {
    return obs[objIndex].map[index];
  }

}
```

可以参考：
* https://ethereum.stackexchange.com/questions/13365/mapping-member-isnt-initialized-when-creating-a-struct
* https://ethereum.stackexchange.com/questions/2385/can-i-save-structs-in-a-mapping
* 

# 估算gas price
现在一般gas price设置成1Gwei， 延迟在30s， 如果设置高一点， 应该更快。数据可以参考： https://ethgasstation.info/ 。