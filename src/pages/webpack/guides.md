---
title: webpack guides学习笔记
draft: false
tags: [webpack, js, build tool]
category: FE
date: "2017-08-28T09:24:24Z"
---

# getting started
> Note that webpack will not alter any code other than import and export statements. If you are using other ES2015 features, make sure to use a transpiler such as Babel or Bublé via webpack's loader system.

> Custom parameters can be passed to webpack by adding two dashes between the npm run build command and your parameters, e.g. npm run build -- --colors.

# Asset Management
# CSS
style-loader, css-loader

## Images
file-loader

## Fonts
file-loader

## Data
原生支持json, csv-loader, xml-loader

# Output Management
## 多entry
```js
entry: {
  app: './src/index.js',
  print: './src/print.js'
}
```

## HtmlWebpackPlugin
避免entry points改名， 自动生成html。

## Cleaning up the ```/dist``` folder
```clean-webpack-plugin```

## Menifest
> If you're interested in managing webpack's output in other ways, the manifest would be a good place to start.


# Development
## Using source maps
```js
devtool: 'inline-source-map'
```
不要用在production上

## 自动刷新
## webpack's Watch Mode
```js
"watch": "webpack --watch"
```
## webpack-dev-server
```js
// webpack.config.js
devServer: {
  contentBase: './dist'
}
// package.json
"start": "webpack-dev-server --open"
```
## webpack-dev-middleware
跟express配合使用的。
> webpack-dev-middleware is a wrapper that will emit files processed by webpack to a server. This is used in webpack-dev-server internally, however it's available as a separate package to allow more custom setups if desired. We'll take a look at an example that combines webpack-dev-middleware with an express server.

# Hot Module Replacement
## Enabling HMR
```js
// 如果entry有其他不相关的js， 会导致full refresh
// webpack.config.js
devServer: {
  contentBase...,
  hot: true,// just client
}, 
plugins: {
  new webpack.HotModuleReplacementPlugin()// server
}
```
## 一些lib
* css的HMR直接通过`style-loader`支持的。
* [React Hot Loader](https://github.com/gaearon/react-hot-loader)
* [Redux HMR](https://survivejs.com/webpack/appendices/hmr-with-react/#configuring-hmr-with-redux)

# Tree Shaking
```js
"use strict";
/* unused harmony export square */
/* harmony export (immutable) */ __webpack_exports__["a"] = cube;
function square(x) {
  return x * x;
}
```
虽然没有export，但是bundle.js里面有，需要用能支持`dead code removal`的压缩工具。
> we'll add a minifier that supports dead code removal -- the UglifyJSPlugin -- to our configuration...

必须同时满足一下两条才可以去除无用代码：
1. 用ES2015的import/export
2. 支持`dead code removal`的压缩工具压缩
```js
// 这样不行, ES2015的module可以做static analysis
exports.square = square;
exports.cube = cube;
```

用`webpack -p`跟添加了`webpack.optimize.UglifyJsPlugin()`，以及使用`uglifyjs-webpack-plugin`没区别。
https://webpack.js.org/plugins/uglifyjs-webpack-plugin/
> webpack contains the same plugin under webpack.optimize.UglifyJsPlugin. The documentation is valid apart from the installation instructions

# Production
dev和prod分开两个config.js，共用的放在webpack.common.js，然后用[webpack-merge](https://github.com/survivejs/webpack-merge)来合并，DRY。

在prod里面用`cheap-module-source-map`， 但是又UglifyJSPlugin就没有生成source-map？！！！ https://webpack.js.org/configuration/devtool/， 原来需要提供`sourceMap: true`参数给uglify-webpack-plugin。

> When using the uglifyjs-webpack-plugin you must provide the sourceMap: true option to enable SourceMap support.

`cheap-module-source-map`不适合用于`production`，用了`sourceMap: true`也有问题。

在webpack的配置文件里面没法使用process.env，（感觉是bug或者feature缺失？[#2537](https://github.com/webpack/webpack/issues/2537))。需要用`webpack.DefinePlugin`来定义。
```js
  new webpack.DefinePlugin({
      'process.env': {
        // 'NODE_ENV': JSON.stringify('production'), // 直接用'production'会报错，生成的代码里面没有''，导致找不到变量production
        'NODE_ENV': '"production"',// 用""括起来也行，webpack是直接把process.env.NODE_ENV替换为"production"
      }
    }),
```

# Code Splitting
## Entry Points
直接多个entry就会产生多个bundle.js
```js
entry: {
    // print2: './src/print2.js',
    app: './src/index.js',
    one: './src/one.js',
    two: './src/two.js',
  },
```
但是假设`one.js`和`two.js`里面都有`lodash`，则两个bundle都会包含`lodash`，有500多KB。

## CommonsChunkPlugin
可以用`CommonsChunkPlugin`解决上面的问题， 提取`one.js`和`two.js`里面共同的`lodash`。
```js
new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      chunks: ['one', 'two'],// 因为index.js没有引用lodash，所以必须写明那几个文件的common chunks，否则提取不到！
    }),
```
注意注释， 如果不是每个文件的公共文件， 则需要明确指定chunks。
```js
 chunks: string[],
  // Select the source chunks by chunk names. The chunk must be a child of the commons chunk.
  // If omitted all entry chunks are selected.
```

## Dynamic Imports
[JS新的语法](https://github.com/tc39/proposal-dynamic-import)，跟以前用`require.ensure`类似。
```js
  return import(/* webpackChunkName: "lodash" */ 'lodash').then(_ => {
    ...
  }
```
另外还需要在`webpack.config.js`里增加：
```js
  output: {
    ...
    chunkFilename: '[name].bundle.js', // 必须有这行！
  },
```

## Bundle Analysis
分析各个bundle的大小，看是否有重复，问题出现在哪里，可能哪里可以优化等。
* [official analyze tool](https://github.com/webpack/analyse)
* [webpack-chart](https://alexkuz.github.io/webpack-chart/)
* [webpack-visualizer](https://chrisbateman.github.io/webpack-visualizer/)
* [webpack-bundle-analyzer](https://github.com/th0r/webpack-bundle-analyzer)


------------
ps, 发现一个问题，UglifyJs不支持ES6！看样子Babel是必须的啊。
```bash
ERROR in app.4df62c770fd384e3a460.bundle.js from UglifyJs
Unexpected token: operator (>) [./src/dynamic-imports.js:5,0][app.4df62c770fd384e3a460.bundle.js:157,96]
```

# Lazy Loading
用`import()`实现动态加载的目的就是为了延迟加载，提高初始加载的效率， 所以可以在需要异步延迟加载的地方直接使用`import()`就可以了。

# Cache
使用`output.filename`[https://webpack.js.org/configuration/output#output-filename](substitutions)，可以用`[hash]`和`[chunkhash]`，但是`[hash]`是每一次构建，每个文件都共用同一个hash值，所以一个文件变化，所有都会变化，不好！最好用`[chunkhash]`。 记得，`import()`动态引入的也加上hash:
```js
// webpack.prod.js
  output: {
    filename: "[name].[chunkhash].bundle.js",
    chunkFilename: "[name].[chunkhash].bundle.js",
  },
```

貌似webpack2.1（官网文档的版本）有bug，出现如下为问题：
> As you can see the bundle's name now reflects its content (via the hash). If we run another build without making any changes, we'd expect that filename to stay the same. However, if we were to run it again, we may find that this is not the case:

> This is because webpack includes certain boilerplate, specifically the runtime and manifest, in the entry chunk.

> Output may differ depending on your current webpack version. Newer versions may not have all the same issues with hashing as some older versions, but we still recommend the following steps to be safe.

## Extracting Boilerplate
可以用`CommonsChunkPlugin`配置一个entry里都没有的名字，就可以提取出公共chunk，也就是什么都“没有”。实际上不是什么都没有，而是webpack的`runtime`，这样就可以解决前面说的问题， 不过我在webpack3.5.5里没有碰到问题， 所以就先不用了。

## Module Identifiers
由于默认webpack的module ID用的是自增的数字，所以有可能增加一个文件，导致所有的module ID都变了， 导致所有文件“内容”都变化。
> This is because each module.id is incremented based on resolving order by default. Meaning when the order of resolving is changed, the IDs will be changed as well. 

有两个插件可以解决问题，`NamedModulesPlugin`和`HashedModuleIdsPlugin`。
```js
    new webpack.NamedModulesPlugin(),
    // new webpack.HashedModuleIdsPlugin(),
```
> Luckily, there are two plugins we can use to resolve this issue. The first is the NamedModulesPlugin, which will use the path to the module rather than a numerical identifier. While this plugin is useful during development for more readable output, it does take a bit longer to run. The second option is the HashedModuleIdsPlugin, which is recommended for production builds:

# Shimming
本部分介绍如何不是“正规”的module，比如如何引入全局变量（如jQuery），如何引入polyfill等。用到的时候再说。

# Typescript
需要4个条件：
1. TypeScript编译器
2. Typescript loader，比如[ts-loader](https://github.com/TypeStrong/ts-loader), 或者[awesome-typescript-loader](https://github.com/s-panferov/awesome-typescript-loader)
3. tsconfig.json
4. webpack.config.js


# Build Performance

# Public Path