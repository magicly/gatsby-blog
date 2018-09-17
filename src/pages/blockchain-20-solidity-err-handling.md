---
title: 区块链系列二十：错误处理
draft: false
tags: [Eth, Ethereum, solidity, revert, require, assert]
category: Blockchain
date: "2018-09-17T19:20:32Z"
---

优雅处理错误， 节省gas！

<!-- more -->
EVM里遇到错误会抛异常， 回滚所有修改。

# 不要用throw
以前用`throw`， 现在已经deprecated了， throw会烧光所有gas！
```js
From version 0.4.13 the throw keyword is deprecated and will be phased out in the future.
```

```js
if(msg.sender != owner) { throw; }
```
现在可以改成
```js
if(msg.sender != owner) { revert(); }

assert(msg.sender == owner);

require(msg.sender == owner);
```

# require/revert vs assert

`require`主要用于检查inputs，判断调用外部contracts的返回值等。 revert跟require语义一致， 可以自己用if/else处理更复杂的情况， 一般而言require足够了。 

`assert`表示断言， 一般用于内部检查， 表示绝对不可能（不管input是啥）都不可能发生的事情， 如果发生，肯定是重大bug！

```js
The convenience functions assert and require can be used to check for conditions and throw an exception if the condition is not met. The assert function should only be used to test for internal errors, and to check invariants. The require function should be used to ensure valid conditions, such as inputs, or contract state variables are met, or to validate return values from calls to external contracts. If used properly, analysis tools can evaluate your contract to identify the conditions and function calls which will reach a failing assert. Properly functioning code should never reach a failing assert statement; if this happens there is a bug in your contract which you should fix.
```

require失败抛异常， 剩下的gas会退给caller。
```js
Note that assert-style exceptions consume all gas available to the call, while require-style exceptions will not consume any gas starting from the Metropolis release.
```

感觉assert只是方便static analysis和formal verification等用的。

[openzeppelin中的SafeMath从assert改为require了](https://github.com/OpenZeppelin/openzeppelin-solidity/issues/1120)。

# Conclusion
尽量用require， 不要用assert！


* https://solidity.readthedocs.io/en/develop/control-structures.html#error-handling-assert-require-revert-and-exceptions
* https://medium.com/blockchannel/the-use-of-revert-assert-and-require-in-solidity-and-the-new-revert-opcode-in-the-evm-1a3a7990e06e
* https://ethereum.stackexchange.com/questions/15166/difference-between-require-and-assert-and-the-difference-between-revert-and-thro