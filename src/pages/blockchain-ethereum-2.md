---
title: 区块链系列六：设计自己的cryptocurrency
draft: false
tags: [Ethereum, 以太坊]
category: Blockchain
date: "2018-04-07T07:51:32Z"
---

[区块链系列四：Hello Ethereum!](/blockchain-ethereum-0)介绍了Ethereum的一些基础知识， 本文我们来用Ethereum发一个币玩玩。

<!-- more -->

# 安装客户端和钱包
按之前介绍安装客户端， 我们用Go语言版本的[Geth](https://github.com/ethereum/go-ethereum/)。

下载安装[Mist或Ethereum Wallet](https://github.com/ethereum/mist/releases)，Mist其实包含了钱包功能以及Remix IDE， 功能很强大的。

# 启动测试网络
```bash
➜  geth-darwin-amd64-1.8.2-b8b9f7f4 ./geth --identity "MyEther" --rpc --rpccorsdomain "*" --datadir ~/.ethereum_private --nodiscover --networkid 1999 --ipcpath ~/Library/Ethereum/geth.ipc
```
注意， 如果我们用`--datadir`指定了自定义的存储位置， `geth.ipc`会存储在此目录下。 而Mist自带一个geth客户端， 默认会去连localhost的默认客户端， 如果连不到则会启动自己的geth， 尝试连接mainnet。 所以为了让Mist连接我们的private network， 需要用`--ipcpath`将`geth.ipc`指定到默认位置。这样Mist就会连接到我们的客户端启动的private network了。

# 最小可行Token： MVT(Minimum Viable Token)
Show me the code!
```js
pragma solidity ^0.4.20; // 指定编译器版本

contract MyToken {
    // 记录每个address的账户余额
    mapping (address => uint256) public balanceOf;

    // 构造函数， 指定contract创建者的初始余额
    function MyToken(
        uint256 initialSupply
        ) public {
        balanceOf[msg.sender] = initialSupply;
    }

    // 转账
    function transfer(address _to, uint256 _value) public {
        require(balanceOf[msg.sender] >= _value);           // 账户余额是否足够
        require(balanceOf[_to] + _value >= balanceOf[_to]); // 是否会溢出
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
    }
}
```

# 理解contract
现在我们来从零开始逐渐构建一份完整的contract，并添加一些高级功能。

```js
    pragma solidity ^0.4.20; // 指定编译器版本

    contract Chips {
        mapping (address => uint256) public balanceOf;
    }
```
`pragma`指定编译器版本。 contract类似于class， Chips是contract的名称（也就是我们token的名称）。balanceOf是Chips的一个字段， 类型为`mapping (address => uint256)`。 mapping是一种数据类型， 类似于Hashmap， 这里拿来存每个地址都多少token。 public表示所有人都可以访问。 

我们可以如下图操作， 打开Mist，将代码copy到Mist中的编辑器中即可：
![部署contract](/blogimgs/blockchain/deploy-contract.png)
![复制solidity代码](/blogimgs/blockchain/copy-solidity.png)

PS， 从上图中我们可以看出Mist其实里面包含的是一个网页， 直接在浏览器里访问网页url也可以：https://wallet.ethereum.org/ 。

是可以部署了， 但是没啥用， 因为balanceOf里每个地址都是0。 我们来给自己分配的token：
```js
    function Chips() public {
        balanceOf[msg.sender] = 21000000;
    }
```
Chips是构造函数， 名称需要与contract名称一致， 只会在contract被部署的时候执行一次。`msg.sender`是部署合约的人。 分配多少你可以随便写， 21000000是致敬BTC， 当然也可以用参数传递进去：
```js
    function Chips(uint256 initialSupply) public {
        balanceOf[msg.sender] = initialSupply;
    }
```

现在所有的token都在自己手里， 没啥价值， 我们要分点给其他人啊， 于是需要转账功能：
```js
    function transfer(address _to, uint256 _value) public {
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
    }
```
代码简单直接， 就是从发送者(msg.sender)转给to。 但是这里显然有问题， 万一发送者余额不足呢， 这种情况我们应该终止交易。 要提前终止代码执行有两种方法： return和throw。 return花费更少的gas， 但是之前修改的状态会被保留； 而throw会回滚所有的修改， 但是会花费掉所有gas。所以我们加一下判断：
```js
    function transfer(address _to, uint256 _value) public {
        // 检查账户token够不够， 以及是否会溢出
        require(balanceOf[msg.sender] >= _value && balanceOf[_to] + _value >= balanceOf[_to]);

        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
    }
```

## contract信息
现在我们来添加一些关于contract的信息， 在contract中添加几个字段：
```js
string public name;
string public symbol;
uint8 public decimals;
```
然后修改构造函数：
```js
    function Chips(uint256 initialSupply, string tokenName, string tokenSymbol, uint8 decimalUnits) public {
        balanceOf[msg.sender] = initialSupply;              // 初始token数量
        name = tokenName;                                   // token显示名称
        symbol = tokenSymbol;                               // token显示符号
        decimals = decimalUnits;                            // 小数位数
    }
```
这里需要注意的是decimals，它的含义是1个token可以拆分成多少个最小基本单位。 比如1ether = 10 ** 18 wei， 所以Ethereum里decimals是18； 而如果是美刀， 则1美刀=100美分， 所以decimals是2。 这个地方没理解好后面会有坑，我们稍后介绍。

## Events
我们想监听contract的某些状态， 比如当contract发生修改时，我们想获得通知。只需要写一个空函数（首字母大写）即可：
```js
    event Transfer(address indexed from, address indexed to, uint256 value);
```
然后我们可以在`transfer`函数中调用：
```js
        emit Transfer(msg.sender, _to, _value);
```
这样钱包会收到通知。

## Deploy
我们来用Mist把前面代码部署到Ethereum网络吧！

选“合约” -》 “部署新合约”， 然后把solidity代码复制到编辑器里， 在“选择欲部署的合约”里选择Chips， 然后填上初始参数，如下图：
![部署contract](/blogimgs/blockchain/deploy-contract2.png)

注意，这里我们初始给了10000， 但是decimal units为2， 其实表示的是100“块”token， 最小单位是0.01“块”token。

滚动到最下面， 设置一个合适的gas， 然后点击“部署”， 在弹出框中输入密码，点确定。 然后在`geth console`里开启挖矿， `miner.start(1)`， 过一会就会在主界面看到确认信息。
![确认](/blogimgs/blockchain/confirmations.png)

点击`[Main account](Etherbase)`进入账号页面， 会看到自己拥有全部的`FirstChips`： 100, 00$$。
![main account](/blogimgs/blockchain/mainaccount.png)

点击`FirstChips（管理页面）`进入合约页面， 可以查看合约的信息。
![FirstChips](/blogimgs/blockchain/firstchips.png)


现在我们可以转点token给朋友了。 点击发送， 配置好地址和数量， 选好token类型， 拖到最下面点击发送即可。 
![send-ok](/blogimgs/blockchain/send-ok.png)
注意这里有个小坑， 数量这里输入10， 是指的token（相当于“块”）， 而我们之前设置decimal units是2， 所以是1000“分”。第一次的时候没注意， 在构造函数填的只是100（相当于只有1块），结果这边转10块的时候， 总是报错。
![transfer-error](/blogimgs/blockchain/transfer-error.png)

输入密码， 继续挖一会矿， 会发现main account里面只有90, 00$$了， 然后在另一个账号里多了10,00$$。 如果另一个账号是在其他客户端上（比如转给其他朋友）， 则他们是看不到新的token的。 需要在FirstChips的合约页面， 点击复制地址， 将地址发给朋友， 然后他们在合约页面，点查看代币， 然后把地址复制进去即可。
![watch-token0](/blogimgs/blockchain/watch-token0.png)
![watch-token](/blogimgs/blockchain/watch-token.png)

当然，你也可以调用contract的transfer函数来转账，注意这里的单位是“分”！
![transfer2](/blogimgs/blockchain/transfer2.png)

就这样我们很快就发了一个币， 当然只是运行在私有网络上， 要想部署到main net， 需要花费ethereum， 目前还没必要。

目前只有转账功能， 接下来我们打算设计一些复杂功能， 比如自动跟ether交易啊， POW机制啊， 账户冻结啊， 通过oraclize访问外部资源等， 敬请期待！

# 参考资料
* https://www.ethereum.org/token
* http://www.ethdocs.org
* https://github.com/ethereum/go-ethereum/wiki/
* https://solidity.readthedocs.io
* http://web3js.readthedocs.io/en/1.0/index.html 