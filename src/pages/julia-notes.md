---
title: Julia Notes1
draft: false
date: "2021-01-07T08:54:10Z"
tags: [julia, C, C++, Rust]
category: HPC
---

# REPL

`ans`：上一条执行结果
`;` 加了没有output
`include("file.jl")`执行`file.jl`内容

`julia script.jl arg1 arg2...`， ARGS存放arg1, args, PROGRAM_FILE存放script.jl

`--` 后面的参数是给julia的

`~/.julia/config/startup.jl`里的内容在启动julia会执行

-n或者--machine-file可以启动多进程

还有很多其他启动参数， 参考https://docs.julialang.org/en/v1/manual/getting-started/

# Variables

支持UTF-8

支持LaTeX数学符号， `\delta-tab`， 如果别的地方看到了不知道怎么输入， 可以copy到repl里, `?δ` ， 关于这个有一些讨论：
* Julia支持标准？ https://discourse.julialang.org/t/what-is-the-criterion-to-be-supported-in-unicode-input-in-julia-repl/26277 没有啥标准， 一点点讨论加上的
* 所有的符号 https://docs.julialang.org/en/v1/manual/unicode-input/


命名限制很少， 但有些style建议， 参见：
* https://docs.julialang.org/en/v1/manual/variables/ 
* https://docs.julialang.org/en/v1/manual/style-guide/

# Int & Float

Int/UInt 8, 16, 32, 64, 128
Float, 16, 32, 64

typeof(1)取决于Sys.WORD_SIZE

typeof(0x1)的类型取决于1的大小

> This behavior is based on the observation that when one uses unsigned hex literals for integer values, one typically is using them to represent a fixed numeric byte sequence, rather than just an integer value.

0b10, 0o10

> In the case of leading zeros, the size is determined by the minimal needed size for a literal, which has the same length but leading digit 1. That allows the user to control the size. Values which cannot be stored in UInt128 cannot be written as such literals.

-0x2也是UInt8, ==0xFE

```julia
for T in [Int8,Int16,Int32,Int64,Int128,UInt8,UInt16,UInt32,UInt64,UInt128]
           println("$(lpad(T,7)): [$(typemin(T)),$(typemax(T))]")
       end
```

Overflow: 
> Thus, arithmetic with Julia integers is actually a form of modular arithmetic. This reflects the characteristics of the underlying arithmetic of integers as implemented on modern computers. 

Div Errors: 
```julia
div(1, 0)
div(typemin(1), -1)
1 / 0 # ok
```

literal是Float64， e->f, `0.5f0`为Float32

> Hexadecimal floating-point literals are also valid, but only as Float64 values, with p preceding the base-2 exponent:

> Half-precision floating-point numbers are also supported (Float16), but they are implemented in software and use Float32 for calculations.

`10_000, 0.000_000_005, 0xdead_beef, 0b1011_0010`

两个Zeros, `bitstring(0.0) != bitstring(-0.0)`

Inf, -Inf, NaN， [IEEE 754标准](https://en.wikipedia.org/wiki/IEEE_754-2008_revision)

有BigInt & BigFloat可用

写起来更像数学， 更简洁。
> 2^3x is parsed as 2^(3x), and 2x^3 is parsed as 2*(x^3).
```julia
x = 3
1.5x^2 - .5x + 1
2(x-1)^2 - 3(x-1) + 1

1 / 2im == -0.5im

(x-1)x == 6
(x-1)(x+1) # ERROR: MethodError: objects of type Int64 are not callable ，当成function调用
x(x+1) # error
```
> Neither juxtaposition of two parenthesized expressions, nor placing a variable before a parenthesized expression, however, can be used to imply multiplication:

跟16进制、科学技术法、float32表示有冲突， 以这三个为准。
```julia
0xff # ==0xff， 而不是0 * xff
1e10 # == 10^10 不是1 * e10
1E10 # == 10^10 不是1 * E10
1.5f22 # == 1.5， 1.5f0 == Float32(1.5)， 而不是1.5 * f22
1.5F22 == 1.5 * F22
```
> Unlike E, which is equivalent to e in numeric literals for historical reasons, F is just another letter and does not behave like f in numeric literals.

```julia
one(Float32)
one(1)
zero(BigFloat)
zero(1)
```

# Functions

assignment form: 
```julia
f(x,y) = x + y
```

`pass-by-sharing`

return == last expression

1 + 2 等价于+(1, 2)
> most operators are just functions with support for special syntax. The exceptions are operators with special evaluation semantics like && and ||

Operators With Special Names 有一些operator对应的函数名

匿名函数， lazy: `() -> 3`

tuples & named tuples & multiple return values & returns/arguments destructuring
```julia
f((a, b)) = a + b
```

varargs:
```julia
bar(a,b,x...) = (a,b,x)
```
可以控制有多少个： https://docs.julialang.org/en/v1/manual/methods/#Parametrically-constrained-Varargs-methods

> "splat" the values contained in an iterable collection into a function call as individual arguments.
```julia
x = [1,2,3,4]
bar(x...)
```

> Optional arguments are actually just a convenient syntax for writing multiple method definitions with different numbers of arguments (see Note on Optional and keyword Arguments).

```julia
julia> function f(a, b = 1, c = 2)
       a + b + c
       end
f (generic function with 3 methods)

julia> f(1)
4

julia> f(1,2)
5

julia> f(1, 2, 3)
6
```

Keyword Arguments

> One can also pass key => value expressions after a semicolon. For example, plot(x, y; :width => 2) is equivalent to plot(x, y, width=2). This is useful in situations where the keyword name is computed at runtime.

Scope of Default Values
```julia
function f(x, a=b, b=1) # a=b是外面的b， 修改了之后再执行会变
    ###
end
```

do block会创建一个匿名函数， 作为function第一个参数传入。
> The do x syntax creates an anonymous function with argument x and passes it as the first argument to map. 

```julia
open("outfile", "w") do io
    write(io, data)
end

function open(f::Function, args...)
    io = open(args...)
    try
        f(io)
    finally
        close(io)
    end
end
```

> Captured variables can create performance challenges as discussed in performance tips.

function组合, pipe
```julia
map(first ∘ reverse ∘ uppercase, split("you can compose functions like this"))

["a", "list", "of", "strings"] .|> [uppercase, reverse, titlecase, length] # pipe和broadcasting结合
```

用.向量化函数， julia里面不是为了性能， for loop就可以很强， 主要是为了简洁。
> f.(args...) is actually equivalent to broadcast(f, args...), which allows you to operate on multiple arrays (even of different shapes), or a mix of arrays and scalars (see Broadcasting).
> nested f.(args...) calls are fused into a single broadcast loop. 
> in sin.(sort(cos.(X))) the sin and cos loops cannot be merged because of the intervening sort function.
> X .= ..., which is equivalent to broadcast!(identity, X, ...) except that, as above, the broadcast! loop is fused with any nested "dot" calls. For example, X .= sin.(Y) is equivalent to broadcast!(sin, X, Y), overwriting X with sin.(Y) in-place. If the left-hand side is an array-indexing expression, e.g. X[begin+1:end] .= sin.(Y), then it translates to broadcast! on a view, e.g. broadcast!(sin, view(X, firstindex(X)+1:lastindex(X)), Y), so that the left-hand side is updated in-place.
```julia
@. X = sin(cos(Y)) # equivalent to X .= sin.(cos.(Y))
```

Julia提供了multiple disptch， 跟Types和Methods密切相关。