---
title: TypeScript简介
draft: false
tags: [typescript, ts]
category: FE
date: "2018-03-06T10:49:42Z"
---

TS的简介或者说学习笔记吧，主要留给自己查阅。

<!-- more -->

# 在线工具
https://www.typescriptlang.org/play/index.html

# 基本数据类型Basic Types
## Boolean
```js
let isDone: boolean = false;
```
## Number
```js
let decimal: number = 6;
let hex: number = 0xf00d;
let binary: number = 0b1010;
let octal: number = 0o744;
```
## String
```js
let color: string = "blue";
color = 'red';
let sentence: string = `Hello, my name is ${ fullName }.
```
## Array
```js
let list: number[] = [1, 2, 3];
let list: Array<number> = [1, 2, 3];
```
## Tuple
```js
// Declare a tuple type
let x: [string, number];
// Initialize it
x = ["hello", 10]; // OK
// Initialize it incorrectly
x = [10, "hello"]; // Error

// When accessing an element outside the set of known indices, a union type is used instead:
x[3] = "world"; // OK, 'string' can be assigned to 'string | number'

console.log(x[5].toString()); // OK, 'string' and 'number' both have 'toString'

x[6] = true; // Error, 'boolean' isn't 'string | number'
```
## Enum
```js
enum Color {Red = 1, Green = 2, Blue = 4}
let c: Color = Color.Green;

let colorName: string = Color[2];

alert(colorName); // Displays 'Green' as its value is 2 above
```
## Any
任意类型， 兼容JS的动态类型。
```js
let notSure: any = 4;
notSure.ifItExists(); // okay, ifItExists might exist at runtime
notSure.toFixed(); // okay, toFixed exists (but the compiler doesn't check)

let prettySure: Object = 4;
prettySure.toFixed(); // Error: Property 'toFixed' doesn't exist on type 'Object'.
```
## Void
没有明确的`return`。 Declaring variables of type void is not useful because you can only assign undefined or null to them.

## Null and Undefined
```js
// Not much else we can assign to these variables!
let u: undefined = undefined;
let n: null = null;
```
`--strictNullChecks`

## Never
抛异常。
> The never type is a subtype of, and assignable to, every type; however, no type is a subtype of, or assignable to, never (except never itself). Even any isn’t assignable to never.

```js
// Function returning never must have unreachable end point
function error(message: string): never {
    throw new Error(message);
}

// Inferred return type is never
function fail() {
    return error("Something failed");
}

// Function returning never must have unreachable end point
function infiniteLoop(): never {
    while (true) {
    }
}
```

## Type assertions
你知道的比编译器多。
```js
let someValue: any = "this is a string";

let strLength: number = (<string>someValue).length;

// or
let strLength: number = (someValue as string).length;
```
在`JSX`里面只能用`as`，因为`<>`在JSX里有特殊含义。

# 高级类型Advanced Types
## Intersection Types
## Union Types
## Type Guards and Differentiating Types
## Nullable types
## Type Aliases
## String Literal Types
## Numeric Literal Types
## Enum Member Types
## Discriminated Unions
## Discriminated Unions
## Index types
## Mapped types

# Interfaces
TS采用`鸭子类型`或者叫`结构子类型`. “duck typing” or “structural subtyping”
## Optional Properties
## Readonly properties
## Excess Property Checks
## Function Types
## Indexable Types
## Class Types
## Extending Interfaces
## Hybrid Types
## Interfaces Extending Classes

# Classes
## Inheritance
## Public, private, and protected modifiers
Public by default
## Readonly modifier
## Accessors
## Static Properties
## Abstract Classes
## Advanced Techniques
### Constructor functions
### Using a class as an interface

# Functions
## Function Types
## Optional and Default Parameters
## Rest Parameters
## this
## Overloads

# Generics
## Generic Type Variables
## Generic Types
## Generic Classes
## Generic Constraints

# Enums

# Type Inference
## Best common type
## Contextual Type

# Type Compatibility
## Comparing two functions
## Function Parameter Bivariance
## Optional Parameters and Rest Parameters
## Enums
## Classes
## Generics
## Advanced Topics
Subtype vs Assignment

# Symbols

# Iterators and Generators

# Modules

# Namespaces

# Namespaces and Modules

# Module Resolution

# Declaration Merging

# JSX

# Decorators

# Mixins

# Triple-Slash Directives


# 语言规范
https://github.com/Microsoft/TypeScript/blob/master/doc/spec.md



