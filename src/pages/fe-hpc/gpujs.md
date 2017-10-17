---
title: 前端高性能计算之四：GPU加速计算
draft: false
tags: [gpu, wegbl, cuda]
category: FE
date: "2017-10-16T16:53:42Z"
---

人工智能是最近两年绝对的热点，而这次人工智能的复兴，有一个很重要的原因就是计算能力的提升，主要依赖于GPU。去年Nvidia的股价飙升了几倍，市面上好点的GPU一般都买不到，因为全被做深度学习以及挖比特币的人买光了😂。

GPU，全称Graphics Processing Unit，即图像处理器，早期主要用于显示图像使用。因为图像处理主要偏简单的矩阵运算，逻辑判断等很少，因此GPU的设计跟CPU架构不一样，也因此做到一个GPU上可以有很多计算单元，可以进行大量并行计算。网上找到一个视频，应该是Nvidia某年的产品发布会，形象地演示了CPU跟GPU的区别。http://v.youku.com/v_show/id_XNDcyNTc1MjQ4==.html 。知乎上也有对CPU和GPU的对比https://www.zhihu.com/question/19903344

后来人们逐渐发现，GPU的这种特性还可以用于神经网络的训练，因为神经网络训练中也是大量的矩阵运算，然后原来的训练速度提高了几十倍，原来需要一周训练的模型，现在几个小时就可以出结果，于是神经网络飞速发展。。。

<!-- more -->

GPU虽快，但是写起来很难写，要用自己特殊的语言[GLSL - OpenGL Shading Language](https://zh.wikipedia.org/wiki/GLSL)编写，一般都是是将其它语言编译过来或者有很多库封装好了直接使用。经过搜索发现了[gpu.js][gpujs]这个库。
> gpu.js is a JavaScript library for GPGPU (General purpose computing on GPUs) in the browser. gpu.js will automatically compile specially written JavaScript functions into shader language and run them on the GPU using the WebGL API. In case WebGL is not available, the functions will still run in regular JavaScript.

也就是说[gpu.js][gpujs]这个库会把你写的js编译成`GLSL`然后在GPU上执行，以达到加速的效果。并且，如果电脑不支持GPU，它还会当成普通的js执行。可以先到[gpu.js官网](http://gpu.rocks/)上体验一下，能达到5-10倍的提速。根据不同的电脑gpu配置，提速可能更多，这篇文章里面  https://hackernoon.com/introducing-gpu-js-gpu-accelerated-javascript-ba11a6069327 提到的Chrome提高了23倍，Firefox提高了125倍！
![gpu.rocks Disabled(default)](/blogimgs/gpurocks-disabled.png)
![gpu.rocks Enabled (This is where the REAL POWER IS!)](/blogimgs/gpurocks-enabled.png)

# 支持的语法
一开始说了，GPU的设计跟CPU差别很大，只适合做简单的计算，不适合太多复杂的逻辑。所以gpu.js也只支持js的一个很小的子集：
* 1D, 2D, 3D array of numbers or just numbers as kernel input
* 1D, 2D, 3D array of numbers as kernel output
* Number variables
* Custom and custom native functions
* Arithmetic operations (+, +=, -, *, /, %)
* Javascript Math functions (Math.floor() and etc.)
* Loops
* if and else statements
* const and let
* No variables captured by a closure


# Show Me Code
https://github.com/abhisheksoni27/gpu.js-demo

```js
const c = document.getElementById('c');

const gpu = new GPU({
    mode: 'gpu'
});

// Generate Matrices
const matrices = generateMatrices();
const A = matrices.A;
const B = matrices.B;

const gpuMatMult = gpu.createKernel(function (A, B) {
    var sum = 0;
    for (var i = 0; i < 512; i++) {
        sum += A[this.thread.y][i] * B[i][this.thread.x];
    }
    return sum;
})
    .setDimensions([A.length, B.length])
// .setOutputToTexture(true);

function cpuMatMult(m, n) {
    var result = [];
    for (var i = 0; i < m.length; i++) {
        result[i] = [];
        for (var j = 0; j < n[0].length; j++) {
            var sum = 0;
            for (var k = 0; k < m[0].length; k++) {
                sum += m[i][k] * n[k][j];
            }
            result[i][j] = sum;
        }
    }
    return result;
}

function sumMatrix(m) {
    let total = 0;
    for (let i = 0; i < m.length; i += 1) {
        for (let j = 0; j < m[i].length; j += 1) {
            total += m[i][j];
        }
        return total;
    }
}

//CPU
const startCPU = window.performance.now();
const cpuResult = cpuMatMult(A, B);
const endCPU = window.performance.now();
const cpuTime = endCPU - startCPU;
console.log(`CPU: ${cpuTime}ms, total: ${sumMatrix(cpuResult)}`);

// //GPU
const startGPU = window.performance.now();
const result = gpuMatMult(A, B);
console.log('gpuResult: ', result);
const endGPU = window.performance.now();
const gpuTime = endGPU - startGPU;
console.log(`GPU: ${gpuTime}ms, total: ${sumMatrix(result)}`);

//Diff
const diff = (cpuTime - gpuTime) / (gpuTime);
console.log(`%c ${diff}`, 'color: red;', `times faster!`)


function generateMatrices() {
    const matSize = 512;
    let A = [];
    let B = [];
    for (let i = 0; i < matSize; i += 1) {
        A[i] = [];
        B[i] = [];
        for (let j = 0; j < matSize; j += 1) {
            A[i][j] = i * matSize + (j + 1);
            B[i][j] = i * matSize + (j + 1);
        }
    }

    return {
        A,
        B
    };
}
```

# deeplearn.js
另外还有一个库是最近Google刚开源的[deeplearn.js](https://github.com/PAIR-code/deeplearnjs)， 如果要做深度学习的话是很好的工具。后面我们会找时间单独介绍。

# 总结
由于架构设计不一样，GPU很适合做简单的并发计算，应用于图像处理、深度学习等领域能大大加快速度，也直接引爆了这一次人工智能的发展。当然直接用gpu去开发程序很难编写，一般都是由特殊编译器将代码编译成可以在gpu上执行的代码。本文提高的[gpu.js][gpu]就是在前端将js的一个子集编译成能在webgl上执行的一个编译器。

当然我们的业务逻辑比较复杂，发现很难把代码改写成能在GPU上加速执行的，最后我们采用的是之前讲过的WebWorkers+WebAssembly的方式，提速也能达到数十倍，代码还简单很多，易于维护。当然不是说复杂的问题不能转化到GPU上执行，这篇文章 https://amoffat.github.io/held-karp-gpu-demo/ 就讲怎么用GPU加速去解决[TSP问题](https://en.wikipedia.org/wiki/Travelling_salesman_problem)，方法很巧妙，有兴趣的可以看看。

==============

话说我们后来根据对问题的深入分析，将问题的复杂度简化了，瞬间提速100倍😝，所以说做优化工程之前，一定要先确保算法已经没有什么优化的空间了。算法对速度的提升是远大于编程语言等的，当然算法的提速是可以跟工程优化叠加的，将两者结合起来我们的项目相比最之前的算法有将近3000倍的提速😍，完全解决了问题🤗。

# Refers
* https://github.com/gpujs
* http://gpujs.github.io/usr-docs/files/gpu-js.html
* https://hackernoon.com/introducing-gpu-js-gpu-accelerated-javascript-ba11a6069327
* http://gpu.rocks/playground/
* https://github.com/PAIR-code/deeplearnjs
* https://deeplearnjs.org/
* https://amoffat.github.io/held-karp-gpu-demo/
* https://github.com/turbo/js
* https://github.com/stormcolor/webclgl

[gpujs]: https://github.com/gpujs/gpu.js/tree/develop