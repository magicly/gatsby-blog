---
title: Typescript如何import json文件
draft: false
tags: [Typescript, json]
category: FE
date: "2018-04-26T21:51:32Z"
---

Node.js 里面引用 json 文件很容易， 如果是 ES5 的话， 用`require`，如果是 ES6 的话用`import`。 比如 `test.json` 文件如下：

```json
{
  "hello": "typescript"
}
```

js 代码如下：

```js
// ES5 testjson.js
const json = require("./test.json");
console.log(json.hello);

// ES6
import * as json from "./test.json";
console.log(json.hello);
```

注意， Node9 以上才支持 ES6 的 import/export 机制， 且后缀名是`.mjs`。

直接把`testjson.js`改为`testjson.ts`会报错，说`[ts] Cannot find module './test.json'.`。

# 解决方案

Typescript2 支持[Wildcard module declarations](https://www.typescriptlang.org/docs/handbook/modules.html)，很好地解决了这个问题。 添加`typings.d.ts`文件， 在里面配置：

```
declare module '*.json' {
  const value: any;
  export default value;
}
```

```js
import * as json from "./test.json";
console.log(json.hello);
```

还会报错说没有`hello`：

```js
[ts] Property 'hello' does not exist on type 'typeof '*.json''.
any
```

可以做一次 any 转换即可：

```js
import * as json from './test.json';
console.log((json as any).hello);
```

# 参考资料

* https://hackernoon.com/import-json-into-typescript-8d465beded79
