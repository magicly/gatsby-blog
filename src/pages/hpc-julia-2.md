---
title: 让代码飞起来——高性能Julia学习笔记（二）
draft: false
tags: [julia, hpc]
category: Julia
date: "2018-12-06T13:41:42Z"
---

接[上一篇：让代码飞起来——高性能 Julia 学习笔记（一）](https://magicly.me/hpc-julia/)， 继续整理高性能 Julia 学习笔记。

<!-- more -->

# 数字

Julia 中 Number 的 size 就跟 C 语言里面一样， 直接依赖于底层的 CPU/OS， 32 位 OS 上 integer 默认是 32 位， 64 位 OS 上 integer 默认是 64 位。

可以用`bitstring`查看 number 的二进制表示：

```julia
julia > bitstring(3)
"0000000000000000000000000000000000000000000000000000000000000011"

julia > bitstring(-3)
"1111111111111111111111111111111111111111111111111111111111111101"
```

有时候数字可能会被 boxed，Julia 的 compiler 会自动 boxing/unboxing。

Int64 和 Int32 都只能表示特定的整数范围， 超过范围会 overflow。

```julia
julia> typemax(Int64)
9223372036854775807

julia> bitstring(typemax(Int64))
"0111111111111111111111111111111111111111111111111111111111111111"

julia> typemin(Int64)
-9223372036854775808

julia> bitstring(typemin(Int64))
"1000000000000000000000000000000000000000000000000000000000000000"

julia> typemax(Int64) + 1
-9223372036854775808

julia> typemin(Int64) - 1
9223372036854775807
```

如果要表示任意精度的话， 可以用`BitInt`。

```julia
julia> big(typemax(Int64)) + 1
9223372036854775808
```

float point 遵循**IEEE 754**标准。

```julia
julia> bitstring(1.5)
"0011111111111000000000000000000000000000000000000000000000000000"

julia> bitstring(-1.5)
"1011111111111000000000000000000000000000000000000000000000000000"
```

无符号整数 Unsigned integer 可以用 UInt64 和 UInt32 表示， 不同类型可以转， 但是如果超出可表示范围会报错。

```julia
julia> UInt64(UInt32(1))
0x0000000000000001

julia> UInt32(UInt64(1))
0x00000001

julia> UInt32(typemax(UInt64))
ERROR: InexactError: trunc(UInt32, 18446744073709551615)
Stacktrace:
 [1] throw_inexacterror(::Symbol, ::Any, ::UInt64) at ./boot.jl:567
 [2] checked_trunc_uint at ./boot.jl:597 [inlined]
 [3] toUInt32 at ./boot.jl:686 [inlined]
 [4] UInt32(::UInt64) at ./boot.jl:721
 [5] top-level scope at none:0
```

有时候不需要考虑是否溢出， 可以直接用`%`符号取低位， 速度还更快：

```julia
julia> (typemax(UInt64) - 1) % UInt32
0xfffffffe
```

**精度和效率平衡**
有时候为了更高的效率， 可以使用`@fastmath`宏， 它会放宽一些限制， 包括检查 NaN 或 Infinity 等， 类似于 GCC 中的`-ffast-math`编译选项。

```julia
julia> function sum_diff(x)
             n = length(x); d = 1/(n-1)
             s = zero(eltype(x))
             s = s +  (x[2] - x[1]) / d
             for i = 2:length(x)-1
                 s =  s + (x[i+1] - x[i+1]) / (2*d)
             end
             s = s + (x[n] - x[n-1])/d
         end
sum_diff (generic function with 1 method)

julia> function sum_diff_fast(x)
              n=length(x); d = 1/(n-1)
              s = zero(eltype(x))
              @fastmath s = s +  (x[2] - x[1]) / d
              @fastmath for i = 2:n-1
                  s =  s + (x[i+1] - x[i+1]) / (2*d)
              end
              @fastmath s = s + (x[n] - x[n-1])/d
          end
sum_diff_fast (generic function with 1 method)

julia> t=rand(2000);

julia> sum_diff(t)
1124.071808538789

julia> sum_diff_fast(t)
1124.0718085387887

julia> using BenchmarkTools

julia> @benchmark sum_diff(t)
BenchmarkTools.Trial:
  memory estimate:  16 bytes
  allocs estimate:  1
  --------------
  minimum time:     4.447 μs (0.00% GC)
  median time:      4.504 μs (0.00% GC)
  mean time:        4.823 μs (0.00% GC)
  maximum time:     17.318 μs (0.00% GC)
  --------------
  samples:          10000
  evals/sample:     7

julia> @benchmark sum_diff_fast(t)
BenchmarkTools.Trial:
  memory estimate:  16 bytes
  allocs estimate:  1
  --------------
  minimum time:     574.951 ns (0.00% GC)
  median time:      580.831 ns (0.00% GC)
  mean time:        621.044 ns (1.04% GC)
  maximum time:     65.017 μs (99.06% GC)
  --------------
  samples:          10000
  evals/sample:     183
```

差异还是蛮大的， 差不多 8 倍差距！ 我们可以用`macroexpand`看看宏展开的代码：

```julia
julia> ex = :(@fastmath for i in 2:n-1
         s =  s + (x[i+1] - x[i+1]) / (2*d)
       end)
:(#= REPL[57]:1 =# @fastmath for i = 2:n - 1
          #= REPL[57]:2 =#
          s = s + (x[i + 1] - x[i + 1]) / (2d)
      end)

julia> macroexpand(Main, ex)
:(for i = 2:(Base.FastMath).sub_fast(n, 1)
      #= REPL[57]:2 =#
      s = (Base.FastMath).add_fast(s, (Base.FastMath).div_fast((Base.FastMath).sub_fast(x[(Base.FastMath).add_fast(i, 1)], x[(Base.FastMath).add_fast(i, 1)]), (Base.FastMath).mul_fast(2, d)))
  end)
```

可以看到， 主要是把普通的加减乘除换成了`Base.FastMath`中的方法。

本章最后介绍了`K-B-N`求和减少误差，以及 Subnormal numbers， 感觉都是科学计算里面才会用到的， 暂时没管。

# 数组

科学计算以及人工智能里面有大量向量、矩阵运算， 在 Julia 里都直接对应到 Array。 Vector 和 Matrix 其实就是 Array 的特例：

```julia
julia> Vector
Array{T,1} where T

julia> Matrix
Array{T,2} where T
```

即 Vector 是一维数组， Matrix 是二维数组。从这里也可以看出， Julia 中类型的参数类型可以是具体的 value， 比如这里的 1 和 2。

Julia 中 Array 数据是连续存放的， 如下图：

![Julia Array Storage](/blogimgs/julia-array-storage.png)

跟存放指针相比好处是少了一次内存访问， 并且可以更好地利用 CPU 的 pipeline 和 cache，以及 SIMD。

Julia 中多维数组是按列优先存储的(类似 Matlab 和 Fortran)，这点跟 C 语言中不一样：
![Julia 2d array storage](/blogimgs/julia-2d-array-storage.png)

按照数据在内存中的布局来读取数据， 能显著提高效率。

```julia
julia> function col_iter(x)
         s=zero(eltype(x))
         for i = 1:size(x, 2)
           for j = 1:size(x, 1)
             s = s + x[j, i] ^ 2
             x[j, i] = s
           end
         end
       end
col_iter (generic function with 1 method)

julia> function row_iter(x)
         s=zero(eltype(x))
         for i = 1:size(x, 1)
           for j = 1:size(x, 2)
             s = s + x[i, j] ^ 2
             x[i, j] = s
           end
         end
       end
row_iter (generic function with 1 method)

julia> a = rand(1000, 1000);

julia> @benchmark row_iter(a)
BenchmarkTools.Trial:
  memory estimate:  0 bytes
  allocs estimate:  0
  --------------
  minimum time:     2.217 ms (0.00% GC)
  median time:      2.426 ms (0.00% GC)
  mean time:        2.524 ms (0.00% GC)
  maximum time:     11.723 ms (0.00% GC)
  --------------
  samples:          1974
  evals/sample:     1

julia> @benchmark col_iter(a)
BenchmarkTools.Trial:
  memory estimate:  0 bytes
  allocs estimate:  0
  --------------
  minimum time:     815.984 μs (0.00% GC)
  median time:      910.121 μs (0.00% GC)
  mean time:        917.850 μs (0.00% GC)
  maximum time:     1.292 ms (0.00% GC)
  --------------
  samples:          5416
  evals/sample:     1
```

Julia runtime 会对 array 访问做 bound 判断， 看是否超出边界。 超出边界的访问会导致很多 bugs，甚至是安全问题。 另一方面， bound check 会带来额外的开销，如果你能很确定不会越界， 那可以用@inbound 宏告诉 Julia 不要做 bound check， 效率会提高不少。

```julia
julia> function prefix_bounds(a, b)
         for i = 2:size(a, 1)
           a[i] = b[i-1] + b[i]
         end
       end
prefix_bounds (generic function with 1 method)

julia> function prefix_inbounds(a, b)
         @inbounds for i = 2:size(a, 1)
           a[i] = b[i-1] + b[i]
         end
       end
prefix_inbounds (generic function with 1 method)

julia> a = rand(1000);

julia> b = rand(1000);

julia> @benchmark prefix_bounds(a, b)
BenchmarkTools.Trial:
  memory estimate:  0 bytes
  allocs estimate:  0
  --------------
  minimum time:     742.360 ns (0.00% GC)
  median time:      763.264 ns (0.00% GC)
  mean time:        807.497 ns (0.00% GC)
  maximum time:     1.968 μs (0.00% GC)
  --------------
  samples:          10000
  evals/sample:     125

julia> @benchmark prefix_inbounds(a, b)
BenchmarkTools.Trial:
  memory estimate:  0 bytes
  allocs estimate:  0
  --------------
  minimum time:     179.294 ns (0.00% GC)
  median time:      181.826 ns (0.00% GC)
  mean time:        185.124 ns (0.00% GC)
  maximum time:     635.909 ns (0.00% GC)
  --------------
  samples:          10000
  evals/sample:     690
```

**慎用@inbound！！！** 最好是限制 loop 直接依赖于 array 长度， 比如：`for i in 1:length(array)`这种形式。

可以在启动的时候加上`--check-bounds=yes/no`来全部开启或者关闭（优先级高于@inbound 宏）bound check！ 再说一次， **慎用！**

Julia 内置了很多操作 Array 的函数， 一般都提供两个版本， 注意**可变和不可变版本差异很大！！！**

```julia
julia> a = rand(1000);

julia> @benchmark sort(a)
BenchmarkTools.Trial:
  memory estimate:  7.94 KiB
  allocs estimate:  1
  --------------
  minimum time:     16.050 μs (0.00% GC)
  median time:      17.493 μs (0.00% GC)
  mean time:        18.933 μs (0.00% GC)
  maximum time:     726.416 μs (0.00% GC)
  --------------
  samples:          10000
  evals/sample:     1

julia> @benchmark sort!(a)
BenchmarkTools.Trial:
  memory estimate:  0 bytes
  allocs estimate:  0
  --------------
  minimum time:     4.868 μs (0.00% GC)
  median time:      4.997 μs (0.00% GC)
  mean time:        5.282 μs (0.00% GC)
  maximum time:     13.772 μs (0.00% GC)
  --------------
  samples:          10000
  evals/sample:     7
```

我们可以看到， 不可变版本`sort`无论时间还是内存占用和分配上都比可变版本`sort!`高。 这很容易理解， 不可变版本需要 clone 一份数据出来，而不是直接修改参数。 根据需要选择最适合的版本。

类似的，合理利用**预分配**，可以有效降低时间和内存占用。

```julia
julia> function xpow(x)
         return [x x^2 x^3 x^4]
       end
xpow (generic function with 1 method)

julia> function xpow_loop(n) s= 0
          for i = 1:n
            s = s + xpow(i)[2]
         end
         s
       end
xpow_loop (generic function with 1 method)

julia> @benchmark xpow_loop(1_000_000)
BenchmarkTools.Trial:
  memory estimate:  167.84 MiB
  allocs estimate:  4999441
  --------------
  minimum time:     68.342 ms (4.11% GC)
  median time:      70.378 ms (5.21% GC)
  mean time:        71.581 ms (6.04% GC)
  maximum time:     120.430 ms (39.92% GC)
  --------------
  samples:          70
  evals/sample:     1

julia> function xpow!(result::Array{Int, 1}, x)
         @assert length(result) == 4
         result[1] = x
         result[2] = x^2
         result[3] = x^3
         result[4] = x^4
       end
xpow! (generic function with 1 method)

julia> function xpow_loop_noalloc(n)
         r = [0, 0, 0, 0]
         s= 0
         for i = 1:n
           xpow!(r, i)
           s = s + r[2]
         end
         s
       end
xpow_loop_noalloc (generic function with 1 method)

julia> @benchmark xpow_loop_noalloc(1_000_000)
BenchmarkTools.Trial:
  memory estimate:  112 bytes
  allocs estimate:  1
  --------------
  minimum time:     7.314 ms (0.00% GC)
  median time:      7.486 ms (0.00% GC)
  mean time:        7.599 ms (0.00% GC)
  maximum time:     9.580 ms (0.00% GC)
  --------------
  samples:          658
  evals/sample:     1
```

Julia 中做 Array slicing 很容易，类似 python 的语法：

```julia
julia> a = collect(1:100);

julia> a[1:10]
10-element Array{Int64,1}:
  1
  2
  3
  4
  5
  6
  7
  8
  9
 10
```

语法容易使用很容易造成滥用， 导致性能问题， 因为：**array slicing 会 copy 一个副本！** 我们来计算一个矩阵的每列的和， 简单实现如下：

```julia
julia> function sum_vector(x::Array{Float64, 1})
         s = 0.0
         for i = 1:length(x)
           s = s + x[i]
         end
         return s
       end
sum_vector (generic function with 1 method)

julia> function sum_cols_matrix(x::Array{Float64, 2})
         num_cols = size(x, 2)
         s = zeros(num_cols)
         for i = 1:num_cols
           s[i] = sum_vector(x[:, i])
         end
         return s
       end
sum_cols_matrix (generic function with 1 method)

julia> t = rand(1000, 1000);

julia> @benchmark sum_cols_matrix(t)
BenchmarkTools.Trial:
  memory estimate:  7.76 MiB
  allocs estimate:  1001
  --------------
  minimum time:     1.703 ms (0.00% GC)
  median time:      2.600 ms (0.00% GC)
  mean time:        2.902 ms (19.10% GC)
  maximum time:     40.978 ms (94.27% GC)
  --------------
  samples:          1719
  evals/sample:     1
```

`x[:, j]`是取第 j 列的所有元素。 算法很简单， 定义一个函数`sum_vector`计算向量的和， 然后在`sum_cols_matrix`中取每一列传过去。

由于`x[:, j]`这样 slicing 会 copy 元素， 所以内存占用和分配都比较大。 Julia 提供了`view`函数，可以复用父数组的元素而不是 copy， 具体用法可以参考https://docs.julialang.org/en/v1/base/arrays/#Base.view 。

由于`view`返回的是[SubArray](https://docs.julialang.org/en/v1/devdocs/subarrays/)类型， 所以我们先修改一下`sum_vector`的参数类型为`AbstractArray`：

```julia
julia> function sum_vector2(x::AbstractArray)
         s = 0.0
         for i = 1:length(x)
           s = s + x[i]
         end
         return s
       end
sum_vector2 (generic function with 1 method)

julia> function sum_cols_matrix_views(x::Array{Float64, 2})
         num_cols = size(x, 2)
         s = zeros(num_cols)
         for i = 1:num_cols
            s[i] = sum_vector2(view(x, :, i))
         end
         return s
       end
sum_cols_matrix_views (generic function with 1 method)

julia>

julia> @benchmark sum_cols_matrix_views(t)
BenchmarkTools.Trial:
  memory estimate:  7.94 KiB
  allocs estimate:  1
  --------------
  minimum time:     812.209 μs (0.00% GC)
  median time:      883.884 μs (0.00% GC)
  mean time:        897.888 μs (0.00% GC)
  maximum time:     6.552 ms (0.00% GC)
  --------------
  samples:          5474
  evals/sample:     1
```

可以看到，提升还是蛮大的。

**SIMD**全称**Single Instruction Multiple Data**， 是现代 CPU 的特性， 可以一条指令操作多条数据。 来加两个向量试试：

```julia
julia> x = zeros(1_000_000); y = rand(1_000_000); z = rand(1_000_000);

julia> function sum_vectors!(x, y, z)
         n = length(x)
         for i = 1:n
           x[i] = y[i] + z[i]
         end
       end
sum_vectors! (generic function with 1 method)

julia> function sum_vectors_inbounds!(x, y, z)
         n = length(x)
         @inbounds for i = 1:n
           x[i] = y[i] + z[i]
         end
       end
sum_vectors_inbounds! (generic function with 1 method)

julia> function sum_vectors_inbounds_simd!(x, y, z)
         n = length(x)
         @inbounds @simd for i = 1:n
           x[i] = y[i] + z[i]
         end
       end
sum_vectors_inbounds_simd! (generic function with 1 method)

julia> @benchmark sum_vectors!(x, y, z)
BenchmarkTools.Trial:
  memory estimate:  0 bytes
  allocs estimate:  0
  --------------
  minimum time:     1.117 ms (0.00% GC)
  median time:      1.156 ms (0.00% GC)
  mean time:        1.174 ms (0.00% GC)
  maximum time:     1.977 ms (0.00% GC)
  --------------
  samples:          4234
  evals/sample:     1

julia> @benchmark sum_vectors_inbounds!(x, y, z)
BenchmarkTools.Trial:
  memory estimate:  0 bytes
  allocs estimate:  0
  --------------
  minimum time:     1.118 ms (0.00% GC)
  median time:      1.148 ms (0.00% GC)
  mean time:        1.158 ms (0.00% GC)
  maximum time:     1.960 ms (0.00% GC)
  --------------
  samples:          4294
  evals/sample:     1

julia> @benchmark sum_vectors_inbounds_simd!(x, y, z)
BenchmarkTools.Trial:
  memory estimate:  0 bytes
  allocs estimate:  0
  --------------
  minimum time:     1.118 ms (0.00% GC)
  median time:      1.145 ms (0.00% GC)
  mean time:        1.155 ms (0.00% GC)
  maximum time:     2.080 ms (0.00% GC)
  --------------
  samples:          4305
  evals/sample:     1
```

这个测试结果， 无论用`@inbounds`还是`@simd`，都没有提速（难道 Julia 现在默认会使用 SIMD？）， 测试了几次都不行。 另外， 我在测试https://github.com/JuliaComputing/JuliaBoxTutorials/blob/master/introductory-tutorials/intro-to-julia/09.%20Julia%20is%20fast.ipynb 的时候， 也发现有没有 simd 差别不大， 如有知道原因的童鞋欢迎留言告知， 非常谢谢。

另外说[Yeppp](https://github.com/JuliaMath/Yeppp.jl)这个包也能提高速度， 还没有测试。

如果我们设计的函数给别人用， 那么 API 会设计的比较通用（比如参数设计成 AbstractArray）， 可能会接受各种类型的 Array，这时候需要**小心如何遍历数组**。

有两种 indexing 方式。 一种是 linear indexing， 比如是一个三维 array， 每维度 10 个元素， 则可以用 x[1], x[2], ..., x[1000]连续地访问数组。 第二种叫 cartesian indexing， 访问方式为 x[i, j, k]。 某些数组不是连续的（比如 view 生成的 SubArray），这时候用 cartesian indexing 访问会比用 linear indexing 访问快， 因为 linear indexing 需要除法转化成每一维的下标。 通用代码一般会用 linear indexing， 这就有可能导致性能问题。

```julia
julia> function mysum_linear(a::AbstractArray)
         s=zero(eltype(a))
         for i = 1:length(a)
           s=s+a[i]
         end
         return s
       end
mysum_linear (generic function with 1 method)

julia> mysum_linear(1:1000000)
500000500000

julia> mysum_linear(reshape(1:1000000, 100, 100, 100))
500000500000

julia> mysum_linear(reshape(1:1000000, 1000, 1000))
500000500000

julia> mysum_linear(view(reshape(1:1000000, 1000, 1000), 1:500, 1:500) )
62437625000

julia> @benchmark mysum_linear(1:1000000)
BenchmarkTools.Trial:
  memory estimate:  0 bytes
  allocs estimate:  0
  --------------
  minimum time:     1.380 ns (0.00% GC)
  median time:      1.426 ns (0.00% GC)
  mean time:        1.537 ns (0.00% GC)
  maximum time:     13.475 ns (0.00% GC)
  --------------
  samples:          10000
  evals/sample:     1000

julia> @benchmark mysum_linear(reshape(1:1000000, 1000, 1000))
BenchmarkTools.Trial:
  memory estimate:  0 bytes
  allocs estimate:  0
  --------------
  minimum time:     1.379 ns (0.00% GC)
  median time:      1.392 ns (0.00% GC)
  mean time:        1.482 ns (0.00% GC)
  maximum time:     23.089 ns (0.00% GC)
  --------------
  samples:          10000
  evals/sample:     1000

julia> @benchmark mysum_linear(view(reshape(1:1000000, 1000, 1000), 1:500, 1:500))
BenchmarkTools.Trial:
  memory estimate:  0 bytes
  allocs estimate:  0
  --------------
  minimum time:     1.016 ms (0.00% GC)
  median time:      1.047 ms (0.00% GC)
  mean time:        1.071 ms (0.00% GC)
  maximum time:     2.211 ms (0.00% GC)
  --------------
  samples:          4659
  evals/sample:     1
```

可以看到最后一次测试， 元素总数更少了， 但是时间更长， 原因就是数组不是连续的， 但是又用了 linear indexing。 最简单的解决方法是直接迭代元素， 而不是迭代下标。

```julia
julia> function mysum_in(a::AbstractArray)
         s = zero(eltype(a))
         for i in a
           s=s+ i
         end
       end
mysum_in (generic function with 1 method)

julia> @benchmark mysum_in(view(reshape(1:1000000, 1000, 1000), 1:500, 1:500))
BenchmarkTools.Trial:
  memory estimate:  0 bytes
  allocs estimate:  0
  --------------
  minimum time:     224.538 μs (0.00% GC)
  median time:      238.493 μs (0.00% GC)
  mean time:        246.847 μs (0.00% GC)
  maximum time:     413.477 μs (0.00% GC)
  --------------
  samples:          10000
  evals/sample:     1
```

可以看到， 跟 linear indexing 相比， 效率是 4 倍多。 但是如果我们需要下标怎么办呢？可以用`eachindex()`方法，每一种 array 都会定义一个优化过的`eachindex()`方法：

```julia
julia> function mysum_eachindex(a::AbstractArray)
         s = zero(eltype(a))
         for i in eachindex(a)
           s = s + a[i]
         end
       end
mysum_eachindex (generic function with 1 method)

julia> @benchmark mysum_eachindex(view(reshape(1:1000000, 1000, 1000), 1:500, 1:500))
BenchmarkTools.Trial:
  memory estimate:  0 bytes
  allocs estimate:  0
  --------------
  minimum time:     243.295 μs (0.00% GC)
  median time:      273.168 μs (0.00% GC)
  mean time:        285.002 μs (0.00% GC)
  maximum time:     4.191 ms (0.00% GC)
  --------------
  samples:          10000
  evals/sample:     1
```

通过这两篇文章介绍， 我们基本上掌握了 Julia 高性能的方法。 如果还不够， 那就只能求助于并行和分布式了， 等着我们下一篇介绍吧。

欢迎加入知识星球一起分享讨论有趣的技术话题。

![星球jsforfun](/blogimgs/xq-jsforfun.jpg)
