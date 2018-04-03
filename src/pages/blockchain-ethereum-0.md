---
title: 区块链系列四：Hello Ethereum!
draft: false
tags: [Ethereum, 以太坊]
category: Blockchain
date: "2018-04-03T07:51:32Z"
---

本文介绍以太坊开发的基础知识。

<!-- more -->

# 为啥不讲比特币呢
很少有基于比特币做开发的， 如果大家有兴趣可以看下面几个资料：
* [Mastering Bitcoin 2nd Edition](https://github.com/bitcoinbook/bitcoinbook)
* [Bitcoin and Cryptocurrency Technologies](http://bitcoinbook.cs.princeton.edu/) [Coursera上课程](https://www.coursera.org/learn/cryptocurrency/home/welcome) [课程资料](https://piazza.com/princeton/spring2015/btctech/home)
* [Bitcoin官网](https://bitcoin.org/en/)

只需要看上面三个资料来源即可， 不用看太多资料。

# Ethereum基础概念介绍
## P2P网络
区块链底层是一个P2P网络，全球有很多电脑节点连在这个网络上， 没有中心节点， 每个节点互相通信， 各自保留一份完整的账本。
## 客户端
就是P2P网络中的一个节点， 包含有一些功能以支持整个P2P网络的运行。 比如转账， 记录账本， 挖矿等， 还有一个完整的虚拟机EVM， 可以在上面执行智能合约。

官方支持三种语言的客户端， 分别是：
* Go语言版本的[Geth](https://github.com/ethereum/go-ethereum/)
* C++语言版本[Eth](https://github.com/ethereum/cpp-ethereum)
* python语言版本的[pyethapp](https://github.com/ethereum/pyethapp)

另外社区还开发了各种语言版本的客户端， 可以看[Ethereum Clients](http://www.ethdocs.org/en/latest/ethereum-clients/index.html)。
## RPC
客户端通过[JSON RPC](https://github.com/ethereum/wiki/wiki/JSON-RPC)暴露了一些API给用户使用， 比如生成账户、查看自己账户余额、部署智能合约等。 用户可以用curl或者postman工具调用RPC来实现功能， 但是一般还是通过一些SDK去做RPC调用，用的较多的有[web3.js](https://github.com/ethereum/web3.js/)，其他语言版本的可以参考[Connecting to Ethereum Clients](http://www.ethdocs.org/en/latest/connecting-to-clients/index.html)。

RPC、客户端、以太坊网络三者的关系如下：用户通过RPC调用客户端功能， 客户端通过EVM执行智能合约以及跟整个以太坊P2P网络连接。

## 账户
Ethereum有两种类型的账户， 一种叫External owned account，可以简单理解为人控制的账户， 里面有“币”ether， 需要提供secret key，即可转账等。  一定要保护好自己的密钥， 不要让别人知道了（相当于把银行卡密码告诉了别人）否则钱就没了（被别人取走了）； 也不要自己给搞丢了， 因为没有“找回密码”的功能， 记得经常备份， 也可以拿纸记下来存放在保险柜里， 但是小心别被火烧了哈(谁都不能用这笔钱了)。。。   本质上而言账号就是一个公钥-私钥对， 可以通过之前提到的各种客户端生成任意数量的EOA， 具体可以看[Account Management](http://www.ethdocs.org/en/latest/account-management.html)。

另一种叫Contract account， 其实是存储在blockchain上的一些代码和数据， 可以类比为面向对象语言里面的一个对象， 可以被EOA调用修改其中的状态。 代码执行需要花费一定数量的Gas。

## Gas
为了避免以太坊网络被滥用或者攻击， 在EVM中执行的代码(contract)需要执行一定的费用，这就是gas了。 gas对应现实生活中的燃油费， 是驱动整个加密经济体系运转的动力。 gas涉及到三个概念：
* gasUsed， 每一条EVM指令都对应一定数量的gas， gasUsed表示整个contract执行完需要的gas总和
* gasPrice， 调用contract的用户愿意支付的单价

执行一个contract的总花费 = gasUsed * gasPrice。

想想自己一不小心写出个死循环把自己几个亿的ether给用光了是什么感觉！ 所以我们一般会设置**gasLimit**，即最大花费。 如果花费超过了gasLimit则contract执行过的操作会回滚，然后停止执行。 如果花费没有达到gasLimit， 则剩下的会原路退回。 客户端可以帮你估计一个contract大概的花费， 便于合理设置gasLimit。 问大家个问题， 如果花费超过了gasLimit会回滚contract操作， 那么还会扣掉gas么？为什么？

更多资料可以看[Account Types, Gas, and Transactions](http://ethdocs.org/en/latest/contracts-and-transactions/account-types-gas-and-transactions.html)。

## 智能合约
前面多次提到contract， 到底是啥呢？ 说白了，就是一段代码以及相关的一个状态， 智能表示能自动执行。 比如你跟小明打赌， 说明天下不下雨，如果下雨你输10块给他。 结果第二天真的下雨了， 然后你赖账了。。。。为了避免赖账， 我们可以建一份智能合约， 里面一开始存储的状态是“你有10块钱， 小明有10块钱”，以及一段代码“如果明天下雨， 你的10块钱归小明， 反之亦然”。 然后第二天下雨了， 合约就自动执行，然后状态变成了“你有0块钱， 小明有20块钱”。

## EVM
以太坊的虚拟机， 执行智能合约， 类似于JVM。 EVM是一个隔离的沙盒， 里面不能访问网络、文件系统等。EVM支持的功能是图灵完备的。 注意图灵完备不代表能做任何事情， 比如不能访问网络等。

## Solidity
EVM上执行的智能合约是底层的二进制， 但是我们开发要用高级语言呢。 [Solidity](https://solidity.readthedocs.io)就是开发智能合约的一门高级语言， 类似于javascript， 通过solidity的编译器编译成二进制。

# Hello Ethereum!
## 安装客户端
这里我们选择安装[geth](https://geth.ethereum.org/)， 最简单的方式是[下载压缩包](https://geth.ethereum.org/downloads/)， 直接解压即可。 安装其他客户端可以参考[GETH & ETH](https://www.ethereum.org/cli)。 为了在任何路径都能执行geth， 可以将其加入系统PATH中。

安装好之后执行如下命令启动geth：
```bash
geth
```
geth提供了一个console，整合了web3.js，我们可以在里面直接写javascript代码进行操作， 比如生成账户、转账等， 通过如下命令进入console:
```bash
geth console
```
另外也可以单独执行`geth`把客户端启动起来， 然后在新的终端里面执行`geth attach`打开一个新的console。进入之后执行:
```bash
eth.accounts
```
会发现返回的是空数组`[]`， 我们用下面命令生成一个新账号：
```bash
> personal.newAccount()
Passphrase:
Repeat passphrase:
"0xecbc12eaef5fa1300cb9aad0a17bd2e40bde2a61"
```
## 运行测试网络TestNetwork
直接用`geth`启动客户端， geth进去的是主网络（main network），也就是说任何操作都会真实进入以太坊P2P网络，比如转账、部署智能合约等。当然，我们账户里面没钱， 所以也没法转账和部署智能合约。 为了便于测试，我们可以建立一个私有测试网络。

区块链第一块叫创世块(Genesis block)，建立私有测试链需要提供genesis block的配置，简单如下：
```json
{
  "nonce": "0x0000000000000042",
  "timestamp": "0x0",
  "parentHash":
    "0x0000000000000000000000000000000000000000000000000000000000000000",
  "extraData": "0x",
  "gasLimit": "0x8000000",
  "difficulty": "0x400",
  "config": {},
  "mixhash":
    "0x0000000000000000000000000000000000000000000000000000000000000000",
  "coinbase": "0x3333333333333333333333333333333333333333",
  "alloc": {}
}
```
保存为`myGenesis.json`，然后执行下面命令：
```bash
➜  geth-darwin-amd64-1.8.2-b8b9f7f4 ./geth --identity "MyEther" --rpc --datadir ~/.ethereum_private --nodiscover --networkid 1999 init ./myGenesis.json
INFO [04-03|15:33:36] Maximum peer count                       ETH=25 LES=0 total=25
INFO [04-03|15:33:36] Allocated cache and file handles         database=/Users/magicly/.ethereum_private/geth/chaindata cache=16 handles=16
INFO [04-03|15:33:36] Writing custom genesis block
INFO [04-03|15:33:36] Persisted trie from memory database      nodes=0 size=0.00B time=10.416µs gcnodes=0 gcsize=0.00B gctime=0s livenodes=1 livesize=0.00B
INFO [04-03|15:33:36] Successfully wrote genesis state         database=chaindata                                       hash=6231b0…a0300b
INFO [04-03|15:33:36] Allocated cache and file handles         database=/Users/magicly/.ethereum_private/geth/lightchaindata cache=16 handles=16
INFO [04-03|15:33:36] Writing custom genesis block
INFO [04-03|15:33:36] Persisted trie from memory database      nodes=0 size=0.00B time=3.22µs   gcnodes=0 gcsize=0.00B gctime=0s livenodes=1 livesize=0.00B
INFO [04-03|15:33:36] Successfully wrote genesis state         database=lightchaindata                                       hash=6231b0…a0300b
```
其中`--identity`是网络名称。 `--rpc`表示开启RPC功能。 `--datadir`是这个私有网络的数据存储目录，避免覆盖主网数据。 `--nodiscover`表示不要被其他节点发现。 `--networid`是网络id， 随便设置一个数即可， 默认为1（即主网）。
>  --networkid value                     Network identifier (integer, 1=Frontier, 2=Morden (disused), 3=Ropsten, 4=Rinkeby) (default: 1)

更多命令行选项可以执行`geth --help`查看， 或者访问[go ethereum Command Line Options](https://github.com/ethereum/go-ethereum/wiki/Command-Line-Options)。

然后执行下面命令，启动geth：
```bash
geth --identity "MyEther" --rpc --datadir ~/.ethereum_private --nodiscover --networkid 1999
```
连接客户端：
```bash
➜  geth-darwin-amd64-1.8.2-b8b9f7f4 ./geth attach
Fatal: Unable to attach to remote geth: dial unix /Users/magicly/Library/Ethereum/geth.ipc: connect: no such file or directory
➜  geth-darwin-amd64-1.8.2-b8b9f7f4 ./geth attach ipc:/Users/magicly/.ethereum_private/geth.ipc
Welcome to the Geth JavaScript console!

instance: Geth/MyEther/v1.8.2-stable-b8b9f7f4/darwin-amd64/go1.9.4
 modules: admin:1.0 debug:1.0 eth:1.0 miner:1.0 net:1.0 personal:1.0 rpc:1.0 txpool:1.0 web3:1.0

> eth.accounts
[]
> personal.newAccount()
Passphrase:
Repeat passphrase:
"0xa736f13951da77c39e035c4c1b1970478a758340"
```
注意， 这里直接用`geth attach`连不上客户端， 因为不是用的默认配置。并且如果是用http方式attach的， 虽然连上了， 但是创建新账号的时候会报错：
```bash
➜  geth-darwin-amd64-1.8.2-b8b9f7f4 ./geth attach http://localhost:8545
Welcome to the Geth JavaScript console!

instance: Geth/MyEther/v1.8.2-stable-b8b9f7f4/darwin-amd64/go1.9.4
coinbase: 0xa736f13951da77c39e035c4c1b1970478a758340
at block: 0 (Thu, 01 Jan 1970 08:00:00 CST)
 modules: eth:1.0 net:1.0 rpc:1.0 web3:1.0

> personal.newAccount()
Passphrase:
Repeat passphrase:
Error: The method personal_newAccount does not exist/is not available
>
```
只有通过IPC连接上的客户端， 才认为足够安全， 才允许创建账号。 当然也可指直接用`geth`创建账号：
```bash
➜  geth-darwin-amd64-1.8.2-b8b9f7f4 ./geth --datadir ~/.ethereum_private account new
INFO [04-03|15:55:47] Maximum peer count                       ETH=25 LES=0 total=25
Your new account is locked with a password. Please give a password. Do not forget this password.
Passphrase:
Repeat passphrase:
Address: {53707514492dda75eccb8ff621759af7f0f3c0f0}
```
注意，必须加上`--datadir`，否则创建的账号在默认目录， 不能访问。然后在`console`里看， 确实有两个账号了：
```bash
> eth.accounts
["0xa736f13951da77c39e035c4c1b1970478a758340", "0x53707514492dda75eccb8ff621759af7f0f3c0f0"]
```

刚创建的账号， 肯定都没钱嘛：
```bash
> pa = eth.accounts[0]
"0xa736f13951da77c39e035c4c1b1970478a758340"
> eth.getBalance(pa)
0
```
我们可以通过挖矿给自己搞点ether，因为我们在`myGenesis.json`里面配置的`"difficulty": "0x400",`， 所以很容易就挖到了。http://www.unminer.com/eth 显示主网真实挖矿难度目前是1600T左右，是我们的`1600, 000, 000, 000`倍！所以知道为什么要搭建测试环境了吧。用下面命令开始挖矿：
```bash
> miner.setEtherbase(pa)
true
> miner.start()
null
> miner.stop()
true
> eth.getBalance(pa)
55000000000000000000
> web3.fromWei(eth.getBalance(pa), 'ether')
55
```
start之后几秒钟， CPU飚到800%， 风扇狂转， 赶紧关掉， 然后发现， 已经挖到55个以太坊了， 按照目前市值400刀一个， 我们挖到了价值22000刀的以太坊， 可惜都是测试环境的， 哈哈哈。

## 编写智能合约Solidity
solidity是编写以太坊智能合约的高级语言， 首先需要安装编译器， 参考[Installing the Solidity Compiler](http://solidity.readthedocs.io/en/develop/installing-solidity.html)。当然， 最简单的当然是直接用online版本[Remix](https://remix.ethereum.org)。

复制下列代码到remix编辑器中：
```js
pragma solidity ^0.4.0;
contract mortal {
    /* Define variable owner of the type address */
    address owner;

    /* This function is executed at initialization and sets the owner of the contract */
    function mortal() public { owner = msg.sender; }

    /* Function to recover the funds on the contract */
    function kill() public { if (msg.sender == owner) selfdestruct(owner); }
}

contract greeter is mortal {
    /* Define variable greeting of the type string */
    string greeting;
    
    /* This runs when the contract is executed */
    function greeter(string _greeting) public {
        greeting = _greeting;
    }

    /* Main function */
    function greet() public constant returns (string) {
        return greeting;
    }
}
```
然后执行编译， 之后可以查看编译结果， 如下图：
![Remix](/blogimgs/blockchain/remix-greeter.png)
## 部署智能合约Web3.js
将前面图中代码`web3deploy`部分代码复制下来， 给变量`__greeting`一个值， 直接复制到geth的console中， 或者保存到文件比如`web3.js`，然后在console中执行`loadScript('./web3.js')`即可。
```js
// web3.js
var _greeting = 'Hello Ethereum!';
var greeterContract = web3.eth.contract([{"constant":false,"inputs":[],"name":"kill","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"greet","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_greeting","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]);
var greeter = greeterContract.new(
   _greeting,
   {
     from: web3.eth.accounts[0], 
     data: '0x6060604052341561000f57600080fd5b6040516103a93803806103a983398101604052808051820191905050336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508060019080519060200190610081929190610088565b505061012d565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106100c957805160ff19168380011785556100f7565b828001600101855582156100f7579182015b828111156100f65782518255916020019190600101906100db565b5b5090506101049190610108565b5090565b61012a91905b8082111561012657600081600090555060010161010e565b5090565b90565b61026d8061013c6000396000f30060606040526004361061004c576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806341c0e1b514610051578063cfae321714610066575b600080fd5b341561005c57600080fd5b6100646100f4565b005b341561007157600080fd5b610079610185565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156100b957808201518184015260208101905061009e565b50505050905090810190601f1680156100e65780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415610183576000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b565b61018d61022d565b60018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156102235780601f106101f857610100808354040283529160200191610223565b820191906000526020600020905b81548152906001019060200180831161020657829003601f168201915b5050505050905090565b6020604051908101604052806000815250905600a165627a7a723058206787dd51eae8103738c5112e2d5c1636972e888ace270061dd0cf0e3f802f4cc0029', 
     gas: '4700000'
   }, function (e, contract){
    console.log(e, contract);
    if (typeof contract.address !== 'undefined') {
         console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
    }
 })
```
其中data就是`greeter`编译之后的二进制。
```bash
> loadScript('./web3.js')
Error: authentication needed: password or unlock undefined
true
```
额， 我们需要先解锁我们的主账户
```bash
> personal.unlockAccount(web3.eth.accounts[0])
Unlock account 0xa736f13951da77c39e035c4c1b1970478a758340
Passphrase:
true
```
然后再加载加载脚本即可:
```bash
> loadScript('./web3.js')
null [object Object]
true
```
这时候合约并没有入链的:
```bash
> greeter.address
undefined
```
想想也对， 这会儿没有miner干活呢， 那我们来自己挖一下吧：
```bash
> miner.start()
null
> null [object Object]
Contract mined! address: 0xf0406e7bcb75326a9b9fa47a05d3ce2126d95148 transactionHash: 0x01e70a7b0927cf70e9f0a2fcb904e6fff57009ae3d18350941fc4dc254283caf
> miner.stop()
true
> web3.fromWei(eth.getBalance(pa), 'ether')
85
> greeter.address
"0xf0406e7bcb75326a9b9fa47a05d3ce2126d95148"
```
可以看到， contract已经计入blockchain了， 另外，我们又挖到了30个eth哈哈哈。我们可以通过contract的address找到代码，当然，是二进制：
```bash
> eth.getCode(greeter.address)
"0x60606040526004361061004c576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806341c0e1b514610051578063cfae321714610066575b600080fd5b341561005c57600080fd5b6100646100f4565b005b341561007157600080fd5b610079610185565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156100b957808201518184015260208101905061009e565b50505050905090810190601f1680156100e65780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415610183576000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b565b61018d61022d565b60018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156102235780601f106101f857610100808354040283529160200191610223565b820191906000526020600020905b81548152906001019060200180831161020657829003601f168201915b5050505050905090565b6020604051908101604052806000815250905600a165627a7a723058206787dd51eae8103738c5112e2d5c1636972e888ace270061dd0cf0e3f802f4cc0029"
```

然后我们就可以执行合约了：
```bash
> greeter.greet()
"Hello Ethereum!"
```
别人也能访问我们deploy的智能合约， 只要他们知道代码的地址以及接口类型(ABI (Application Binary Interface)))。 ABI是干嘛的呢， 基本就是告诉你前面的二进制代码要怎么调用， 因为估计没人能看了那串二进制就知道它是干嘛的吧。我们新开一个console：
```bash
➜  geth-darwin-amd64-1.8.2-b8b9f7f4 ./geth attach http://localhost:8545
Welcome to the Geth JavaScript console!

instance: Geth/MyEther/v1.8.2-stable-b8b9f7f4/darwin-amd64/go1.9.4
coinbase: 0xa736f13951da77c39e035c4c1b1970478a758340
at block: 17 (Tue, 03 Apr 2018 16:30:06 CST)
 modules: eth:1.0 net:1.0 rpc:1.0 web3:1.0

> var greeter2 = eth.contract([{"constant":true,"inputs":[],"name":"greet","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_greeting","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]).at('0xf0406e7bcb75326a9b9fa47a05d3ce2126d95148');
undefined
> greeter2.address
"0xf0406e7bcb75326a9b9fa47a05d3ce2126d95148"
> greeter2.greet()
"Hello Ethereum!"
>
```
像上面这样获取到contract的代码然后直接调用`greeter2.greet()`，其实是在本地的EVM上调用， 不会修改blockchain上的状态的（因此也不用花费ether）。如果需要修改blockchain上的状态，需要通过`sendTransaction`调用。 我们先在一个没有ehter的账户上调用一下试试：
```bash
> pa = eth.accounts[1]
"0x53707514492dda75eccb8ff621759af7f0f3c0f0"
> greeter2.greet.sendTransaction({from: pa})
Error: insufficient funds for gas * price + value
    at web3.js:3143:20
    at web3.js:6347:15
    at web3.js:5081:36
    at web3.js:4137:16
    at <anonymous>:1:1

> eth.getBalance(pa)
0
```
看来，没钱真的不行啊。那我们在之前有ether的账户（之前有85ether，不过由于每次都交易都需要挖矿入链， 又多产生了一些，最后另外新开了一个账号来mine，才让pa0这个账号没有新增ether）上试一下呢：
```bash
> personal.unlockAccount(pa0)
Unlock account 0xa736f13951da77c39e035c4c1b1970478a758340
Passphrase:
true
> eth.getBalance(pa0)
109991138204000000000
> greeter.greet.sendTransaction({from: pa0})
"0x5e4090be8ad2fcf6eeae05174f0e9eac3134a1857928d278f8ef4dd13ef2fded"
> eth.getBalance(pa0)
109991138204000000000
> txpool.status
{
  pending: 1,
  queued: 0
}
> txpool.status
{
  pending: 0,
  queued: 0
}
> eth.getBalance(pa0)
109990737038000000000
> greeter.greet.sendTransaction({from: pa0})
"0xec58cbf73512fd5aad75b9e60ebbe5a90f3bf36ceec63f704a7bbdf2a23ca4a1"
> txpool.status
{
  pending: 1,
  queued: 0
}
> eth.getBalance(pa0)
109990335872000000000
>
```
可以看出来，每次都需要消费`109991138204000000000 - 109990737038000000000 == 109990737038000000000 - 109990335872000000000 == 401165999996928`个wei，wei是以太坊的最小单位，`1 ether == 10 ** 18 wei`， 所以执行一次`greet`交易，需要花费`401165999996928 / 10 ** 18 == ~=0.0004`个ether，现在差不多1快rmb了。 我们可以看到，字符串确实存到blockchain上了：
```bash
> eth.getStorageAt(greeter.address)
"0x000000000000000000000000a736f13951da77c39e035c4c1b1970478a758340"
```

如果我们最后不需要这个合约了， 我们可以把他删除， 避免占用blockchain的空间：
```bash
> personal.unlockAccount(eth.accounts[0])
Unlock account 0xa736f13951da77c39e035c4c1b1970478a758340
Passphrase:
true
> greeter.kill.sendTransaction({from: eth.accounts[0]})
> eth.getCode(greeter.address)
"0x60606040526004361061004c576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806341c0e1b514610051578063cfae321714610066575b600080fd5b341561005c57600080fd5b6100646100f4565b005b341561007157600080fd5b610079610185565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156100b957808201518184015260208101905061009e565b50505050905090810190601f1680156100e65780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415610183576000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b565b61018d61022d565b60018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156102235780601f106101f857610100808354040283529160200191610223565b820191906000526020600020905b81548152906001019060200180831161020657829003601f168201915b5050505050905090565b6020604051908101604052806000815250905600a165627a7a723058206787dd51eae8103738c5112e2d5c1636972e888ace270061dd0cf0e3f802f4cc0029"
> txpool.status
{
  pending: 1,
  queued: 0
}
> txpool.status
{
  pending: 0,
  queued: 0
}
> eth.getCode(greeter.address)
"0x"
> eth.getBalance(pa0)
109990141400000000000
```
注意`kill`之后要mine才可以修改blockchain上的状态。也可以看出，kill也是需要花费gas的，当然，远比执行contract要低， 相当于网络进行了补贴， 否则估计就没人愿意删除合约了，这样会导致网络膨胀。 注意， 只有contract的owner才可以kill掉此contract， 其他人也能调用kill方法， 但是是没办法删掉contract的， 而且还扣了gas（貌似还比较高）。


ok，我们已经实现了一个Ethereum版本的`Hello World`， 后面我们就来考虑自己发一个币吧。

# 参考资料
* https://www.ethereum.org
* http://www.ethdocs.org
* https://github.com/ethereum/go-ethereum/wiki/
* https://solidity.readthedocs.io
* http://web3js.readthedocs.io/en/1.0/index.html 