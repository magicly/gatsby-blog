---
title: 前端高性能计算之二：asm.js & webassembly
draft: false
tags: [asm.js, webassembly]
category: FE
date: "2017-09-25T15:40:42Z"
---

[前一篇](/fe-hpc/webworkers)我们说了要解决高性能计算的两个方法，一个是并发用WebWorkers，另一个就是用更底层的静态语言。

2012年，Mozilla的工程师[Alon Zakai](https://twitter.com/kripken)在研究[LLVM](http://llvm.org/)编译器时突发奇想：能不能把C/C++编译成Javascript，并且尽量达到Native代码的速度呢？于是他开发了[Emscripten][Emscripten]编译器，用于将C/C++代码编译成Javascript的一个子集[asm.js][asm.js]，性能差不多是原生代码的50%。大家可以看看[这个PPT](http://kripken.github.io/mloc_emscripten_talk/)。

之后Google开发了[Portable Native Client][PNaCI]，也是一种能让浏览器运行C/C++代码的技术。
后来估计大家都觉得各搞各的不行啊，居然Google, Microsoft, Mozilla, Apple等几家大公司一起合作开发了一个面向Web的通用二进制和文本格式的项目，那就是[WebAssembly][WebAssembly]，官网上的介绍是：
> WebAssembly or wasm is a new portable, size- and load-time-efficient format suitable for compilation to the web.

> WebAssembly is currently being designed as an open standard by a W3C Community Group that includes representatives from all major browsers.

所以，[WebAssembly][WebAssembly]应该是一个前景很好的项目。我们可以看一下[目前浏览器的支持情况](https://caniuse.com/#search=webassembly)：
![can i use webassembly](/blogimgs/caniuse-webassembly.png)

<!-- more -->

# 安装Emscripten
访问https://kripken.github.io/emscripten-site/docs/getting_started/downloads.html

1\. 下载对应平台版本的SDK

2\. 通过emsdk获取最新版工具
  ```bash
  # Fetch the latest registry of available tools.
  ./emsdk update

  # Download and install the latest SDK tools.
  ./emsdk install latest

  # Make the "latest" SDK "active" for the current user. (writes ~/.emscripten file)
  ./emsdk activate latest

  # Activate PATH and other environment variables in the current terminal
  source ./emsdk_env.sh
  ```
3\. 将下列添加到环境变量PATH中
```
~/emsdk-portable
~/emsdk-portable/clang/fastcomp/build_incoming_64/bin
~/emsdk-portable/emscripten/incoming
```
4\. 其他

我在执行的时候碰到报错说`LLVM`版本不对，后来参考[文档](https://kripken.github.io/emscripten-site/docs/building_from_source/configuring_emscripten_settings.html)配置了`LLVM_ROOT`变量就好了，如果你没有遇到问题，可以忽略。
```bash
LLVM_ROOT = os.path.expanduser(os.getenv('LLVM', '/home/ubuntu/a-path/emscripten-fastcomp/build/bin'))
```

5\. 验证是否安装好

执行`emcc -v`，如果安装好会出现如下信息：
```bash
emcc (Emscripten gcc/clang-like replacement + linker emulating GNU ld) 1.37.21
clang version 4.0.0 (https://github.com/kripken/emscripten-fastcomp-clang.git 974b55fd84ca447c4297fc3b00cefb6394571d18) (https://github.com/kripken/emscripten-fastcomp.git 9e4ee9a67c3b67239bd1438e31263e2e86653db5) (emscripten 1.37.21 : 1.37.21)
Target: x86_64-apple-darwin15.5.0
Thread model: posix
InstalledDir: /Users/magicly/emsdk-portable/clang/fastcomp/build_incoming_64/bin
INFO:root:(Emscripten: Running sanity checks)
```

# Hello, WebAssembly!
创建一个文件`hello.c`：
```c
#include <stdio.h>
int main() {
  printf("Hello, WebAssembly!\n");
  return 0;
}
```
编译`C/C++`代码：
```bash
emcc hello.c
```
上述命令会生成一个`a.out.js`文件，我们可以直接用`Node.js`执行：
```bash
node a.out.js
```
输出
```bash
Hello, WebAssembly!
```
为了让代码运行在网页里面，执行下面命令会生成`hello.html`和`hello.js`两个文件，其中`hello.js`和`a.out.js`内容是完全一样的。
```bash
emcc hello.c -o hello.html
```
```bash
➜  webasm-study md5 a.out.js
MD5 (a.out.js) = d7397f44f817526a4d0f94bc85e46429
➜  webasm-study md5 hello.js
MD5 (hello.js) = d7397f44f817526a4d0f94bc85e46429
```
然后在浏览器打开hello.html，可以看到页面
![hello1.html](/blogimgs/hello1.png)

前面生成的代码都是`asm.js`，毕竟[Emscripten][Emscripten]是人家作者[Alon Zakai](https://twitter.com/kripken)最早用来生成`asm.js`的，默认输出`asm.js`也就不足为奇了。当然，可以通过option生成`wasm`，会生成三个文件：`hello-wasm.html`, `hello-wasm.js`, `hello-wasm.wasm`。
```bash
emcc hello.c -s WASM=1 -o hello-wasm.html
```
然后浏览器打开`hello-wasm.html`，发现报错`TypeError: Failed to fetch`。原因是`wasm`文件是通过`XHR`异步加载的，用`file:////`访问会报错，所以我们需要启一个服务器。
```bash
npm install -g serve
serve .
```
然后访问`http://localhost:5000/hello-wasm.html`，就可以看到正常结果了。

# 调用C/C++函数
前面的`Hello, WebAssembly!`都是`main`函数直接打出来的，而我们使用`WebAssembly`的目的是为了高性能计算，做法多半是用C/C++实现某个函数进行耗时的计算，然后编译成`wasm`，暴露给js去调用。

在文件`add.c`中写如下代码：
```c
#include <stdio.h>
int add(int a, int b) {
  return a + b;
}

int main() {
  printf("a + b: %d", add(1, 2));
  return 0;
}
```
有两种方法可以把`add`方法暴露出来给js调用。
## 通过命令行参数暴露API
```bash
emcc -s EXPORTED_FUNCTIONS="['_add']" add.c -o add.js
```
注意方法名`add`前必须加`_`。
然后我们可以在`Node.js`里面这样使用：
```js
// file node-add.js
const add_module = require('./add.js');
console.log(add_module.ccall('add', 'number', ['number', 'number'], [2, 3]));
```
执行`node node-add.js`会输出`5`。
如果需要在web页面使用的话，执行：
```bash
emcc -s EXPORTED_FUNCTIONS="['_add']" add.c -o add.html
```
然后在生成的`add.html`中加入如下代码：
```html
  <button onclick="nativeAdd()">click</button>
  <script type='text/javascript'>
    function nativeAdd() {
      const result = Module.ccall('add', 'number', ['number', 'number'], [2, 3]);
      alert(result);
    }
  </script>
```
然后点击button，就可以看到执行结果了。

`Module.ccall`会直接调用`C/C++`代码的方法，更通用的场景是我们获取到一个包装过的函数，可以在js里面反复调用，这需要用`Module.cwrap`，具体细节可以参看[文档](https://kripken.github.io/emscripten-site/docs/porting/connecting_cpp_and_javascript/Interacting-with-code.html#interacting-with-code-ccall-cwrap)。
```js
const cAdd = add_module.cwrap('add', 'number', ['number', 'number']);
console.log(cAdd(2, 3));
console.log(cAdd(2, 4));
```

## 定义函数的时候添加`EMSCRIPTEN_KEEPALIVE`
添加文件`add2.c`。
```c
#include <stdio.h>
#include <emscripten.h>

int EMSCRIPTEN_KEEPALIVE add(int a, int b) {
  return a + b;
}

int main() {
  printf("a + b: %d", add(1, 2));
  return 0;
}
```
执行命令：
```bash
emcc add2.c -o add2.html
```
同样在`add2.html`中添加代码：
```html
  <button onclick="nativeAdd()">click</button>
  <script type='text/javascript'>
    function nativeAdd() {
      const result = Module.ccall('add', 'number', ['number', 'number'], [2, 3]);
      alert(result);
    }
  </script>
```
但是，当你点击button的时候，报错：
```bash
Assertion failed: the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)
```
可以通过在`main()`中添加`emscripten_exit_with_live_runtime()`解决：
```c
#include <stdio.h>
#include <emscripten.h>

int EMSCRIPTEN_KEEPALIVE add(int a, int b) {
  return a + b;
}

int main() {
  printf("a + b: %d", add(1, 2));
  emscripten_exit_with_live_runtime();
  return 0;
}
```
或者也可以直接在命令行中添加`-s NO_EXIT_RUNTIME=1`来解决，
```bash
emcc add2.c -o add2.js -s NO_EXIT_RUNTIME=1
```
不过会报一个警告：
```bash
exit(0) implicitly called by end of main(), but noExitRuntime, so not exiting the runtime (you can use emscripten_force_exit, if you want to force a true shutdown)
```
所以建议采用第一种方法。

上述生成的代码都是`asm.js`，只需要在编译参数中添加`-s WASM=1`中就可以生成`wasm`，然后使用方法都一样。


# 用asm.js和WebAssembly执行耗时计算
前面准备工作都做完了， 现在我们来试一下用`C`代码来优化[前一篇](./webworkers)中提过的问题。代码很简单：
```c
// file sum.c
#include <stdio.h>
// #include <emscripten.h>

long sum(long start, long end) {
  long total = 0;
  for (long i = start; i <= end; i += 3) {
    total += i;
  }
  for (long i = start; i <= end; i += 3) {
    total -= i;
  }
  return total;
}

int main() {
  printf("sum(0, 1000000000): %ld", sum(0, 1000000000));
  // emscripten_exit_with_live_runtime();
  return 0;
}
```
注意用`gcc`编译的时候需要把跟`emscriten`相关的两行代码注释掉，否则编译不过。
我们先直接用`gcc`编译成`native code`看看代码运行多块呢？
```bash
➜  webasm-study gcc sum.c
➜  webasm-study time ./a.out
sum(0, 1000000000): 0./a.out  5.70s user 0.02s system 99% cpu 5.746 total
➜  webasm-study gcc -O1 sum.c
➜  webasm-study time ./a.out
sum(0, 1000000000): 0./a.out  0.00s user 0.00s system 64% cpu 0.003 total
➜  webasm-study gcc -O2 sum.c
➜  webasm-study time ./a.out
sum(0, 1000000000): 0./a.out  0.00s user 0.00s system 64% cpu 0.003 total
```
可以看到有没有优化差别还是很大的，优化过的代码执行时间是**3ms!**。really？仔细想想，我for循环了10亿次啊，每次for执行大概是两次加法，两次赋值，一次比较，而我总共做了两次for循环，也就是说至少是100亿次操作，而我的mac pro是`2.5 GHz Intel Core i7`，所以1s应该也就执行25亿次CPU指令操作吧，怎么可能逆天到这种程度，肯定是哪里错了。想起之前看到的[一篇rust测试性能的文章](http://ling0322.info/2014/01/20/rust-vs-go-in-code-optimization.html)，说rust直接在编译的时候算出了答案， 然后把结果直接写到了编译出来的代码里， 不知道gcc是不是也做了类似的事情。在知乎上[GCC中-O1 -O2 -O3 优化的原理是什么？](https://www.zhihu.com/question/27090458)这篇文章里， 还真有loop-invariant code motion（LICM）针对for的优化，所以我把代码增加了一些if判断，希望能“糊弄”得了gcc的优化。
```c
#include <stdio.h>
// #include <emscripten.h>

// long EMSCRIPTEN_KEEPALIVE sum(long start, long end) {
long sum(long start, long end) {
  long total = 0;
  for (long i = start; i <= end; i += 1) {
    if (i % 2 == 0 || i % 3 == 1) {
      total += i;
    } else if (i % 5 == 0 || i % 7 == 1) {
      total += i / 2;
    }
  }
  for (long i = start; i <= end; i += 1) {
    if (i % 2 == 0 || i % 3 == 1) {
      total -= i;
    } else if (i % 5 == 0 || i % 7 == 1) {
      total -= i / 2;
    }
  }
  return total;
}

int main() {
  printf("sum(0, 1000000000): %ld", sum(0, 100000000));
  // emscripten_exit_with_live_runtime();
  return 0;
}
```
执行结果大概要正常一些了。
```bash
➜  webasm-study gcc -O2 sum.c
➜  webasm-study time ./a.out
sum(0, 1000000000): 0./a.out  0.32s user 0.00s system 99% cpu 0.324 total
```
ok，我们来编译成`asm.js`了。
```c
#include <stdio.h>
#include <emscripten.h>

long EMSCRIPTEN_KEEPALIVE sum(long start, long end) {
// long sum(long start, long end) {
  long total = 0;
  for (long i = start; i <= end; i += 1) {
    if (i % 2 == 0 || i % 3 == 1) {
      total += i;
    } else if (i % 5 == 0 || i % 7 == 1) {
      total += i / 2;
    }
  }
  for (long i = start; i <= end; i += 1) {
    if (i % 2 == 0 || i % 3 == 1) {
      total -= i;
    } else if (i % 5 == 0 || i % 7 == 1) {
      total -= i / 2;
    }
  }
  return total;
}

int main() {
  printf("sum(0, 1000000000): %ld", sum(0, 100000000));
  emscripten_exit_with_live_runtime();
  return 0;
}
```
执行
```bash
emcc sum.c -o sum.html
```
然后在`sum.html`中添加代码
```html
  <button onclick="nativeSum()">NativeSum</button>
  <button onclick="jsSumCalc()">JSSum</button>
  <script type='text/javascript'>
    function nativeSum() {
      t1 = Date.now();
      const result = Module.ccall('sum', 'number', ['number', 'number'], [0, 100000000]);
      t2 = Date.now();
      console.log(`result: ${result}, cost time: ${t2 - t1}`);
    }
  </script>
  <script type='text/javascript'>
    function jsSum(start, end) {
      let total = 0;
      for (let i = start; i <= end; i += 1) {
        if (i % 2 == 0 || i % 3 == 1) {
          total += i;
        } else if (i % 5 == 0 || i % 7 == 1) {
          total += i / 2;
        }
      }
      for (let i = start; i <= end; i += 1) {
        if (i % 2 == 0 || i % 3 == 1) {
          total -= i;
        } else if (i % 5 == 0 || i % 7 == 1) {
          total -= i / 2;
        }
      }

      return total;
    }
    function jsSumCalc() {
      const N = 100000000;// 总次数1亿
      t1 = Date.now();
      result = jsSum(0, N);
      t2 = Date.now();
      console.log(`result: ${result}, cost time: ${t2 - t1}`);
    }
  </script>
```
另外，我们修改成编译成WebAssembly看看效果呢？
```bash
emcc sum.c -o sum.js -s WASM=1
```

|Browser|webassembly|asm.js|js|
|----|----|----|----|
|Chrome61|1300ms|600ms|3300ms|
|Firefox55|600ms|800ms|700ms|
|Safari9.1|不支持|2800ms|因不支持ES6我懒得改写没测试|

感觉Firefox有点不合理啊， 默认的JS太强了吧。然后觉得webassembly也没有特别强啊，突然发现`emcc`编译的时候没有指定优化选项`-O2`。再来一次：
```bash
emcc -O2 sum.c -o sum.js # for asm.js
emcc -O2 sum.c -o sum.js -s WASM=1 # for webassembly
```
|Browser|webassembly -O2|asm.js -O2|js|
|----|----|----|----|
|Chrome61|1300ms|600ms|3300ms|
|Firefox55|650ms|630ms|700ms|

居然没什么变化， 大失所望。号称`asm.js`可以达到native的50%速度么，这个倒是好像达到了。但是今年[Compiling for the Web with WebAssembly (Google I/O '17)](https://www.youtube.com/watch?v=6v4E6oksar0)里说WebAssembly是`1.2x slower than native code`，感觉不对呢。[asm.js][asm.js]还有一个好处是，它就是js，所以即使浏览器不支持，也能当成不同的js执行，只是没有加速效果。当然[WebAssembly][WebAssembly]受到各大厂商一致推崇，作为一个新的标准，肯定前景会更好，期待会有更好的表现。


# Rust
本来还想写Rust编译成WebAssembly的，不过感觉本文已经太长了， 后期再写如果结合Rust做WebAssembly吧。

着急的可以先看看这两篇
* [Compiling to the web with Rust and emscripten](https://users.rust-lang.org/t/compiling-to-the-web-with-rust-and-emscripten/7627)
* [Rust ⇋ JavaScript](https://www.slideshare.net/RReverser/rust-javascript)

# Refers
* http://asmjs.org/
* http://webassembly.org/
* https://kripken.github.io/emscripten-site/index.html
* https://developer.mozilla.org/en-US/docs/WebAssembly
* http://www.codepool.biz/emscripten-compile-cc-javascript.html
* http://www.ruanyifeng.com/blog/2017/09/asmjs_emscripten.html
* https://zhuanlan.zhihu.com/p/25865972


[Emscripten]: https://kripken.github.io/emscripten-site/index.html
[asm.js]: http://asmjs.org/
[WebAssembly]: http://webassembly.org/