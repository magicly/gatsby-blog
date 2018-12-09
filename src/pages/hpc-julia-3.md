---
title: 让代码飞起来——高性能Julia学习笔记（三）
draft: false
tags: [julia, hpc, monte carlo]
category: Julia
date: "2018-12-08T11:03:42Z"
---

前面两篇[让代码飞起来——高性能 Julia 学习笔记（一）](https://magicly.me/hpc-julia/) [让代码飞起来——高性能 Julia 学习笔记（二）](https://magicly.me/hpc-julia-2/)， 介绍了如何写出高性能的 Julia 代码， 这篇结合我最近的项目， 简单测试对比一下各种语言用 monte carlo 算法计算 pi 的效率。

<!-- more -->

首先声明一下， 本文不能算严格意义上的性能测试， 也不想挑起语言圣战， 个人能力有限， 实现的不同语言版本代码也未必是最高效的， 基本都是 naive 实现。

如果对 Monte Carlo 算法不熟悉， 可以参考下面两个资料， 我就不浪费时间重复了：

- https://zh.wikipedia.org/wiki/%E8%92%99%E5%9C%B0%E5%8D%A1%E7%BE%85%E6%96%B9%E6%B3%95
- http://www.ruanyifeng.com/blog/2015/07/monte-carlo-method.html

机器是 2015 年的 MacPro：

```js
Processor: 2.5GHz Intel Core i7
Memory: 16GB 1600 MHZ DDR3
Os: macOS High Sierra Version 10.13.4
```

# JS 版本

```js
function pi(n) {
  let inCircle = 0;
  for (let i = 0; i <= n; i++) {
    x = Math.random();
    y = Math.random();
    if (x * x + y * y < 1.0) {
      inCircle += 1;
    }
  }
  return (4.0 * inCircle) / n;
}
const N = 100000000;
console.log(pi(N));
```

结果：

```bash
➜  me.magicly.performance git:(master) ✗ node --version
v10.11.0
➜  me.magicly.performance git:(master) ✗ time node mc.js
3.14174988
node mc.js  10.92s user 0.99s system 167% cpu 7.091 total
```

# Go 版本

```go
package main

import (
	"math/rand"
)

func PI(samples int) (result float64) {
	inCircle := 0
	r := rand.New(rand.NewSource(42))

	for i := 0; i < samples; i++ {
		x := r.Float64()
		y := r.Float64()
		if (x*x + y*y) < 1 {
			inCircle++
		}
	}

	return float64(inCircle) / float64(samples) * 4.0
}

func main() {
	samples := 100000000
	PI(samples)
}
```

结果：

```bash
➜  me.magicly.performance git:(master) ✗ go version
go version go1.11 darwin/amd64
➜  me.magicly.performance git:(master) ✗ time go run monte_carlo.go
go run monte_carlo.go  2.17s user 0.10s system 101% cpu 2.231 total
```

# C 版本

```c
#include <stdlib.h>
#include <stdio.h>
#include <math.h>
#include <string.h>
#define SEED 42

int main(int argc, char **argv)
{
  int niter = 100000000;
  double x, y;
  int i, count = 0;
  double z;
  double pi;

  srand(SEED);
  count = 0;
  for (i = 0; i < niter; i++)
  {
    x = (double)rand() / RAND_MAX;
    y = (double)rand() / RAND_MAX;
    z = x * x + y * y;
    if (z <= 1)
      count++;
  }
  pi = (double)count / niter * 4;
  printf("# of trials= %d , estimate of pi is %g \n", niter, pi);
}

```

结果：

```bash
➜  me.magicly.performance git:(master) ✗ gcc --version
Configured with: --prefix=/Applications/Xcode.app/Contents/Developer/usr --with-gxx-include-dir=/usr/include/c++/4.2.1
Apple LLVM version 9.1.0 (clang-902.0.39.2)
Target: x86_64-apple-darwin17.5.0
Thread model: posix
InstalledDir: /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin
➜  me.magicly.performance git:(master) ✗ gcc -O2 -o mc-pi-c mc-pi.c
➜  me.magicly.performance git:(master) ✗ time ./mc-pi-c
# of trials= 100000000 , estimate of pi is 3.14155
./mc-pi-c  1.22s user 0.00s system 99% cpu 1.226 total
```

# C++ 版本

```cpp
#include <iostream>
#include <cstdlib> //defines rand(), srand(), RAND_MAX
#include <cmath>   //defines math functions

using namespace std;

int main()
{
  const int SEED = 42;
  int interval, i;
  double x, y, z, pi;
  int inCircle = 0;

  srand(SEED);

  const int N = 100000000;
  for (i = 0; i < N; i++)
  {
    x = (double)rand() / RAND_MAX;
    y = (double)rand() / RAND_MAX;

    z = x * x + y * y;
    if (z < 1)
    {
      inCircle++;
    }
  }
  pi = double(4 * inCircle) / N;

  cout << "\nFinal Estimation of Pi = " << pi << endl;
  return 0;
}
```

结果：

```bash
➜  me.magicly.performance git:(master) ✗ c++ --version
Apple LLVM version 9.1.0 (clang-902.0.39.2)
Target: x86_64-apple-darwin17.5.0
Thread model: posix
InstalledDir: /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin
➜  me.magicly.performance git:(master) ✗ c++ -O2 -o mc-pi-cpp mc-pi.cpp
➜  me.magicly.performance git:(master) ✗ time ./mc-pi-cpp

Final Estimation of Pi = 3.14155
./mc-pi-cpp  1.23s user 0.01s system 99% cpu 1.239 total
```

# Julia 版本

```julia
function pi(N::Int)
  inCircle = 0
  for i = 1:N
      x = rand() * 2 - 1
      y = rand() * 2 - 1

      r2 = x*x + y*y
      if r2 < 1.0
          inCircle += 1
      end
  end

  return inCircle / N * 4.0
end

N = 100_000_000
println(pi(N))
```

结果：

```bash
➜  me.magicly.performance git:(master) ✗ julia
               _
   _       _ _(_)_     |  Documentation: https://docs.julialang.org
  (_)     | (_) (_)    |
   _ _   _| |_  __ _   |  Type "?" for help, "]?" for Pkg help.
  | | | | | | |/ _` |  |
  | | |_| | | | (_| |  |  Version 1.0.1 (2018-09-29)
 _/ |\__'_|_|_|\__'_|  |  Official https://julialang.org/ release
|__/                   |

julia> versioninfo()
Julia Version 1.0.1
Commit 0d713926f8 (2018-09-29 19:05 UTC)
Platform Info:
  OS: macOS (x86_64-apple-darwin14.5.0)
  CPU: Intel(R) Core(TM) i7-4870HQ CPU @ 2.50GHz
  WORD_SIZE: 64
  LIBM: libopenlibm
  LLVM: libLLVM-6.0.0 (ORCJIT, haswell)

➜  me.magicly.performance git:(master) ✗ time julia mc.jl
3.14179496
julia mc.jl  0.85s user 0.17s system 144% cpu 0.705 total
```

另外 Rust 开发环境升级搞出了点问题， 没弄好， 不过根据之前的经验， 我估计跟 C++差不多。

github 上找到一份对比， 包含了更多的语言， 有兴趣的可以参考一下https://gist.github.com/jmoiron/76d6afcd3bc49f30c18b ， LuaJIT 居然跟 Rust 差不多一样快， 跟 Julia 官网的 benchmark 比较一致https://julialang.org/benchmarks/ 。

另外实现了两个 Go 的并发版本：

```go
package main

import (
	"fmt"
	"math/rand"
	"runtime"
	"time"
)

type Job struct {
	n int
}

var threads = runtime.NumCPU()
var rands = make([]*rand.Rand, 0, threads)

func init() {
	fmt.Printf("cpus: %d\n", threads)
	runtime.GOMAXPROCS(threads)

	for i := 0; i < threads; i++ {
		rands = append(rands, rand.New(rand.NewSource(time.Now().UnixNano())))
	}
}

func MultiPI2(samples int) float64 {
	t1 := time.Now()

	threadSamples := samples / threads

	jobs := make(chan Job, 100)
	results := make(chan int, 100)

	for w := 0; w < threads; w++ {
		go worker2(w, jobs, results, threadSamples)
	}

	go func() {
		for i := 0; i < threads; i++ {
			jobs <- Job{
				n: i,
			}
		}
		close(jobs)
	}()

	var total int
	for i := 0; i < threads; i++ {
		total += <-results
	}

	result := float64(total) / float64(samples) * 4
	fmt.Printf("MultiPI2: %d times, value: %f, cost: %s\n", samples, result, time.Since(t1))
	return result
}
func worker2(id int, jobs <-chan Job, results chan<- int, threadSamples int) {
	for range jobs {
		// fmt.Printf("worker id: %d, job: %v, remain jobs: %d\n", id, job, len(jobs))
		var inside int
		// r := rand.New(rand.NewSource(time.Now().UnixNano()))
		r := rands[id]
		for i := 0; i < threadSamples; i++ {
			x, y := r.Float64(), r.Float64()

			if x*x+y*y <= 1 {
				inside++
			}
		}
		results <- inside
	}
}

func MultiPI(samples int) float64 {
	t1 := time.Now()

	threadSamples := samples / threads
	results := make(chan int, threads)

	for j := 0; j < threads; j++ {
		go func() {
			var inside int
			r := rand.New(rand.NewSource(time.Now().UnixNano()))
			for i := 0; i < threadSamples; i++ {
				x, y := r.Float64(), r.Float64()

				if x*x+y*y <= 1 {
					inside++
				}
			}
			results <- inside
		}()
	}

	var total int
	for i := 0; i < threads; i++ {
		total += <-results
	}

	result := float64(total) / float64(samples) * 4
	fmt.Printf("MultiPI: %d times, value: %f, cost: %s\n", samples, result, time.Since(t1))
	return result
}

func PI(samples int) (result float64) {
	t1 := time.Now()
	var inside int = 0
	r := rand.New(rand.NewSource(time.Now().UnixNano()))

	for i := 0; i < samples; i++ {
		x := r.Float64()
		y := r.Float64()
		if (x*x + y*y) < 1 {
			inside++
		}
	}

	ratio := float64(inside) / float64(samples)

	result = ratio * 4

	fmt.Printf("PI: %d times, value: %f, cost: %s\n", samples, result, time.Since(t1))

	return
}

func main() {
	samples := 100000000
	PI(samples)
	MultiPI(samples)
	MultiPI2(samples)
}
```

结果：

```bash
➜  me.magicly.performance git:(master) ✗ time go run monte_carlo.1.go
cpus: 8
PI: 100000000 times, value: 3.141778, cost: 2.098006252s
MultiPI: 100000000 times, value: 3.141721, cost: 513.008435ms
MultiPI2: 100000000 times, value: 3.141272, cost: 485.336029ms
go run monte_carlo.1.go  9.41s user 0.18s system 285% cpu 3.357 total
```

可以看出， 效率提升了 4 倍。 为什么明明有**8 个 CPU**， 只提升了 4 倍呢？ 其实我的 macpro 就是 4 核的， 8 是超线程出来的虚拟核，在 cpu 密集计算上并不能额外提升效率。 可以参考这篇文章： [物理 CPU、CPU 核数、逻辑 CPU、超线程](http://wulc.me/2016/01/06/%E7%89%A9%E7%90%86CPU%E3%80%81CPU%E6%A0%B8%E6%95%B0%E3%80%81%E9%80%BB%E8%BE%91CPU%E3%80%81%E8%B6%85%E7%BA%BF%E7%A8%8B/) 。

下一篇，我们就来看一下 Julia 中如何利用并行进一步提高效率。

欢迎加入知识星球一起分享讨论有趣的技术话题。

![星球jsforfun](/blogimgs/xq-jsforfun.jpg)
