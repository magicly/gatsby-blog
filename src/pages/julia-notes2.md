---
title: Julia Notes2
draft: false
date: "2021-01-07T21:54:10Z"
tags: [julia, C, C++, Rust]
category: HPC
---

# Modules

> The statement using BigLib: thing1, thing2 brings just the identifiers thing1 and thing2 into scope from module BigLib. If these names refer to functions, adding methods to them will not be allowed (you may only "use" them, not extend them).
> It does not add modules to be searched the way using does. import also differs from using in that functions imported using import can be extended with new methods.

> Including the same code in different modules provides mixin-like behavior. One could use this to run the same code with different base definitions, for example testing code by running it with "safe" versions of some operators: