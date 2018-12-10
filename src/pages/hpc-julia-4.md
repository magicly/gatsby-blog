---
title: 让代码飞起来——高性能Julia学习笔记（四）
draft: false
tags:
  [
    julia,
    hpc,
    coroutine,
    task,
    channel,
    distributed,
    multi-core,
    parallel computing,
  ]
category: Julia
date: "2018-12-09T15:53:42Z"
---

本文介绍 Julia 的并行计算。

<!-- more -->

Julia 中并行计算模型主要分为三大类：

1. Coroutines
2. Multi-Threading
3. Multi-Core or Distributed Processing

# Coroutines

Julia 中的 coroutine（又叫 task）跟 Golang 中的 goroutine 比较像， 都是通过 Channel 交换数据。 Julia 中用`put!`放数据到 channel 中， 用`take!`取出数据， 也可以用`fetch`取数据， 但是不会从 channel 中移除。 如果 channel 满了， `put!`会 block， 如果空了， `take!`会 block。

下面代码开 4 个 task 从 channel 中取任务去干活， 然后把结果放到 result channel 中：

```julia
function testTask()
  local jobs = Channel{Int}(32);
  local results = Channel{Tuple}(32);

  function do_work()
    for job_id in jobs
      exec_time = rand() # 随机模拟运行时间
      # exec_time = 1 # 模拟运行1s
      sleep(exec_time)
      put!(results, (job_id, exec_time))
    end
  end

  function make_jobs(n)
    for i in 1:n
      put!(jobs, i)
    end
  end

  n = 12
  @async make_jobs(n);

  for i in 1:4 # start 4 tasks to process requests in parallel
    @async do_work()
  end

  while n > 0 # print out results
    job_id, exec_time = take!(results)
    println("$job_id finished in $(round(exec_time; digits=2)) seconds")
    global n = n - 1
  end
end

@elapsed testTask()
```

从结果可以看出，4 个 task 是并发执行的， 所以并没有固定顺序：

```bash
julia> @elapsed testTask()
4 finished in 0.47 seconds
2 finished in 0.48 seconds
1 finished in 0.61 seconds
3 finished in 0.77 seconds
6 finished in 0.32 seconds
7 finished in 0.27 seconds
9 finished in 0.42 seconds
10 finished in 0.4 seconds
8 finished in 0.56 seconds
5 finished in 0.97 seconds
12 finished in 0.72 seconds
11 finished in 0.91 seconds
2.267828294
```

另一方面， 如果将`exec_time`修改为固定的 1s， 会发现， 任务执行顺序就是固定的四个一组结束：

```bash
julia> @elapsed testTask()
1 finished in 1.0 seconds
2 finished in 1.0 seconds
3 finished in 1.0 seconds
4 finished in 1.0 seconds
5 finished in 1.0 seconds
6 finished in 1.0 seconds
7 finished in 1.0 seconds
8 finished in 1.0 seconds
9 finished in 1.0 seconds
10 finished in 1.0 seconds
11 finished in 1.0 seconds
12 finished in 1.0 seconds
3.0843359
```

注意， **目前 Julia 中 Coroutine 是在一条 OS thread 上运行！**也就是说， 如果 task 是 IO 相关的， 能起到并发加速的效果， 而如果是 CPU 密集型的 task， 则没办法加速， 这是**跟 Golang 的 goroutine 不一样的地方！**未来 Julia 可能支持在多线程上调度 task，期待。

```julia
julia> function compute_heavy_task()
         s = 0.0
         for i in 1:1_000_000_000
           s += rand()
         end
         s
       end
compute_heavy_task (generic function with 1 method)

julia> @time compute_heavy_task()
  1.596225 seconds (14.23 k allocations: 758.379 KiB)
5.0000736245740527e8
```

把`sleep(exec_time)`换成`exec_time = compute_heavy_task()`， 得到如下结果：

```bash
julia> @elapsed testTask()
1 finished in 4.9999781134e8 seconds
2 finished in 5.0000293132e8 seconds
3 finished in 5.000143575e8 seconds
4 finished in 5.0000684308e8 seconds
5 finished in 5.0000281481e8 seconds
6 finished in 5.000030979e8 seconds
7 finished in 4.9998138774e8 seconds
8 finished in 5.0000503893e8 seconds
9 finished in 5.0000375256e8 seconds
10 finished in 5.0000053252e8 seconds
11 finished in 4.9999687391e8 seconds
12 finished in 5.00000324e8 seconds
19.740870708
```

可见完全没有加速， 各个 task 也是线性执行的。

# Multi-Threading

目前还处于实验阶段， 以后接口有可能变化， 暂时没管。

# Multi-Core or Distributed Processing

大部分现代 CPU 都是多核， 并且多台电脑可以连起来组成集群，充分发挥多 CPU 的能力能大大加速计算， Julia 自带的标准库[Distributed](https://docs.julialang.org/en/v1/stdlib/Distributed/)中包含了利用多核的工具。 要充分利用多核， 有两个重要因素会影响性能： CPU 的速度和内存访问速度。 比如在集群中， CPU 访问本机的内存当然是最快的。 在一台多核电脑上也有类似的问题， 因为访问内存和缓存速度差异很大。

Julia 提供的两个工具主要是：remote references 和 remote calls。 remotecall 调用会立即返回， 返回值是 Future，可以用 wait 等待结果返回并用 fetch 获取结果。

```julia
julia> r = remotecall(rand, 2, 2, 2)
Future(2, 1, 6, nothing)

julia> s = @spawnat 2 1 .+ fetch(r)
Future(2, 1, 7, nothing)

julia> fetch(s)
2×2 Array{Float64,2}:
 1.5203   1.35017
 1.67987  1.37962
```

注意， 在使用`remotecall`之前需要引入 Distributed， 最简单的方式就是启动的时候用`julia -p 2`， 这样会启动两个 worker 线程，否则就需要用如下方式引用以及自己添加线程：

```julia
julia> using Distributed

julia> addprocs(2)
2-element Array{Int64,1}:
 2
 3
```

`remotecall`和`@spawnat`属于比较低级的操作， 需要手动指定在哪个 worker 线程工作， 可以用`@spawn`宏来简化代码：

```julia
julia> @spawn rand(2, 2)
Future(2, 1, 4, nothing)

julia> r = @spawn rand(2, 2)
Future(2, 1, 5, nothing)

julia> s = @spawn 1 .+ fetch(r)
Future(2, 1, 6, nothing)

julia> fetch(r)
2×2 Array{Float64,2}:
 0.129915  0.280908
 0.838666  0.897632

julia> fetch(s)
2×2 Array{Float64,2}:
 1.12992  1.28091
 1.83867  1.89763
```

## Code Availability and Loading Packages

要想在不同 process 运行代码， 必须在那个 process 中能访问代码。

```julia
julia> function rand2(dims...)
                  return 2*rand(dims...)
              end
rand2 (generic function with 1 method)

julia> rand2(2,2)
2×2 Array{Float64,2}:
 0.664777  1.87325
 0.912612  0.741152

julia> @spawn rand2(2,2)
Future(2, 1, 9, nothing)

julia> r = @spawn rand2(2,2)
Future(2, 1, 10, nothing)

julia> fetch(r)
ERROR: On worker 2:
UndefVarError: #rand2 not defined
```

可以看出两点：

1. worker2 中访问不到 rand2 函数
2. @spawn 并没有立即执行代码， 会等到 fetch 的时候再去执行。 否则`r = @spawn rand(2, 2)`就报错了。

假设有一个文件`DummyModule.jl`：

```julia
module DummyModule

export MyType, f

mutable struct MyType
    a::Int
end

f(x) = x^2+1

println("loaded")

end
```

正确用法是：

```bash
julia> @everywhere include("DummyModule.jl")
loaded
      From worker 2:	loaded
      From worker 3:	loaded

julia> using .DummyModule

julia> MyType(7)
MyType(7)

julia> fetch(@spawnat 2 MyType(7))
ERROR: On worker 2:
UndefVarError: MyType not defined

julia> fetch(@spawnat 2 DummyModule.MyType(7))
MyType(7)
```

注意， 在本 process 中引入了 DummyModule(`using .DummyModule`)， 在其他 process 中还是没有， 需要用全名。

如果`DummyModule.jl`不是一个单独的文件而是一个 package， 则`using DummyModule`就会把`DummyModule.jl`加载到所有 process， 但是`DummyModule`只在使用`using DummyModule`的 process 中存在， 可以使用`@everywhere using DummyModule`让其在各个 process 中都可以访问。

## Starting and managing worker processes

Julia 有两种内置的集群类型：

- `julia -p n`启动的本地集群
- `--machine-file`启动的多机器集群， 会通过无密码 ssh 登录启动 worker processes

可以在引入`Distributed`包后修改 process：

```bash
julia> using Distributed

julia> workers()
1-element Array{Int64,1}:
 1

julia> addprocs(3)
3-element Array{Int64,1}:
 2
 3
 4

julia> workers()
3-element Array{Int64,1}:
 2
 3
 4

julia> procs()
4-element Array{Int64,1}:
 1
 2
 3
 4

julia> rmprocs(2)
Task (done) @0x000000011be6c910

julia> procs()
3-element Array{Int64,1}:
 1
 3
 4

julia> workers()
2-element Array{Int64,1}:
 3
 4
```

# Data Movement

发送消息和移动数据是分布式系统中最影响性能的部分， 减少数据发送能显著提升性能和扩展性。 `fetch`很明显会发送数据， `@spawn`也会发送数据， 比如下面两种方式差异很大。

方法一：

```bash
julia> A = rand(1000,1000);

julia> Bref = @spawn A^2;

julia> fetch(Bref)
```

方法二：

```bash
julia> Bref = @spawn rand(1000,1000)^2;

julia> fetch(Bref)
```

方法一种矩阵 A 是在本 process 中（id=1）生成的， 然后传递给 worker2， 计算完之后再把结果返回到 worker1 中。 而方法二， 矩阵是在 worker2 中生成的， 计算完之后再传递结果。 所以方法二传递数据远小于方法一。 根据不同的需求可能会选择不同的方式。

## Global variables

@spawn 和@remotecall 执行的代码可能会访问 global variables， `Main`模块里的 global variables 和其他模块的还不太一样。

```bash
julia> A = rand(10,10);

julia> remotecall_fetch(()->sum(A), 2)
48.7933186792873
```

上述代码`sum`会在 worker2 中执行， 由于 worker2 中没有`Main.A`， 所以会传递过去， 在 worker2 中生成`Main.A`， 即使`remotecall_fetch`结束后， worker2 中的`Main.A`还依然存在。 cluster 并不会同步各个 worker 的`Main.A`， 有可能结果是各个 worker 的`Main.A`不一致。

```julia
A = rand(10,10)
remotecall_fetch(()->sum(A), 2) # worker 2
A = rand(10,10)
remotecall_fetch(()->sum(A), 3) # worker 3
A = nothing
```

最后 worker2 和 worker3 的`Main.A`会不一样， 并且也跟`worker1`上的不一样。 并且 worker1 上的 A 会被垃圾回收， 而 worker2 和 worker3 上的不会， 可以使用`clear!`手动清楚某个全局变量（设为 nothing）。

所以在 remote call 中尽量不要访问全局变量， 如果一定要用， 可以用`let` blocks 来局域化全局变量：

```bash
julia> A = rand(10,10);

julia> remotecall_fetch(()->A, 2);

julia> B = rand(10,10);

julia> let B = B
           remotecall_fetch(()->B, 2)
       end;

julia> @everywhere using InteractiveUtils

julia> varinfo()
name                    size summary
–––––––––––––––– ––––––––––– ––––––––––––––––––––––
A                  840 bytes 10×10 Array{Float64,2}
B                  840 bytes 10×10 Array{Float64,2}
Base                         Module
Core                         Module
InteractiveUtils 160.463 KiB Module
Main                         Module
ans                  0 bytes Nothing

julia> @fetchfrom 2 varinfo()
name      size summary
–––– ––––––––– ––––––––––––––––––––––
A    840 bytes 10×10 Array{Float64,2}
Base           Module
Core           Module
Main           Module
```

可以看到， worker1 中有 A 和 B， 但是 worker2 中只有 A 没有 B。 注意， 需要引入`InteractiveUtils`才可以使用`@fetchfrom 2 varinfo()`， 不然会报错。 官网文档没有， 我是在https://discourse.julialang.org/t/how-may-i-send-data-to-other-processes-within-a-function/15080 找到的。

## Parallel Map and Loops

幸运地是， 很多时候并行计算不需要移动数据。比如 monte carlo 模拟， 因为可以把任务拆分成很多个独立的子任务， 每个子任务在不同的 process 运行， 最后再合并各自的结果即可。 将下列代码保存为`count_heads.jl`：

```julia
function count_heads(n)
  c = 0
  for i = 1:n
    c += rand(Bool)
  end
  c
end
```

然后在 REPL 中执行：

```bash
julia> @everywhere include("count_heads.jl")

julia> a = @spawn count_heads(1000000)
Future(2, 1, 22, nothing)

julia> b = @spawn count_heads(1000000)
Future(3, 1, 23, nothing)

julia> fetch(a) + fetch(b)
1000990
```

我们用`@spawn`启动了两个 process， 分别计算一个子任务， 然后在 worker1 中用`fetch`获取结果， 做最后的`reduction`。 如果要用到所有可用的 processes， 可以使用`@distributed`宏。

```julia
julia> nheads = @distributed (+) for i = 1:200000000
           Int(rand(Bool))
       end
100002166
```

```bash
help?> @distributed
  @distributed

  A distributed memory, parallel for loop of the form :

  @distributed [reducer] for var = range
      body
  end

  The specified range is partitioned and locally executed across all workers. In case an optional reducer function is specified, @distributed performs local reductions on
  each worker with a final reduction on the calling process.

  Note that without a reducer function, @distributed executes asynchronously, i.e. it spawns independent tasks on all available workers and returns immediately without
  waiting for completion. To wait for completion, prefix the call with @sync, like :

  @sync @distributed for var = range
      body
  end
```

注意， 这里的`[reducer]`应该满足结合律， 这样执行结果就跟执行顺序无关了， 因为并发时候迭代是乱序的。比如`+`改成`-`， 结果就会不稳定（跟 range 范围以及 process 数量有关）。

另外修改变量或数组也有问题， 因为迭代是在不同的 process 执行的， 用到的变量会 copy 一份到每一个 process。

```bash
julia> a = zeros(10)
10-element Array{Float64,1}:
 0.0
 0.0
 0.0
 0.0
 0.0
 0.0
 0.0
 0.0
 0.0
 0.0

julia> @distributed for i = 1:10
           a[i] = i
       end
Task (queued) @0x000000011ccfe890

julia> a
10-element Array{Float64,1}:
 0.0
 0.0
 0.0
 0.0
 0.0
 0.0
 0.0
 0.0
 0.0
 0.0
```

如果真的想修改的话， 可以用`SharedArrays`：

```bash
julia> using SharedArrays

julia> a = SharedArray{Float64}(10)

10-element SharedArray{Float64,1}:
 0.0
 0.0
 0.0
 0.0
 0.0
 0.0
 0.0
 0.0
 0.0
 0.0

julia> @distributed for i = 1:10
           a[i] = i
       end
Task (queued) @0x000000011ccfcfd0

julia> a
10-element SharedArray{Float64,1}:
  1.0
  2.0
  3.0
  4.0
  5.0
  6.0
  7.0
  8.0
  9.0
 10.0
```

当然，如果只是 read-only 的话， 还是可以的：

```bash
julia> f = x -> x * x
#3 (generic function with 1 method)

julia> a = 1:10
1:10

julia> @distributed (+) for i = 1:10
         f(a[i])
       end
385
```

如果没有`reducer`的话， 会生成大量的异步任务， 可以在开始加`@sync`来等待结果：

```bash
julia> @sync @distributed for i = 1:10
         println(f(a[i]))
       end
      From worker 3:	1
      From worker 2:	36
      From worker 2:	49
      From worker 2:	64
      From worker 2:	81
      From worker 2:	100
      From worker 3:	4
      From worker 3:	9
      From worker 3:	16
      From worker 3:	25
Task (done) @0x000000010ffd8d90
```

有时候我们就是不需要`reducer`，只是想做并行的 map， 就可以用`pmap`：

```bash
julia> M = Matrix{Float64}[rand(1000, 1000) for i = 1:100];

julia> using LinearAlgebra

julia> @time pmap(svdvals, M);
 15.820049 seconds (6.73 k allocations: 1.017 MiB)

julia> @time map(svdvals, M);
 22.572564 seconds (1.01 k allocations: 820.985 MiB, 0.63% gc time)

julia> procs()
5-element Array{Int64,1}:
 1
 2
 3
 4
 5
```

`pmap`和`@distributed for`都只用 worker processes 来计算， `@distributed for`中， 会用 calling process(比如 worker1)来做最后的 reduction。 上述代码中有 4 个 worker processes， 按理说`pmap`应该提速 4 倍才对？！ 运行发现， 用 pmap 的时候， 有 4 个 julia 进程跑到 100%， 而运行 map 的时候， 居然是有一个 julia 进程跑到差不多 400%！ 也就是说， map 本身做了多线程优化！

## Remote References / AbstractChannels / Channels and RemoteChannels

Remote references 指的是 AbstractChannels 的某种具体实现， 需要实现`put!`, `take!`, `fetch`, `isready`, `wait`方法。

Channel 和 RemoteChannel 都是 AbstractChannel 的实现。 Channel 只能在本 process 中访问， 因此 worker2 的不能访问 worker3 的 channel，反之亦然。 而 RemoteChannel 就可以跨 workers， 可以看成是 Channel 的 handle，它的 pid 表明了 backing store（比如 backing channel）所在的 process。 我们来修改一下最开始的 demo：

```julia
@everywhere function compute_heavy_task()
  s = 0.0
  for i in 1:1_000_000_000
    s += rand()
  end
  s
end
function testTaskParallel()
  local jobs = RemoteChannel(() -> Channel{Int}(32))
  local results = RemoteChannel(() -> Channel{Tuple}(32))

  @everywhere function do_work(jobs, results)
    while true
      job_id = take!(jobs)
      exec_time = compute_heavy_task()
      put!(results, (job_id, exec_time, myid()))
    end
  end

  function make_jobs(n)
    for i in 1:n
      put!(jobs, i)
    end
  end

  n = 12
  @async make_jobs(n);

  for p in workers() # start 4 tasks to process requests in parallel
    remote_do(do_work, p, jobs, results)
  end

  while n > 0 # print out results
    job_id, exec_time, where = take!(results)
    println("$job_id finished in $(round(exec_time; digits=2)) seconds on worker $where")
    global n = n - 1
  end
end
```

测试结果如下：

```bash
julia> @elapsed testTaskParallel()
1 finished in 5.0001106625e8 seconds on worker 2
2 finished in 4.9999849198e8 seconds on worker 4
3 finished in 4.9999845644e8 seconds on worker 3
4 finished in 5.0000346067e8 seconds on worker 5
5 finished in 4.9998849572e8 seconds on worker 2
6 finished in 4.9999743779e8 seconds on worker 4
8 finished in 5.0000375262e8 seconds on worker 5
7 finished in 5.0000839027e8 seconds on worker 3
10 finished in 5.000148918e8 seconds on worker 4
9 finished in 5.000245482e8 seconds on worker 2
12 finished in 4.9998631696e8 seconds on worker 3
11 finished in 5.0000099134e8 seconds on worker 5
5.105286895
```

可以看到， 提速将近 4 倍。

## ClusterManagers

暂时用不到集群。

## Noteworthy external packages

除了 Julia 自带的并行工具， 还有很多其他优秀的并发包， 主要来自三个地方：

- https://github.com/JuliaGPU
- https://github.com/JuliaParallel
- https://github.com/JuliaComputing

这篇写得有点长了，主要是https://docs.julialang.org/en/v1.0/manual/parallel-computing/ 的学习笔记， 对于并发我也不是很擅长， 希望以后再找机会写写具体应用。
