---
title: 让代码飞起来——高性能Julia学习笔记（五）
draft: false
tags: [julia, hpc]
category: Julia
date: "2018-12-19T22:33:42Z"
---

总结一下最近在用 Julia 开发中遇到的一些优化相关问题。

<!-- more -->

先说一下我优化代码的整体思路， 大概按照下面几个步骤做的：

1. 简单粗暴实现
2. 写 tests 确保实现正确
3. 测试看性能是否满足， 如果满足，可以约妹纸去了
4. 不满足， 分析性能差距有多大， 不同的差距采用方法差异蛮大
5. 用 Profile 工具分析代码瓶颈在哪里
6. 针对热点代码写 benchmark，然后有针对性的优化
7. 上并发或者多机器分布式
8. 用第 2 步的 tests 验证优化过的代码依然正确！！！

留个问题， 如果第 4 步分析发现性能差距分别是 30%, 2 倍， 10 倍， 100 倍， 10000 倍， 你会怎么做？

==================================

# 简单粗暴实现

现在的硬件性能很强大， 很多时候超乎你的想象， 也许简单的实现就能满足性能要求了。

> Premature optimization is the root of all evil -- DonaldKnuth

http://wiki.c2.com/?PrematureOptimization

可以看看这个讨论[「过早的优化是万恶之源」这种说法对不对，为什么？](https://www.zhihu.com/question/24282796)

# 写 tests 确保实现正确

记得一位大牛说过类似的话：“如果不用保证正确， 我可以做到最快！”（没查到出处， 有知道的可以告知~）

一开始简单版本由于代码简单， 容易分析， 再加上一些 test cases， 能比较容易保证代码的正确性。 这步的 test cases 很重要， 可以作为基准， 来**验证后面优化过的代码是否正确**。

# 测试看性能是否满足要求

前面一步基本也能看出代码性能是否够用了， 如果需要的话， 也可以做进一步的性能测试或者压力测试。

道理很简单， 如果满足的话就不用优化啦！ 任何事情都是要付出代价的， 需要权衡人力成本还是机器成本更高。

# 看性能差距有多大

性能差距不同，优化方式差别相当大！

比如性能还差 10000 倍， 然后你就去搞并发或分布式那就是方向错了， 因为哪怕能做到完全线性扩展， 那也意味着要增加 10000 倍的机器啊！这个时候应该主要考虑两个方向：

1. 优化算法， 降低复杂度， 比如把 O(n`*`n)优化成 O(n)
2. 想办法减小输入 N， 比如把输入从 10000 变成 100， 这个更多地是需要对业务问题的深入分析， 了解真正的需求

这两个结合完全能产生质的飞跃。 举个案例， 以前我们有数据需要同步和备份以及一些统计工作， 数据量级大概是 30w， 每天晚上要跑 8 个小时左右。 我觉得很不可思议，开了次会一起讨论分析问题， 发现之前每次都是做全量同步， 并且算法是 O(n`*`n)的。 经过分析，我们发现只需要做当天的增量数据，大概在 2k 左右， 大家就可以自己估算一下能提高多少倍了。 当时我算了下，在会议上就说应该能做到几秒， 大家都不相信。我们来看看怎么算的。 由于算法复杂度是 O(n`*`n)， 输入 N 从 30w 降到 2k，输入 N 减小了`30w / 2k == 150`倍， 由于平方的关系， 性能提升应该大概在`150 * 150 == 22500`即 2w 多倍，即时间可以缩短到`8 * 3600 / 2w ~= 1.5s`左右。 最后结果， 代码改动大概就是 10 行左右，最后时间在 1min 内， 因为还有一些启动开销等， 本来还可以进一步优化的， 不过几分钟已经完全在我们可接受范围内了。 注意并不是所有问题都可以这样算的， 因为可能有系数在里面，大 O 分析法会省略掉系数， 但分析思路类似， 根据对问题的理解程度， 如果能把系数算进去， 那就更准确了。

算法设计听上去好像很高大上的， 其实很多时候没有那么复杂，关键在于**深刻理解业务！** 以前在鹅厂的时候有个同事花了好些时间来调试 JVM 参数， 最后发现还不如默认参数性能好 😢， Leader 也说他以前在阿里专门做 JVM 优化的， 但是很多时候完全不如深刻理解业务之后改善代码来得快和有效。

10 倍以内的差距， 如果是算法能做到完全并发运行（比如 monte carlo 模拟计算 PI）， 那基本都是可以靠并发来搞定的。 毕竟现在搞个 10 核以上的 server 还是很容易的， 当然我们不会一上来就搞并发， 还是建议把单线程版本优化好再说， 因为并发代码不太好写，容易有 bug， 不到万不得已最好不上。

# Profile

头痛医脚没有用， 得用工具分析代码瓶颈在哪里， 才能对症下药。 有很多工具可用， 我这里主要用了 Julia 自带的[Profile 包](https://docs.julialang.org/en/v1.0/manual/profile/)， 原理是[statistical profiler](<https://en.wikipedia.org/wiki/Profiling_(computer_programming)>)， 好处是不用改代码。 另外用了对应的可视化工具[ProfileView](https://github.com/timholy/ProfileView.jl)，画出 Profile 的[Flame Graph](https://github.com/brendangregg/FlameGraph)。 注意，ProfileView 自带的 GTK UI 有问题（在我的 Mac 上， 不知道 Linux 下如何）， 很难看！！！导致我一度放弃了它， 后来发现， 在 Notebook 里面显示成 SVG 图片很清晰， 也可以用`ProfileView.svgwrite("perf.svg")`直接保存成 svg 文件， 然后在浏览器里查看。

# benchmark 优化热点代码

用 Profile 找到耗时最多的部分代码， 然后就可以开始优化了。 假设代码很多， 如果每次改一点代码又要编译、读取配置等等一系列前戏， 效率会大打折扣。 所以建议的方式是把分析得到的热点代码抽取出来， 比如重构成一个函数， 或者写一个类似的简单 case， 然后对这部分代码做 benchmark。 工具我主要用了 Julia 自带的`@time`， `BenchmarkTools`的`@benchmark`等。

另外内存分配过多也会导致性能问题， 因为内存读取速度会拖累 CPU， 以及 GC 等。 Profile 也可以分析内存占用的， 具体可以参考https://docs.julialang.org/en/v1.0/manual/profile/#Memory-allocation-analysis-1。

这步和上一步 Profile 是需要反复迭代的， 也就是说优化了部分代码之后需要重新做 Profile， 因为这时候耗费时间过多的代码可能变了（变了说明优化有效果啊！）

# 并发/分布式

如果前面的都搞过了， 还是差一些性能， 这时候就可以上并发甚至多机器了。我的程序暂时单线程够了， 所以暂时没有做并发设计， 需要的可以参考[让代码飞起来——高性能 Julia 学习笔记（四）](https://magicly.me/hpc-julia-4/)

小声地说， Julia 的并发不如 Go 好用。

# 验证优化过的代码正确

这步很重要， 如果优化了半天发现代码不正常 work 了， 那啥用都没有。 而这时候第二步的 test cases 就发挥作用了。 你甚至可以产生大量随机 test cases， 然后对比简单算法和优化算法的结果， 来进一步验证优化算法的正确性。 这个有点类似 property-based testing， 不过我找了两个 Property-Based Testing 的工具库， 都已经很久没更新了。

- https://github.com/pao/QuickCheck.jl
- https://github.com/pkalikman/Checkers.jl

# Julia 中的一些优化技巧

这里是自己遇到的一些影响性能的地方， 整理一下。

## closure 的性能问题

在[《Julia High Performance》](https://www.packtpub.com/application-development/julia-high-performance)那本书里说 Julia0.5 之前 closure 有性能问题， 之后没有了， 所以当时没有测试。 我们来看看事实上呢。我们先来看一下`filter`测试情况：

```bash
➜  sth-great git:(master) ✗ julia
               _
   _       _ _(_)_     |  Documentation: https://docs.julialang.org
  (_)     | (_) (_)    |
   _ _   _| |_  __ _   |  Type "?" for help, "]?" for Pkg help.
  | | | | | | |/ _` |  |
  | | |_| | | | (_| |  |  Version 1.0.1 (2018-09-29)
 _/ |\__'_|_|_|\__'_|  |  Official https://julialang.org/ release
|__/                   |

julia> arr = rand(1_000_000);

julia> f = x -> x > 0.5
#3 (generic function with 1 method)

julia> g(x) = x > 0.5
g (generic function with 1 method)

julia> @time filter(x -> x > 0.5, arr);
  0.028835 seconds (45.30 k allocations: 7.290 MiB)

julia> @time filter(x -> x > 0.5, arr);
  0.019552 seconds (9.14 k allocations: 5.431 MiB, 261.76% gc time)

julia> @time filter(f, arr);
  0.021460 seconds (9.12 k allocations: 5.430 MiB)

julia> @time filter(f, arr);
  0.012723 seconds (23 allocations: 5.001 MiB)

julia> @time filter(g, arr);
  0.018273 seconds (9.13 k allocations: 5.431 MiB)

julia> @time filter(g, arr);
  0.013385 seconds (23 allocations: 5.001 MiB, 25.46% gc time)
```

这里每个 filter 都执行了两遍， 因为第一遍的时候会做 JIT 编译， 测试不准。 可以看出`f`和`g`基本没差别， 但是`x -> x > 0.5`用时多 50%左右， 最主要的是有 9k 多`allocations`， 触发了大量 GC。 我们很容易想到， 很可能是每次`x -> x > 0.5`都是重新生成的， 有初始 JIT 所以慢。那我们来 for 循环一下试试：

```bash
julia> @time (for i=1:100 filter(x -> x > 0.5, arr) end)
  1.172873 seconds (11.13 k allocations: 500.515 MiB, 4.27% gc time)

julia> @time (for i=1:100 filter(x -> x > 0.5, arr) end)
  1.172178 seconds (11.12 k allocations: 500.514 MiB, 4.19% gc time)

julia> @time (for i=1:100 filter(f, arr) end)
  1.162432 seconds (1.90 k allocations: 500.081 MiB, 4.01% gc time)

julia> @time (for i=1:100 filter(f, arr) end)
  1.164200 seconds (1.90 k allocations: 500.081 MiB, 4.01% gc time)

julia> @time (for i=1:100 filter(g, arr) end)
  1.158107 seconds (1.90 k allocations: 500.081 MiB, 4.08% gc time)

julia> @time (for i=1:100 filter(g, arr) end)
  1.163157 seconds (1.90 k allocations: 500.081 MiB, 4.02% gc time)
```

可以看到`x -> x > 0.5`跟`f`和`g`用时基本一致， 不过`allocations`多很多， 内存占用倒是差不多。

匿名函数又叫闭包(closure)， 是因为它可以使用外层范围的变量，看看呢：

```bash
julia> a = 0.5
0.5

julia> f = x -> x > a
#19 (generic function with 1 method)

julia> g(x) = x > a
g (generic function with 1 method)

julia> @time filter(x -> x > a, arr);
  0.051669 seconds (1.01 M allocations: 20.638 MiB, 4.78% gc time)

julia> @time filter(x -> x > a, arr);
  0.047630 seconds (1.01 M allocations: 20.604 MiB, 3.89% gc time)

julia> @time filter(f, arr);
  0.045506 seconds (1.01 M allocations: 20.603 MiB, 3.68% gc time)

julia> @time filter(f, arr);
  0.035238 seconds (1.00 M allocations: 20.260 MiB, 3.95% gc time)

julia> @time filter(g, arr);
  0.044379 seconds (1.01 M allocations: 20.602 MiB, 2.34% gc time)

julia> @time filter(g, arr);
  0.034505 seconds (1.00 M allocations: 20.260 MiB, 1.83% gc time)

julia> using BenchmarkTools

julia> @benchmark filter(x -> x > a, arr)
BenchmarkTools.Trial:
  memory estimate:  20.26 MiB
  allocs estimate:  1000019
  --------------
  minimum time:     32.308 ms (0.00% GC)
  median time:      33.973 ms (2.84% GC)
  mean time:        34.314 ms (3.61% GC)
  maximum time:     84.715 ms (60.76% GC)
  --------------
  samples:          146
  evals/sample:     1

julia> @benchmark filter(f, arr)
BenchmarkTools.Trial:
  memory estimate:  20.26 MiB
  allocs estimate:  1000019
  --------------
  minimum time:     32.716 ms (0.00% GC)
  median time:      34.645 ms (2.79% GC)
  mean time:        34.889 ms (3.56% GC)
  maximum time:     79.509 ms (57.77% GC)
  --------------
  samples:          144
  evals/sample:     1

julia> @benchmark filter(g, arr)
BenchmarkTools.Trial:
  memory estimate:  20.26 MiB
  allocs estimate:  1000019
  --------------
  minimum time:     31.883 ms (0.00% GC)
  median time:      33.647 ms (2.90% GC)
  mean time:        33.972 ms (3.68% GC)
  maximum time:     80.302 ms (59.02% GC)
  --------------
  samples:          148
  evals/sample:     1
```

可以看到， 单次测试还是`f`和`g`略快， `@benchmark`测试基本一致（跟之前 for 一样）。 另外注意， **有闭包之后慢了 3 倍！而如果将引用的变量声明为 const 则没有性能影响！**

```bash
julia> a = 0.5
0.5

julia> const b = 0.5
0.5

julia> @benchmark filter(x -> x > 0.5, arr)
BenchmarkTools.Trial:
  memory estimate:  5.00 MiB
  allocs estimate:  19
  --------------
  minimum time:     9.023 ms (0.00% GC)
  median time:      11.367 ms (0.00% GC)
  mean time:        11.543 ms (3.14% GC)
  maximum time:     24.085 ms (40.82% GC)
  --------------
  samples:          422
  evals/sample:     1

julia> @benchmark filter(x -> x > a, arr)
BenchmarkTools.Trial:
  memory estimate:  20.26 MiB
  allocs estimate:  1000019
  --------------
  minimum time:     31.830 ms (0.00% GC)
  median time:      33.208 ms (2.13% GC)
  mean time:        33.704 ms (3.20% GC)
  maximum time:     83.375 ms (60.70% GC)
  --------------
  samples:          149
  evals/sample:     1

julia> @benchmark filter(x -> x > b, arr)
BenchmarkTools.Trial:
  memory estimate:  5.00 MiB
  allocs estimate:  19
  --------------
  minimum time:     9.026 ms (0.00% GC)
  median time:      11.348 ms (0.00% GC)
  mean time:        11.569 ms (3.15% GC)
  maximum time:     25.467 ms (44.87% GC)
  --------------
  samples:          421
  evals/sample:     1
```

我们来对`map`做同样的测试：

```bash
julia> f = x -> x > 0.5
#37 (generic function with 1 method)

julia> g(x) = x > 0.5
g (generic function with 1 method)

julia> @time map(x -> x > 0.5, arr);
  0.060464 seconds (171.03 k allocations: 9.731 MiB, 5.57% gc time)

julia> @time map(x -> x > 0.5, arr);
  0.029411 seconds (64.15 k allocations: 4.154 MiB)

julia> @time map(f, arr);
  0.028851 seconds (64.14 k allocations: 4.154 MiB)

julia> @time map(f, arr);
  0.001084 seconds (7 allocations: 976.875 KiB)

julia> @time map(g, arr);
  0.032143 seconds (64.13 k allocations: 4.153 MiB)

julia> @time map(g, arr);
  0.001466 seconds (7 allocations: 976.875 KiB)

julia> @benchmark map(x -> x > 0.5, arr)
BenchmarkTools.Trial:
  memory estimate:  976.72 KiB
  allocs estimate:  3
  --------------
  minimum time:     356.790 μs (0.00% GC)
  median time:      430.377 μs (0.00% GC)
  mean time:        629.226 μs (6.08% GC)
  maximum time:     42.809 ms (96.84% GC)
  --------------
  samples:          7862
  evals/sample:     1

julia> @benchmark map(f, arr)
BenchmarkTools.Trial:
  memory estimate:  976.72 KiB
  allocs estimate:  3
  --------------
  minimum time:     355.874 μs (0.00% GC)
  median time:      426.211 μs (0.00% GC)
  mean time:        624.084 μs (6.13% GC)
  maximum time:     44.555 ms (97.13% GC)
  --------------
  samples:          7927
  evals/sample:     1

julia> @benchmark map(g, arr)
BenchmarkTools.Trial:
  memory estimate:  976.72 KiB
  allocs estimate:  3
  --------------
  minimum time:     356.133 μs (0.00% GC)
  median time:      427.100 μs (0.00% GC)
  mean time:        627.243 μs (6.11% GC)
  maximum time:     43.161 ms (97.11% GC)
  --------------
  samples:          7888
  evals/sample:     1
```

结论跟`filter`一致。 注意，这里发现`@benchmark`测出的平均时间比`@time`测试快不少，所以严格的测试还是用`@benchmark`吧， 多次测试求平均值可以减小误差。

看看如果是闭包呢：

```bash
julia> a = 0.5
0.5

julia> f = x -> x > a
#50 (generic function with 1 method)

julia> g(x) = x > a
g (generic function with 1 method)

julia> @time map(x -> x > a, arr);
  0.089585 seconds (1.13 M allocations: 22.754 MiB, 3.82% gc time)

julia> @time map(x -> x > a, arr);
  0.071905 seconds (1.08 M allocations: 20.023 MiB, 3.33% gc time)

julia> @time map(f, arr);
  0.073778 seconds (1.08 M allocations: 20.021 MiB, 3.53% gc time)

julia> @time map(f, arr);
  0.030808 seconds (1.00 M allocations: 16.213 MiB, 5.47% gc time)

julia> @time map(g, arr);
  0.062590 seconds (1.07 M allocations: 19.557 MiB)

julia> @time map(g, arr);
  0.028448 seconds (1.00 M allocations: 16.213 MiB, 7.78% gc time)

julia> @benchmark map(x -> x > a, arr)
BenchmarkTools.Trial:
  memory estimate:  16.21 MiB
  allocs estimate:  1000004
  --------------
  minimum time:     26.114 ms (0.00% GC)
  median time:      27.366 ms (2.29% GC)
  mean time:        27.827 ms (2.91% GC)
  maximum time:     76.483 ms (64.59% GC)
  --------------
  samples:          180
  evals/sample:     1

julia> @benchmark map(f, arr)
BenchmarkTools.Trial:
  memory estimate:  16.21 MiB
  allocs estimate:  1000004
  --------------
  minimum time:     25.000 ms (0.00% GC)
  median time:      26.178 ms (2.22% GC)
  mean time:        26.734 ms (2.99% GC)
  maximum time:     77.583 ms (66.06% GC)
  --------------
  samples:          187
  evals/sample:     1

julia> @benchmark map(g, arr)
BenchmarkTools.Trial:
  memory estimate:  16.21 MiB
  allocs estimate:  1000004
  --------------
  minimum time:     25.400 ms (0.00% GC)
  median time:      26.453 ms (2.41% GC)
  mean time:        26.837 ms (3.00% GC)
  maximum time:     75.473 ms (64.37% GC)
  --------------
  samples:          187
  evals/sample:     1
```

结论一致。 注意这里有闭包居然慢了 40 倍？！！

## for 里创建函数

我代码中有个需求类似如下：

```bash
julia> @time for i = 1:100
           filter(x -> x > i, arr)
           # do sth with t...
       end
  2.721623 seconds (100.01 M allocations: 1.491 GiB, 1.96% gc time)
```

根据前面分析， 我们知道高阶函数里面如果有闭包的话， 速度会慢很多。 我们改成其他两种方式看看呢：

```bash
julia> @time for i = 1:100
           f = x -> x > i
           t = filter(f, arr)
           # do sth with t...
       end
  2.621243 seconds (100.01 M allocations: 1.490 GiB, 2.04% gc time)

julia> @time for i = 1:100
           g(x) = x > i
           t = filter(g, arr)
           # do sth with t...
       end
  2.605301 seconds (100.01 M allocations: 1.491 GiB, 2.06% gc time)
```

发现差别不大。分析一下我们会发现， 我们在每次循环的时候都构造了一个闭包， 能不能避免呢？ 改成如下形式：

```bash
julia> h(i) = (g(x) = x > i)
h (generic function with 1 method)

julia> @time for i = 1:100
           filter(h(i), arr)
       end
  0.147412 seconds (8.00 k allocations: 356.791 KiB)
```

发现快了 20 倍， 内存分配也少了很多。这里`h`是一个高阶函数， 也可以如下写， 影响不大：

```bash
julia> h2(i) = x -> x > i
h2 (generic function with 1 method)

julia> h3 = i -> x -> x > i
#185 (generic function with 1 method)

julia> @time for i = 1:100
           filter(h2(i), arr)
       end
  0.148064 seconds (9.37 k allocations: 424.852 KiB)

julia> @time for i = 1:100
           filter(h3(i), arr)
       end
  0.142815 seconds (10.02 k allocations: 463.371 KiB)
```

如果`for`循环更多， 差距更明显：

```bash
julia> @time for i = 1:1000
           g(x) = x > i
           t = filter(g, arr)
           # do sth with t...
       end
 26.459115 seconds (1.00 G allocations: 14.902 GiB, 2.05% gc time)

julia> @time for i = 1:1000
           filter(h(i), arr)
       end
  1.368000 seconds (2.00 k allocations: 93.750 KiB)
```

## slice 会 copy 数据

准确来说我的需求更像如下代码：

```bash
julia> @time for i = 1:1000
           filter(h(i), arr[i:end])
       end
  3.436154 seconds (6.00 k allocations: 7.447 GiB, 17.16% gc time)
```

可以看到， 其实我每次 filter 的数据是越来越少的， 但是居然时间是 2 倍多， 并且又巨大的内存开销。 为什么呢？ 原来 Julia 中选取 Array 的部分数据很简单， 用`arr[i:j]`即可， 但是容易造成性能问题， 因为 slice 是会 copy 数据的：

```bash
julia> t = [1, 2, 3, 4]
4-element Array{Int64,1}:
 1
 2
 3
 4

julia> t2 = t[2:3]
2-element Array{Int64,1}:
 2
 3

julia> t2[1] = 100
100

julia> t2
2-element Array{Int64,1}:
 100
   3

julia> t
4-element Array{Int64,1}:
 1
 2
 3
 4
```

可以用`view`方法， 避免 copy 数据：

```bash
julia> t
4-element Array{Int64,1}:
 1
 2
 3
 4

julia> t3 = view(t, 2:3)
2-element view(::Array{Int64,1}, 2:3) with eltype Int64:
 2
 3

julia> t3[1] = 100
100

julia> t3
2-element view(::Array{Int64,1}, 2:3) with eltype Int64:
 100
   3

julia> t
4-element Array{Int64,1}:
   1
 100
   3
   4
```

简单测试一下 view 的性能：

```bash
julia> farr(x) = for i = 1:1000
           sum(x)
       end
farr (generic function with 1 method)

julia> fcopy(x) = for i = 1:1000
           sum(x[i:end])
       end
fcopy (generic function with 1 method)

julia> fview(x) = for i = 1:1000
           sum(view(x, i:length(x)))
       end
fview (generic function with 1 method)

julia> @time farr(arr)
  0.267638 seconds (14.94 k allocations: 769.513 KiB)

julia> @time farr(arr)
  0.261006 seconds (4 allocations: 160 bytes)

julia> @time fcopy(arr)
  2.097589 seconds (22.14 k allocations: 7.448 GiB, 22.78% gc time)

julia> @time fcopy(arr)
  2.070468 seconds (2.00 k allocations: 7.447 GiB, 22.67% gc time)

julia> @time fview(arr)
  0.273552 seconds (18.41 k allocations: 929.018 KiB)

julia> @time fview(arr)
  0.260943 seconds (1.00 k allocations: 47.031 KiB)
```

可以看到`view`会高效很多！

把我的代码改成`view`来测试一下：

```bash
julia> len = length(arr)
1000000

julia> g(x) = x > 0.5
g (generic function with 1 method)

julia> @time for i = 1:100
           filter(g, arr)
       end
  1.239709 seconds (11.00 k allocations: 500.510 MiB, 4.81% gc time)

julia> @time for i = 1:100
           filter(g, arr[i:end])
       end
  1.179798 seconds (2.30 k allocations: 1.233 GiB, 6.87% gc time)

julia> @time for i = 1:100
           filter(g, view(arr, i:len))
       end
  7.295466 seconds (249.82 M allocations: 6.424 GiB, 19.91% gc time)

julia> @time for i = 1:100
           filter(g, view(arr, i:len))
       end
  6.722364 seconds (249.74 M allocations: 6.420 GiB, 13.43% gc time)
```

性能居然比用`arr[i:j]`还差很多？！！！ 原因我猜测是因为[view](https://github.com/JuliaLang/julia/blob/099e826241fca365a120df9bac9a9fede6e7bae4/base/subarray.jl#L144-L149)会构造额外的对象， 有一定 overhead，而这里 filter 出来的数据（filter 本身返回的是新数组）又很多，所以 view 没有占到多大优势（额外的对象变成了劣势）。 这个我还没太搞懂为什么， 有知道原因的读者， 欢迎留言讨论， 谢谢~

另外， 官方文档说[Copying data is not always bad](https://docs.julialang.org/en/v1.0/manual/performance-tips/#Copying-data-is-not-always-bad-1)， 难道 filter 跟 view 搭配不当？！

## map 不是多线程的

之前在[让代码飞起来——高性能 Julia 学习笔记（四）](https://magicly.me/hpc-julia-4/)我说测试发现 map 和 pmap 差别不大， 因为 map 自己用了多线程， 这个是不对的， 实际上是那次测试里面 map 用的函数`svdvals`本身用了多线程。

# 其他

编辑器我用的 VSCode， market 里的插件死活用不了， 报错说`Julia Server is busing`， 后来才发现原来只支持到 Julia 0.6， 泪奔。。。。后来[在论坛里看到作者发布了 beta 版支持 Julia 1.0](https://discourse.julialang.org/t/vs-code-extension-v0-11-0-beta-release/17541)， 需要去[github/julia release 页面](https://github.com/JuliaEditorSupport/julia-vscode/releases)自己下载然后离线安装。 作者是伯克利的教授， 好像最近比较忙吧。

另外也会使用[IJulia](https://github.com/JuliaLang/IJulia.jl)， 然后在 Jupyter 里写写实验代码。 Julia 的 REPL 也经常用， 配合https://github.com/KristofferC/OhMyREPL.jl 使用更舒适哦~

有人会问， 为啥不用官方支持的[Juno](http://junolab.org/)， 额， 其实我下了， 但是没太搞懂怎么用， 而且我日常都用 VSCode 啊。另外， 说实话也没觉得“官方”支持有多好呢， 貌似更新很不勤。

更新比较勤的有[兴趣使然千里冰封](https://www.zhihu.com/people/ice1000/activities)的https://github.com/ice1000/julia-intellij ， [bilibili 上有个介绍视频](https://www.bilibili.com/video/av33318860)， 提供了很多很有意思的特性， 让我想后面有空了以及更熟悉 Julia 了， 也去贡献点代码（不过可能是给 VSCode 哈哈）。

做实验很花时间， 这篇 blog 写了好几天， 有不足之处请指正。

欢迎加入知识星球一起分享讨论有趣的技术话题。

![星球jsforfun](/blogimgs/xq-jsforfun.jpg)
