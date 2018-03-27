---
title: 用Promise实现并发 vs Go goroutine
draft: false
tags: [promise, concurrency, 并发, go, goroutine ]
category: FE
date: "2018-03-24T08:23:32Z"
---

我们知道Node.js里充满着大量的异步， 后来出现了Promise以及async/await来解决"callback hell"的问题。我们就来看看promise以及async/await如何简化JS并发代码的编写， 最后再给出一份实现相同功能的Go代码。

<!-- more -->

# 问题
代码开发中经常会做的一件事就是去请求一个api， 并可能进一步根据api返回结果去获取访问新的接口。 这里我们构造一个问题：获取https://cnodejs.org/ 前10个主题的id、title、date、作者昵称以及第一个回复者的昵称。 cnodejs提供了api， https://cnodejs.org/api 这里的前两个接口就能满足我们的要求。 首先用https://cnodejs.org/api/v1/topics 接口获取到前10个topics， 然后取出每个topic的id去访问`get /topic/:id 主题详情`接口， 里面可以获取到回复数据。

# 简单实现
发起网络请求有很多方法， 我们这里采用[axios](https://github.com/axios/axios)库， 有几个好处， 其中包括同时支持Node.js和Browser。

我们直接用“最先进”的async/await来实现一个版本:
```js
const axios = require("axios");

async function getFirst10TopicsIncludeFirstReplyAuthor() {
  const response = await axios.get(
    "https://cnodejs.org/api/v1/topics?limit=10"
  );
  const json = response.data;
  const first10 = json.data.map(topic => {
    return {
      id: topic.id,
      title: topic.title,
      date: topic.create_at,
      author: topic.author.loginname
    };
  });

  for (let topic of first10) {
    const response = await axios.get(
      `https://cnodejs.org/api/v1/topic/${topic.id}`
    );
    const json = response.data;
    const firstReply = json.data.replies[0];
    topic.firstReplyAuthor = firstReply && firstReply.author.loginname;
  }

  return first10;
}

getFirst10TopicsIncludeFirstReplyAuthor().then(data => console.log(data));
```

# 并发
上述代码简单直接， 用了async/await， 异步代码看上去基本上是同步的， 很直观易懂。 先发起一个请求， 获取10个topics的信息， 然后针对每个topic发起一个请求， 去获取第一条回复数据，最后把数据拼凑在一起返回。 由于后面的请求需要第一个请求返回的id， 因此必须等到第一个请求回来才可以发送后面的请求， 这块没有任何问题。 但是后面的10个请求完全是独立的， 因此可以并发请求，这样能大大缩短时间。比如每个请求需要花费1s， 则上述代码总共需要花费`1(第一个请求) + 10(后面10个请求) = 11s`， 而如果将第二步的请求完全并发则只需要`1(第一个请求) + 1(后面10个请求同时请求) = 2s`！！！

由于网络请求受网速影响很大不利于我们精确分析问题， 也避免大量的请求给Cnodejs服务造成影响， 我们在本地用`setTimout`模拟网络请求花费的时间。

上述代码在并发性上跟下面代码基本等价：
```js
// 模拟一次api网络请求花费1s
function mockAPI(result, time = 1000) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(result);
    }, time);
  });
}

async function get10Topics() {
  const t1 = Date.now();
  const result = [];
  const total = await mockAPI(10);
  for (let i = 1; i <= total; i += 1) {
    const r = await mockAPI(i);
    result.push(r);
  }
  const t2 = Date.now();
  console.log(`total cost: ${t2 - t1}ms.`);
  return result;
}

get10Topics().then(data => console.log(data));
```
执行之后发现， 确实在11s左右：
```bash
➜  test-js git:(master) ✗ node p1.js
total cost: 11037ms.
[ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]
```

[Promise.all](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)可以同时发起多个Promise，等到所有Promise都完成了之后返回一个数组， 包含每个Promise的结果。
```js
// 模拟一次api网络请求花费1s
function mockAPI(result, time = 1000) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(result);
    }, time);
  });
}

async function get10Topics2() {
  const t1 = Date.now();
  const total = await mockAPI(10);
  const promises = [];
  for (let i = 1; i <= total; i += 1) {
    promises.push(mockAPI(i));
  }
  const result = await Promise.all(promises)
  const t2 = Date.now();
  console.log(`total cost: ${t2 - t1}ms.`);
  return result;
}

get10Topics2().then(data => console.log(data));
```
时间正如我们说的， 缩短成了2s！
```bash
➜  test-js git:(master) ✗ node p2.js
total cost: 2005ms.
[ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]
```

# 限流
上面第二种方法已经大大提高率效率， 而且请求数越多， 提高的效率越多。 前面的分析可以得出， 如果是获取前100个topics， 第一种串行的方法需要101s， 而第二种还是2s！！！

仔细想想你会发现哪里不对， 那就是第二种方法“太并发”了！10个请求可能还好， 如果同时并发100个请求， 那对服务器就会造成一定的影响， 如果是1000个，10000个， 那问题就更大了， 甚至到了一定程度， 会超过操作系统允许打开的连接数， 对客户端本身也会有很大的影响。

所以我们需要限制最大并发数，比如我们限制最大并发数为3， 则10个请求大概是3个3个一组， 总共会有4组（最后一组只有1个）， 总共时间是5s， 这也比11s提高了50%多。一种实现方式如下：
```js
async function get10Topics3() {
  const t1 = Date.now();
  const total = await mockAPI(10);
  const MAX_CURRENCY = 3;
  const result = [];
  for (let i = 1; i <= total; i += MAX_CURRENCY) {
    const promises = [];
    for (let j = i; j < i + MAX_CURRENCY && j <= total; j += 1) {
      promises.push(mockAPI(j));
    }
    const r = await Promise.all(promises);
    result.push(...r);
  }
  const t2 = Date.now();
  console.log(`total cost: ${t2 - t1}ms.`);
  return result;
}

get10Topics3().then(data => console.log(data));
```
看一下结果：
```bash
➜  test-js git:(master) ✗ node p3.js
total cost: 5012ms.
[ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]
```

还有什么问题么？

# One More Step
上面的实现方法， 既利用了并发， 又对并发做了一定限制保证不至于把系统资源耗尽，似乎是完美的。 但是如果每个请求所需要的时间不一样呢？`get10Topics3`的实现方式是每三个一组， 等着三个都完成了， 再进行下一组请求。 那么如果三个任务中， 有一个花费的时间比较多， 另外两个任务完成了之后， 本来可以继续开始新的任务的， 现在必须等着第三个任务完成了才能开始新的任务。甚至如果三个任务需要的时间都不一样， 那么第一个需要等第二个和第三个， 第二个需要等第三个， 整个系统就被最慢的那个任务拖累了。 比如第一个任务需要1s， 第二个任务需要2s， 第三个任务需要3s， 则`get10Topics3`每组任务需要3s， 三组任务需要`3 * 3 = 9s`， 最后一组那个任务只需要1s， 总共需要`1 + 3 + 3 + 3 + 1 = 11s`， 当然这也比完全串行需要的时间`1 + 1 + 2 + 3 + 1 + 2 + 3 + 1 + 2 + 3 + 1 = 20s`要快不少。
```js
// 模拟一次api网络请求花费特定时间
function mockAPI(result, time = 1000) {
  console.log(result, time);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(result);
    }, time);
  });
}

async function get10Topics4() {
  const t1 = Date.now();
  const total = await mockAPI(10);
  const MAX_CURRENCY = 3;
  const result = [];
  for (let i = 1; i <= total; i += MAX_CURRENCY) {
    const promises = [];
    for (let j = i; j < i + MAX_CURRENCY && j <= total; j += 1) {
      const costtime = j % 3 === 0 ? 3 : j % 3; // 第一个任务1s， 第二个2是， 第三个3s...
      promises.push(mockAPI(j, costtime * 1000));
    }
    const t3 = Date.now();
    const r = await Promise.all(promises);
    const t4 = Date.now();
    console.log(`promise ${i} cost: ${t4 - t3}ms`);
    result.push(...r);
  }
  const t2 = Date.now();
  console.log(`total cost: ${t2 - t1}ms.`);
  return result;
}

get10Topics4().then(data => console.log(data));
```
运行结果：
```bash
➜  test-js git:(master) ✗ node p4.js
10 1000
1 1000
2 2000
3 3000
promise 1 cost: 3002ms
4 1000
5 2000
6 3000
promise 4 cost: 2999ms
7 1000
8 2000
9 3000
promise 7 cost: 3002ms
10 1000
promise 10 cost: 1005ms
total cost: 11030ms.
[ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]
```

大家很容易想到， 把所需时间短的任务放一起并发执行， 这样就能减少互相等待的时间。比如把4个1s的放一起， 3个2s的放一起， 3个3s的放一起， 则总共需要时间为：`1 + 1 + 2 + 3 + 1 = 8s`， 又提高了一些。但是， 一方面我们在实际任务开始并完成之前， 并不知道具体哪个任务需要花多长时间， 另一方面不可能刚好总有花同样时间的任务能凑成一组， 甚至极端情况下， 每个任务所花时间都不一样。

仔细想想， 我们只需要这么做： 构建一个任务池， 一开始并发三个任务， 每个任务回来之后不用等其他两个任务， 直接看一下任务池还有任务么， 有的话就直接去做，直到所有任务都完成即可。

由于Node.js里面没有信号量来同步各个“线程”之间的工作， 这里用了递归并操作公共变量的方式实现， 如果读者有更好的方式可以给作者留言。注意， “并发地修改共享变量是万恶之源， 有data race的问题， 好在JS里面是单线程， 所以没有这个问题。
```js
// 模拟一次api网络请求花费特定时间
function mockAPI(result, time = 1000) {
  console.log(result, time);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(result);
    }, time);
  });
}

const start = Date.now();
function worker(tasks, result) {
  const task = tasks.shift();
  if (!task) {
    // 任务结束
    return;
  }
  const costtime = task % 3 === 0 ? 3 : task % 3; // 第一个任务1s， 第二个2是， 第三个3s...
  return mockAPI(task, costtime * 1000).then(r => {
    console.log(`${r} completes at time: ${Date.now() - start}`);
    result.push(r);
    return worker(tasks, result);
  });
}

async function get10Topics5() {
  const t1 = Date.now();
  const total = await mockAPI(10);
  const MAX_CURRENCY = 3;
  const result = [];

  const tasks = [];
  for (let i = 1; i <= total; i += 1) {
    tasks.push(i);
  }

  const promises = [];
  for (let i = 0; i < MAX_CURRENCY; i += 1) {
    promises.push(worker(tasks, result));
  }

  const r = await Promise.all(promises);
  const t2 = Date.now();
  console.log(`total cost: ${t2 - t1}ms.`);
  return result;
}

get10Topics5().then(data => console.log(data));
```
运行代码可以看到结果：
```bash
➜  test-js git:(master) ✗ node p5.js
10 1000
1 1000
2 2000
3 3000
1 completes at time: 2s, by worker0
4 1000
2 completes at time: 3s, by worker1
5 2000
4 completes at time: 3s, by worker0
6 3000
3 completes at time: 4s, by worker2
7 1000
5 completes at time: 5s, by worker1
8 2000
7 completes at time: 5s, by worker2
9 3000
6 completes at time: 6s, by worker0
10 1000
8 completes at time: 7s, by worker1
10 completes at time: 7s, by worker0
9 completes at time: 8s, by worker2
total cost: 8032ms.
[ 1, 2, 4, 3, 5, 7, 6, 8, 10, 9 ]
```
我们可以看到，一开始同时开启了`worker0, worker1, worker2`三个“线程”去做事， `worker0`在第2s（因为第1s是调用第一个api）完成了task1，它并没有等待， 而是继续开始做task4。然后又过了1s， worker1完成了task2然后去开始做task5， 而此刻worker0完成了task4并开始去做task6， 又过了1s， worker2才完成了task3然后去做task7......可以看到每个worker都在争先恐后地完成任务， 直到所有任务全部完成， 总共花了8s时间。 


# 重新实现并发访问API
这里我将最早串行访问API接口的代码改成并发执行， 没有做限流， 读者可根绝前文分析修改成限流版本，就当留作小练习吧。
```js
const axios = require("axios");

function getFirst10TopicsIncludeFirstReplyAuthor() {
  return axios
    .get("https://cnodejs.org/api/v1/topics?limit=10")
    .then(function(response) {
      const json = response.data;
      const first10 = json.data.map(topic => {
        return {
          id: topic.id,
          title: topic.title,
          date: topic.create_at,
          author: topic.author.loginname
        };
      });

      const promises = first10.map(data => {
        return axios
          .get(`https://cnodejs.org/api/v1/topic/${data.id}`)
          .then(response => {
            const json = response.data;
            const firstReply = json.data.replies[0];
            return {
              id: json.data.id,
              firstReplyAuthor: firstReply && firstReply.author.loginname
            };
          });
      });
      return Promise.all(promises).then(rs => {
        const map = rs.reduce((acc, e) => {
          acc.set(e.id, e);
          return acc;
        }, new Map());
        for (let topic of first10) {
          topic.firstReplyAuthor = map.get(topic.id).firstReplyAuthor;
        }
        return first10;
      });
    })
    .catch(function(error) {
      console.log(error);
    });
}

getFirst10TopicsIncludeFirstReplyAuthor().then(data => console.log(data));
```

# Go语言实现
其实Go跟Promise没啥关系， 只是最近刚好在用Go语言做东西， 因此拿来对比一下。Go里面很容易实现限流的功能，这里直接贴上代码，不做过多分析。
```go
package main

import (
	"fmt"
	"time"
)

const start = time.Now().Unix()

func mockAPI(result int, duration time.Duration) int {
	fmt.Println(result, duration)
	time.Sleep(duration)
	return result
}

func worker(id int, jobs <-chan int, result chan<- int) {
	for job := range jobs {
		t := job % 3
		if t == 0 {
			t = 3
		}
		r := mockAPI(job, (time.Duration)(t)*time.Second)
		diff := time.Now().Unix() - start
		fmt.Printf("%d completes at time: %ds, by worker%d\n", r, diff, id)
		result <- r
	}
}
func main() {
	t1 := time.Now().Unix()

	jobs := make(chan int, 10)
	result := make(chan int, 10)
	total := mockAPI(10, 1*time.Second)

	const MaxCurrency = 3
	for i := 0; i < MaxCurrency; i++ {
		go worker(i, jobs, result)
	}

	for i := 1; i <= total; i++ {
		jobs <- i
	}
	close(jobs)

	rs := make([]int, total)
	for i := 0; i < total; i++ {
		r := <-result
		rs[i] = r
	}

	t2 := time.Now().Unix()
	fmt.Printf("total cost: %ds.\n", (t2 - t1))
	fmt.Println(rs)
}
```
执行输出如下：
```bash
➜  chap8 go run currency-rate-limit2.go
10 1s
1 1s
2 2s
3 3s
1 completes at time: 2s, by worker0
4 1s
4 completes at time: 3s, by worker0
2 completes at time: 3s, by worker2
5 2s
6 3s
3 completes at time: 4s, by worker1
7 1s
7 completes at time: 5s, by worker1
8 2s
5 completes at time: 5s, by worker0
9 3s
6 completes at time: 6s, by worker2
10 1s
8 completes at time: 7s, by worker1
10 completes at time: 7s, by worker2
9 completes at time: 8s, by worker0
total cost: 8s.
[1 4 2 3 7 5 6 8 10 9]
```

# 参考资料
* https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise
* https://yar999.gitbooks.io/gopl-zh/content/ch8/ch8-06.html