---
title: TypeScript React Native入门
draft: false
tags: [typescript, ts, react, rn, redux, react native]
category: FE
date: "2018-02-25T08:35:42Z"
---

[上一篇我们介绍了TypeScript如何跟React搭配使用](https://magicly.me/ts-react-starter/)，这篇我们继续介绍如何在React Native中使用TS。

关于React Native，我之前写过一本[React Native电子书](http://gitbook.cn/gitchat/column/5a17c2e113c02f4a35ca5a7d)， 如果不熟悉RN的话可以参考一下。

本文涵盖内容如下：
* TypeScript & React Native
* TSLint
* Jest

<!-- more -->

# 准备知识
本文假设读者已经知道如何用RN进行开发，至少是把开发环境搭建起来，能在模拟器或者手机上运行App了。如果不了解的话， 请参考[React Native 移动开发入门与实战](http://gitbook.cn/gitchat/column/5a17c2e113c02f4a35ca5a7d)。

# 新建项目
用`react-native init`正常初始化一个RN项目。
```bash
react-native init TSReactNativeDemo
```

项目初始结构为：
```bash
➜  TSReactNativeDemo tree -L 1
.
├── App.js
├── __tests__
├── android
├── app.json
├── index.js
├── ios
├── node_modules
├── package.json
└── yarn.lock

4 directories, 5 files
```

# 运行
在手机或者模拟器上运行起来。
```bash
react-native run-android
react-native run-ios
```

# 引入TypeScript
目前React Native Packager是通过Babel编译`.js`文件以及打包的，暂时还没有特别好的方法直接使用`.tsx`。所以基本思路就是， 先用TypeScript的编译器`tsc`将`.ts`或`.tsx`文件编译成`.js`文件，再用React Native Packager编译打包即可。

首先我们安装TS依赖：
```bash
yarn add -D typescript
```
然后需要安装types：
```bash
yarn add -D @types/react @types/react-native
```
然后需要配置`tsconfig.json`，可以用如下命令生成：
```bash
tsc --init --pretty --sourceMap --target es2015 --outDir ./lib --rootDir ./ --module commonjs --jsx react
```
生成的文件里面有具体每个参数的含义，也可以参考[TS官网文档](http://www.typescriptlang.org/docs/handbook/tsconfig-json.html)。 也可以直接参考上一篇中的`tsconfig.json`文件，进行少许修改即可。

# 编写TS组件
上面配置好TS后， 我们就可以开始用TS写组件了。还是跟上篇一样， 写一个简单的`Counter.tsx`。
```jsx
import * as React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

interface Props {
  name: string;
  count?: number;
  onInc?: () => void;
  onDec?: () => void;
}

export default ({ name, count = 1, onInc, onDec }: Props) => (
  <View style={styles.root}>
    <Text>
      Counter {name}: {count}
    </Text>
    <View>
      <Button title="+" onPress={onInc || (() => {})} />
      <Button title="-" onPress={onDec || (() => {})} />
    </View>
  </View>
);

// styles
const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    alignSelf: 'center',
  },
  buttons: {
    flexDirection: 'row',
    minHeight: 70,
    alignItems: 'stretch',
    alignSelf: 'center',
    borderWidth: 5,
  },
  button: {
    flex: 1,
    paddingVertical: 0,
  },
  greeting: {
    color: '#999',
    fontWeight: 'bold',
  },
});
```
然后我们执行`./node_modules/.bin/tsc`命令，就会在`lib`目录下生成相同目录结构的`.js`文件等。
```bash
➜  TSReactNativeDemo git:(master) ✗ tree lib -L 3
lib
└── src
    └── components
        ├── Counter.js
        └── Counter.js.map

2 directories, 2 files
```
然后在`App.js`中如下使用`Counter`即可：
```jsx
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Counter from './lib/src/components/Counter';

export default () => (
  <View style={styles.container}>
    <Text style={styles.welcome}>Welcome to React Native!</Text>
    <Counter name="counter1" count={10} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
```
由于`lib/`目录下的文件是编译生成，因此不需要放在git里面， 我们在`.gitingore`中添加`lib/`忽略之：
```
# TypeScript
lib/
```

# 测试
**注意**， [enzyme测试ReactNative需要用react-native-mock](http://airbnb.io/enzyme/docs/guides/react-native.html)， 但是[`react-native-mock`目前不支持React v16+](https://github.com/RealOrangeOne/react-native-mock/issues/139)， 因此暂时不采用enzyme吧。

RN还是用Jest做测试，为了支持TS，我们安装`ts-jest`包。
```bash
yarn add -D ts-jest
```
同样，我们也添加相应的`@types`：
```bash
yarn add -D @types/jest @types/react-test-renderer
```
修改`package.json`文件里面`jest`属性：
```json
"jest": {
    "preset": "react-native",
    "moduleFileExtensions": [
        "ts",
        "tsx",
        "js"
    ],
    "transform": {
        "^.+\\.(js)$": "<rootDir>/node_modules/babel-jest",
        "\\.(ts|tsx)$": "<rootDir>/node_modules/ts-jest/preprocessor.js"
    },
    "testRegex": "(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$",
    "testPathIgnorePatterns": [
        "\\.snap$",
        "<rootDir>/node_modules/",
        "<rootDir>/lib/"
    ],
    "cacheDirectory": ".jest/cache"
}
```
然后我们就可以写测试代码了：
```jsx
// src/components/Counter.test.tsx
import * as React from 'react';
import * as enzyme from 'enzyme';
import Counter from './Counter';

it('renders the correct text when count is not given', () => {
  const hello = enzyme.shallow(<Counter name="counter1" />);
  expect(hello.find('.counter').text()).toEqual('Counter counter1: 1');
});
```

更多关于Jest测试可以参考[测试 Jest](http://gitbook.cn/gitchat/column/5a17c2e113c02f4a35ca5a7d/topic/5a17de5713c02f4a35ca67af)。

# 配置TSLint
不像上一篇用`react-scripts-ts`的话TSLint是自动配置好的， 我们需要手动安装TSLint。
```bash
yarn add -D tslint tslint-react
```
然后把上一章的`tslint.json`文件复制过来。再在`package.json`文件中增加如下代码：
```json
    "lint": "tslint -c tslint.json 'src/**/*.{ts,tsx}'",
```
然后就可以用`yarn lint`检查代码了。

为了在写代码的时候就能在VSCode里面获得错误提示， 可以安装VSCode的TSLint插件。

# 其他
最后我们做一些额外工作提高开发效率。首先我们将`tsc`命令写到`package.json`里， 同时提供一个选择开启`watch`模式。这样子执行`yarn tsc-watch`命令后， TS就能实时编译为JS了，再配合上RN的`Live Reload`或者`Hot Reloading`能大大提高开发效率。
```json
    "tsc": "tsc",
    "tsc-watch": "tsc --watch",
```

Redux在RN中使用跟在React中使用没什么区别，参考[TypeScript React入门](/ts-react-starter)即可。

本文代码托管在https://github.com/magicly/TSReactNativeDemo ，随意使用~

# Refers
* https://github.com/Microsoft/TypeScript-React-Native-Starter
* https://github.com/kulshekhar/ts-jest
* https://www.typescriptlang.org/docs/home.html
* http://airbnb.io/enzyme/
* https://palantir.github.io/tslint/rules/no-implicit-dependencies/
* https://palantir.github.io/tslint/usage/rule-flags/
* https://stackoverflow.com/questions/31605781/why-do-tslint-and-jslint-report-empty-blocks
* https://medium.com/@rintoj/react-native-with-typescript-40355a90a5d7
* http://bbs.reactnative.cn/topic/4483/使用typescript编写react-native-高效版
* https://zhuanlan.zhihu.com/p/27029898