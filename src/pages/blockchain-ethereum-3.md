---
title: 区块链系列七：Solidity学习笔记
draft: false
tags: [Ethereum, 以太坊, Solidity]
category: Blockchain
date: "2018-04-11T07:51:32Z"
---

Solidity学习笔记。

<!-- more -->
# Solidity
It was influenced by C++, Python and JavaScript and is designed to target the Ethereum Virtual Machine (EVM).

statically typed, supports inheritance, libraries and complex user-defined types among other features.

create contracts for voting, crowdfunding, blind auctions, multi-signature wallets and more.

最快速简单的开发环境： [Remix](https://remix.ethereum.org/)

# Introduction to Smart Contracts
```js
pragma solidity ^0.4.0;

contract SimpleStorage {
    uint storedData;

    function set(uint x) public {
        storedData = x;
    }

    function get() public constant returns (uint) {
        return storedData;
    }
}
```
The first line simply tells that the source code is written for Solidity version 0.4.0 or anything newer that does not break functionality (up to, but not including, version 0.5.0). 

A contract in the sense of Solidity is a collection of code (its functions) and data (its state) that resides at a specific address on the Ethereum blockchain. 

uint (unsigned integer of 256 bits)

do not need the prefix this.

All identifiers (contract names, function names and variable names) are restricted to the ASCII character set.

## Subcurrency Example
```js
pragma solidity ^0.4.21;

contract Coin {
    // The keyword "public" makes those variables
    // readable from outside.
    address public minter;
    mapping (address => uint) public balances;

    // Events allow light clients to react on
    // changes efficiently.
    event Sent(address from, address to, uint amount);

    // This is the constructor whose code is
    // run only when the contract is created.
    function Coin() public {
        minter = msg.sender;
    }

    function mint(address receiver, uint amount) public {
        if (msg.sender != minter) return;
        balances[receiver] += amount;
    }

    function send(address receiver, uint amount) public {
        if (balances[msg.sender] < amount) return;
        balances[msg.sender] -= amount;
        balances[receiver] += amount;
        emit Sent(msg.sender, receiver, amount);
    }
}
```

`address public minter;`, address type is a 160-bit value that does not allow any arithmetic operations.

加了public会自动生成一个getter函数，类似：
```js
function minter() returns (address) { return minter; }
``` 
但是不能手写这个函数， 否则编译报错。

`mapping (address => uint) public balances;`, Mappings can be seen as hash tables which are virtually initialized such that every possible key exists and is mapped to a value whose byte-representation is all zeros.  任何没有放进map的key， value都是0值。 所以也没办法遍历mapping的， 如果需要记住key， 自己用array记。 由public生成的getter函数类似如下：
```js
function balances(address _account) public view returns (uint) {
    return balances[_account];
}
```
`event Sent(address from, address to, uint amount);`, As soon as it is emitted, the listener(比如钱包啊， 自己代码加的监听器等) will also receive the arguments from, to and amount, which makes it easy to track transactions.
```js
Coin.Sent().watch({}, '', function(error, result) {
    if (!error) {
        console.log("Coin transfer: " + result.args.amount +
            " coins were sent from " + result.args.from +
            " to " + result.args.to + ".");
        console.log("Balances now:\n" +
            "Sender: " + Coin.balances.call(result.args.from) +
            "Receiver: " + Coin.balances.call(result.args.to));
    }
})
```

`Coin` is the constructor which is run during creation of the contract and cannot be called afterwards.  `msg` (together with `tx` and `block`) is a magic global variable that contains some properties which allow access to the blockchain.

## Blockchain Basics
The reason is that most of the complications (mining, hashing, elliptic-curve cryptography, peer-to-peer networks, etc.) are just there to provide a certain set of features and promises. Once you accept these features as given, you do not have to worry about the underlying technology - or do you have to know how Amazon’s AWS works internally in order to use it?
### Transactions
原子性、持久性、globally accepted。 a transaction is always cryptographically signed by the sender (creator).  防止抵赖

### Blocks
“double-spend attack”

An order of the transactions will be selected for you, the transactions will be bundled into what is called a “block” and then they will be executed and distributed among all participating nodes. If two transactions contradict each other, the one that ends up being second will be rejected and not become part of the block.

Ethereum this is roughly every 17 seconds.

 “order selection mechanism” (which is called “mining”)

## The Ethereum Virtual Machine
not only sandboxed but actually completely isolated, which means that code running inside the EVM has no access to network, filesystem or other processes. Smart contracts even have limited access to other smart contracts.

### Accounts
**External accounts**: 由公钥私钥控制（一般是人）， 地址是public key决定

**contract accounts**: 由里面的code控制， 地址是在contract被创建的时候由创建者的address以及发送过的transactions数量（叫nonce）决定的。

Every account has a persistent key-value store mapping 256-bit words to 256-bit words called storage.

Furthermore, every account has a balance in Ether (in “Wei” to be exact) which can be modified by sending transactions that include Ether.

### Transactions
这里的事务其实就是一个account发送给另一个account的msg， 可以带参数和ether。 如果目标账号包含code（contract account)， code被执行。

如果目标地址是0， 则认为是创建一个新contract， 新contract地址由发送者的地址和已经发送过的transactions数量（nonce）决定。 所带的参数当做EVM的bytecode执行， 返回值作为contract的code存储在blockchain上。
> This means that in order to create a contract, you do not send the actual code of the contract, but in fact code that returns that code when executed.

### Gas
执行transaction的费用， 每条bytecode指令都有对应的gas。 你可以指定**gas price**， 然后最后会花费**gas price * gas used**， 没花完的原路退回， 如果不够， 会报**out-of-gas exception**， 所有操作回滚。

这个设计是为了奖励节点， 同时也能提高DOS攻击成本。

### Storage, Memory and the Stack
每个account都有一个Storage，是永久存储的一个key-value数据库， key和value都是256-bit words。 读和写操作都很贵（花费gas）， 一个contract也只能读写自己的storage。

memory是内存，每次方法调用都会开辟新的空间， 用的内存越多越贵（成平方增长的）。

EVM是stack机， 不是基于寄存器的。

### Instruction Set
为了安全， 指令集设计得比较小。

 All instructions operate on the basic data type, 256-bit words. The usual arithmetic, bit, logical and comparison operations are present. Conditional and unconditional jumps are possible. Furthermore, contracts can access relevant properties of the current block like its number and timestamp.

### Message Calls
contract可以通过消息调用其他contract的代码， 也可以转账（ether）给非contract账户。

Message calls are similar to transactions, in that they have a source, a target, data payload, Ether, gas and return data.

Calls are limited to a depth of 1024, which means that for more complex operations, loops should be preferred over recursive calls.

### Delegatecall / Callcode and Libraries
**delegatecall**是一种特殊的message call， 目标地址的code是在调用方的context下执行的， 即msg.sender & msg.value都是调用方。 实现的效果就是可以在运行时动态加载别的地址的代码， 可以实现"library"的效果。

### Logs
**logs**特性用来实现**events**。 contract访问不了logs， 但logs可以在blockchain之外访问到。 一部分logs用bloom filter存储， 可以高效地检索， 所以“light clinets”可以用到logs。

### Create
Contracts can even create other contracts using a special opcode.

### Self-destruct
调用**selfdestruct**指令可以将contract从blockchain删除。 The remaining Ether stored at that address is sent to a designated target and then the storage and code is removed from the state.

Even if a contract’s code does not contain a call to selfdestruct, it can still perform that operation using delegatecall or callcode.


# Installing the Solidity Compiler
## Remix
最简单快捷的Solidity开发环境， 可以直接访问[Remix在线版](https://remix.ethereum.org)， 或者下载离线使用https://github.com/ethereum/remix-ide。

另外还提供了npm安装（solcjs， 功能不全）， docker安装， 二进制包， 或者源码安装。

推荐使用自己操作系统的包管理工具直接安装二进制包， mac如下：
```bash
brew update
brew upgrade
brew tap ethereum/ethereum
brew install solidity
```

# Solidity by Example
一个投票， 一个竞拍（包括盲拍）， 一个电商的例子。 

# Solidity in Depth
东西比较多， 专门写一篇吧。

# Security Considerations
凡程序必有bug， 哪怕是自己的smart contract是bug-free， 可能compiler或者EVM本身也可能有bug的， 而blockchain往往涉及到很重要的资产， 所以安全问题尤为重要。

一些典型的问题。

## Private Information and Randomness
Using random numbers in smart contracts is quite tricky if you do not want miners to be able to cheat.

## Re-Entrancy
contract A调用contract B或者transfer的时候控制权会转移给B， 而B有可能反过来调用A。下面的代码就有问题：
```js
pragma solidity ^0.4.0;

// 有bug， 勿用！！！
contract Fund {
    mapping(address => uint) shares;
    function withdraw() public {
        if (msg.sender.send(shares[msg.sender]))
            shares[msg.sender] = 0;
    }
}
```
`msg.sender`可能是一个contract， 并且再次调用`withdraw`， 这样就会多次提现。 可以用`Checks-Effects-Interactions`模式来解决， 如下代码：
```js
pragma solidity ^0.4.11;

contract Fund {
    mapping(address => uint) shares;
    function withdraw() public {
        var share = shares[msg.sender];
        shares[msg.sender] = 0;
        msg.sender.transfer(share);
    }
}
```
任何对另一个contract的调用都应该考虑re-entry问题。

## Gas Limit and Loops
慎用Loops，因为很可能烧光gas！！！

## Sending and Receiving Ether
有很多种转账方式， 也有很多原因可能失败。 对于给contract转账， 建议不要失败后直接退还， 而是给其提供withdraw机会。

## Callstack Depth
External function calls can fail any time because they exceed the maximum call stack of 1024.

## tx.origin
不要用`tx.origin`来验证授权！ 假设你的contract如下：
```js
pragma solidity ^0.4.11;

// 有bug， 勿用！！！
contract TxUserWallet {
    address owner;

    function TxUserWallet() public {
        owner = msg.sender;
    }

    function transferTo(address dest, uint amount) public {
        require(tx.origin == owner);
        dest.transfer(amount);
    }
}
```
则下面的contract就会把你ether偷光：
```js
pragma solidity ^0.4.11;

interface TxUserWallet {
    function transferTo(address dest, uint amount) public;
}

contract TxAttackWallet {
    address owner;

    function TxAttackWallet() public {
        owner = msg.sender;
    }

    function() public {
        TxUserWallet(msg.sender).transferTo(owner, msg.sender.balance);
    }
}
```
感觉这块没太明白， 欢迎留言讨论。

## 一些小细节
* `for (var i = 0; i < arrayName.length; i++) { ... }`， 这段代码里i会被推断为`uint8`，所以如果`arrayName.length > 255`， 循环就不会终止了！ 所以应该用`for (uint i = 0; i < arrayName.length; i++) {...}`。
* `constant`关键字目前并没有被compiler和EVM保证， 所以声明为constanct的函数依然可能修改state
* “dirty higher order bits”， 比如用`msg.data`调用`f(uint8 x)`的时候传`0xff000001`和`0x00000001`在函数里都会认为是1， 但是其实`msg.data`是不一样的，所以如果用到`keccak256(msg.data)`结果是不一样的。

## 建议
### 限制智能合约上存储的ether或者其他token数量
这样万一程序有问题（包括contract、compiler、EVM等）， 损失也不会太大。

### 功能单一、模块化！
良好的编码习惯吧！

### Checks-Effects-Interactions模式
1. 先做检查， 包括谁是发送者， 钱够不够， 参数范围合法么。。。
2. 修改当前contract的state variables
3. 调用其他contract

2和3交换会导致之前提到的`re-entrancy`问题。

### Fail-Safe Mode
新手最好预留一手“保护模式”。 可以定期检查一下有没有ether泄露啊， token总量是否banlance啊。。。如果出现问题， 可以切换到安全模式， 限制大部分功能， 或者只能由少数可信的人去调用contract， 或者just converts the contract into a simple “give me back my money” contract.

### Formal Verification
感觉有点像[Property Based Testing?](https://hypothesis.works/articles/what-is-property-based-testing/)


# Using the compiler
编译器solc的一些命令行选项。

# Contract Metadata
用`solc --metadata`可以生成contract的metadata。 其中包括了源代码的的hash值以及Swarm位置 ， metadata的Swarm位置保存在contract bytecode最后， 因此通过bytecode就可以找到metadata，进而找到源代码， 来验证代码可信。

# Application Binary Interface Specification
contract的ABI规范， 一般做编译器的才会需要了解吧。


# Joyfully Universal Language for (Inline) Assembly
JULIA is an intermediate language that can compile to various different backends (EVM 1.0, EVM 1.5 and eWASM are planned). 

也就是编译器的中间语言， 不同的后端可以编译到不同的EVM上。 应该只有做EVM开发的才会需要了解吧。

# Style Guide
主要参考了[python的pep8 style guide](https://www.python.org/dev/peps/pep-0008/)， 代码风格的目的是为了一致性！摘自 https://www.python.org/dev/peps/pep-0008/#a-foolish-consistency-is-the-hobgoblin-of-little-minds

> A style guide is about consistency. Consistency with this style guide is important. Consistency within a project is more important. Consistency within one module or function is most important. But most importantly: know when to be inconsistent – sometimes the style guide just doesn’t apply. When in doubt, use your best judgement. Look at other examples and decide what looks best. And don’t hesitate to ask!

# 常用模式
## Withdrawal from Contracts
之前说过transfer可能失败， 因此如果要退钱给用户， 让他们自己withdraw， 否则有可能让整个contract“卡死”。

## Restricting Access
chain上的东西是公开透明任何人都可以看得， 因此没办法隐藏。 只能限制别的合约读取你的合约state，默认就是这样， 除非你显示地指定public。 结合**function modifiers**可以让代码可读性更高， 比如：
```js
modifier onlyBy(address _account)
    {
        require(msg.sender == _account);
        // Do not forget the "_;"! It will
        // be replaced by the actual function
        // body when the modifier is used.
        _;
    }
```
## State Machine
contract很多时候是一个State Machine， 就是说contract的状态会根据不同的条件变化（包括时间变化）。 有些函数可能只能在特定的状态下执行， 同样， 结合**function modifiers**可以让代码可读性更高， 比如：
```js
    enum Stages {
        AcceptingBlindedBids,
        RevealBids,
        AnotherStage,
        AreWeDoneYet,
        Finished
    }

    // This is the current stage.
    Stages public stage = Stages.AcceptingBlindedBids;

    uint public creationTime = now;

    modifier atStage(Stages _stage) {
        require(stage == _stage);
        _;
    }

        function nextStage() internal {
        stage = Stages(uint(stage) + 1);
    }

    // Perform timed transitions. Be sure to mention
    // this modifier first, otherwise the guards
    // will not take the new stage into account.
    modifier timedTransitions() {
        if (stage == Stages.AcceptingBlindedBids &&
                    now >= creationTime + 10 days)
            nextStage();
        if (stage == Stages.RevealBids &&
                now >= creationTime + 12 days)
            nextStage();
        // The other stages transition by transaction
        _;
    }
```
**注意**， Solidity v0.4.0之前有个问题： **Modifier May be Skipped**。 因为modifier只是简单的代码替换而不是函数调用， 如果那部分代码里面return了， 后面的代码可能不执行。v0.4.0之后没这个问题。

# List of Known Bugs
列出了一些Solidity compiler已知bugs。

在考虑一份contract的时候， 简单地说可以这样看： 如果不是用contract创建时候的最新发布版本编译器编译的， 就值得怀疑！ 有可能有bug， 有可能是contract作者故意想利用某个bug呢！！！

# FAQ
一些常见的问题， 最初由[fivedogit](https://github.com/fivedogit)整理， 有些代码可以参考[solidity-baby-steps](https://github.com/fivedogit/solidity-baby-steps)。

# 参考资料
* https://solidity.readthedocs.io