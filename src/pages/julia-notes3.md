---
title: Julia Notes3
draft: false
date: "2021-02-04T21:54:10Z"
tags: [julia]
category: HPC
---

Control Flow and Types.

<!-- more -->

# Control Flow

## Compound Expressions

`begin end`和`;`

## if/else

> if blocks are "leaky", i.e. they do not introduce a local scope. This means that new variables defined inside the if clauses can be used after the if block, even if they weren't defined before. 
> if blocks also return a value
> `? :` === `if-elseif-else`

## Short-Circuit Evaluation

`&&`和`||`， 可以替代if：
> Instead of if <cond> <statement> end, one can write <cond> && <statement> (which could be read as: <cond> and then <statement>). Similarly, instead of if ! <cond> <statement> end, one can write <cond> || <statement> (which could be read as: <cond> or else <statement>).

`&`和`|`没有短路效果。

最后一个表达式可以是非bool， 之前必须是：
```bash
julia> 1 && true
ERROR: TypeError: non-boolean (Int64) used in boolean context

julia> true && (x = (1, 2, 3))
(1, 2, 3)

julia> false && (x = (1, 2, 3))
false
```

## Loops

`while`

```bash
julia> i = 1;

julia> while i <= 5
           println(i)
           global i += 1 # 在interactive session里不需要global也可以， file里必须要
       end
```

`for`, `for = `, `for in`, `for ∈`:
```bash
julia> for i = 1:5
           println(i)
       end

julia> for i in [1,4,0]
           println(i)
       end
1
4
0

julia> for s ∈ ["foo","bar","baz"]
           println(s)
       end
foo
bar
baz

julia> for i = 1:2, j = 3:4 # break的话会break两层
           println((i, j))
       end

julia> for i = 1:2, j = 3:4
           println((i, j))
           i = 0
       end
(1, 3)
(1, 4)
(2, 3)
(2, 4)

julia> for i in 1:2
           for j in 3:4
        println((i, j))
        i = 0
           end
       end
(1, 3)
(0, 4)
(2, 3)
(0, 4)
```

## Exception

自定义异常
```bash
julia> struct MyCustomException <: Exception end
```

> When writing an error message, it is preferred to make the first word lowercase. 

`error(String)`产生`ErrorException`

`throw`, `try/catch/finally`

> One thing to think about when deciding how to handle unexpected situations is that using a try/catch block is **much slower** than using conditional branching to handle those situations.

> Note that the symbol following catch will always be interpreted as a name for the exception, so care is needed when writing try/catch expressions on a single line.

> Julia provides the `rethrow`, `backtrace`, `catch_backtrace` and `Base.catch_stack` functions for more advanced error handling.

## Tasks(Coroutines)

参见https://docs.julialang.org/en/v1/manual/asynchronous-programming

# Types

添加types的三种好处：

> to take advantage of Julia's powerful multiple-dispatch mechanism, to improve human readability, and to catch programmer errors.

dynamic, nominative and parametric

1.  all values in Julia are true objects having a type that belongs to a single, fully connected type graph, all nodes of which are equally first-class as types.
2. 只有"run-time-type"
3. values才有type， variables没有
4. Both abstract and concrete types can be parameterized by other types. 

> Currently, type declarations cannot be used in global scope, e.g. in the REPL, since Julia does not yet have constant-type globals.

## Abstract Types

```julia
abstract type «name» end
abstract type «name» <: «supertype» end
```

`Any`是top, `Union{}`是bottom.

```bash
julia> Integer <: Number
true
```

> An important use of abstract types is to provide default implementations for concrete types.

## Primitive type

没必要自定义。

```julia
primitive type «name» «bits» end
primitive type «name» <: «supertype» «bits» end
```

> Since Julia's type system is nominative, however, they are not interchangeable despite having identical structure. 

> This is why a nominative type system is necessary: if structure determined type, which in turn dictates behavior, then it would be impossible to make Bool behave any differently than Int8 or UInt8.

## Composite Types

multiple dispatch需要

>  In Julia, all values are objects, but functions are not bundled with the objects they operate on.

两个default contructors:

> One accepts any arguments and calls convert to convert them to the types of the fields, and the other accepts arguments that match the field types exactly.

```bash
julia> fieldnames(Foo)
(:bar, :baz, :qux)
```

> An immutable object might contain mutable objects, such as arrays, as fields. 

无字段的immutable struct是单例：

```bash
julia> struct NoFields
       end

julia> NoFields() === NoFields()
true
```

`mutable struct Bar`

> such objects are generally allocated on the heap, and have stable memory addresses. 

## Declared Types
abstract, primitive, composite三种类型有共同点：
* explicitly declared
* names
* explicitly declared supertypes
* may have parameters
* 都是DataType的instance

```bash
julia> typeof(Real)
DataType

julia> typeof(Int)
DataType
```

> A DataType may be abstract or concrete. If it is concrete, it has a specified size, storage layout, and (optionally) field names. 

## Type Unions 

> The Julia compiler is able to generate efficient code in the presence of Union types with a small number of types [1], by generating specialized code in separate branches for each possible type.

`Union{T, Nothing}`等价于其他语言里的`Nullable`, `Option`或`Maybe`.

## Parametric Types

不同语言有不同的泛型`generic programming`方式， 比如
> Some of these languages support true parametric polymorphism (e.g. ML, Haskell, Scala), while others support ad-hoc, template-based styles of generic programming (e.g. C++, Java). 

Julia是动态语言， 所以很多静态语言里的难点没有：
> because Julia is a dynamically typed language and doesn't need to make all type decisions at compile time, many traditional difficulties encountered in static parametric type systems can be relatively easily handled.

### Parametric Composite Types

> Julia's type parameters are invariant, rather than being covariant (or even contravariant). 
> Only one default constructor is generated for parametric types, since overriding it is not possible. 
> 

### Parametric Abstract Types

> The notation Pointy{<:Real} can be used to express the Julia analogue of a covariant type, while Pointy{>:Int} the analogue of a contravariant type, but technically these represent sets of types (see UnionAll Types).

### Tuple Types

### Vararg Tuple Types

### NamedTuple Types

### Singleton Types

> For each type, T, the "singleton type" Type{T} is an abstract type whose only instance is the object T.
> In other words, isa(A,Type{B}) is true if and only if A and B are the same object and that object is a type.

### Parametric Primitive Types

```julia
# 32-bit system:
primitive type Ptr{T} 32 end

# 64-bit system:
primitive type Ptr{T} 64 end
```

> the type parameter T is not used in the definition of the type itself – it is just an abstract tag, essentially defining an entire family of types with identical structure, differentiated only by their type parameter.
> Ptr{Float64} and Ptr{Int64} are distinct types, even though they have identical representations. 

## UnionAll Types

感觉就是很强大。参数Type也可以`partially instantiate`.

## Type Alias

直接赋值就行。

## Operations on Types

* `<:`: is a subtyp?
* isa(1, Int)
* typeof
* supertype

```bash
julia> typeof(Rational{Int})
DataType

julia> typeof(Union{Real,String})
Union

julia> typeof(Union{Real, Float32}) # Union{Real, Float32} == Real!
DataType

julia> typeof(DataType)
DataType

julia> typeof(Union)
DataType

julia> supertype(Float64)
AbstractFloat

julia> supertype(Number)
Any

julia> supertype(AbstractString)
Any

julia> supertype(Any)
Any

julia> supertype(Union{Float64,Int64})
ERROR: MethodError: no method matching supertype(::Type{Union{Float64, Int64}})
Closest candidates are:
[...]
```


```julia
# TODO 有点奇怪
julia> typeof(Union{Real, Int})
DataType

julia> typeof(Union{Real, String})
Union
```

## Custom pretty-printing

实现`Base.show(io::IO, z::T) = print(io, ...)`方法

不同媒体可以show不同内容， 参考https://docs.julialang.org/en/v1/base/io-network/#Multimedia-I/O
```bash
julia> Base.show(io::IO, ::MIME"text/plain", z::Polar{T}) where{T} =
           print(io, "Polar{$T} complex number:\n   ", z)
```

> As a rule of thumb, the single-line show method should print a valid Julia expression for creating the shown object.

`Base.show_unquoted(io::IO, z::Polar, indent::Int, precedence::Int)`解决metaprogamming里的一些问题， 比如添加`(`.

`io::IO`可以是一个`IOContext`， 根据里面带的property不同， 可以显示不同内容。

## "Value types"

Julia里面的类型参数可以是具体的value， 比如`Array{T, N}`里面的N。不够可能不常用：
> In particular, you would never want to write actual code as illustrated above. For more information about the proper (and improper) uses of Val, please read the more extensive discussion in the performance tips.