---
title: Electron入门资料
draft: false
tags: [electron, typescript, create react app, react]
category: FE
date: "2018-05-12T16:57:42Z"
---

最近要做个 Desktop 软件， 当然首选 Electron， 另外最近用 Typescript 感觉很爽， 所以技术选型为 Electron + React + Typescript， 为了省事想找个 starter 脚手架， 大概找了下面这些。

<!-- more -->

------------2018-05-13 更新----------

使用[electron-react-typescript-boilerplate](https://github.com/iRath96/electron-react-typescript-boilerplate)的时候发现一个问题： 在 class 里面不能使用`arrow function`！ 比如如下代码有问题：

```js
import * as React from 'react';
// import { remote } from 'electron';
// import './App.css';

// const electron = (window as any).require('electron');
// const fs = electron.remote.require('fs');
// const ipcRenderer = electron.ipcRenderer;

import { ipcRenderer, remote } from 'electron';
console.log(ipcRenderer, remote.require('fs'));

// console.log(fs, ipcRenderer);

// const logo = require('./logo.svg');

class App extends React.Component<any, any> {
  // state = {} as any;
  constructor(props: any) {
    super(props);
    this.state = {} as any;
  }
  componentDidMount() {
    console.log('componentDidMount ');
  }

  handleClick = () => {
    // handleClick() {
    console.log('handleClick');
    this.setState({
      name: 'magicly'
    });
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
        <button onClick={this.handleClick}>butotn...</button>
        {this.state.name}
      </div>
    );
  }
}

export default App;
```

点击 button 的时候会报错:

```js
warning.js:33 Warning: Can't call setState on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the App component.
```

但其实这个是再正常不过的代码了啊， 在普通的`create-react-app`建的项目里面完全没有问题， 即使运行在`electron`中也是完全 ok 的。 所以决定最后还是选择`create-react-app`新建 Typescript 项目， 然后添加 electron 依赖好了。 当然这个脚手架也有好处，就是可以直接使用`import { ipcRenderer, remote } from 'electron';`。

其实后来仔细想了下， 为啥要用 electron 呢？ 相比直接网页多了什么？

* 能获得更多的原生接口？

现在 H5 的丰富接口已经完全够用， 包括 service worker 可以离线， web worker 多线程， websocket， notification 等。

* 高性能？

可以使用 WebAssembly， 并发可以用 web workers.

* 接口请求跨域？

可以通过添加 chrome 插件来支持。

* 浏览器兼容性！

对了， 这个似乎说到了重点， electron 把 node 和 chrome 打包进去了， 能保证运行环境一致， 不用再为兼容性问题头痛！

总之， 如果是自己使用的项目（或者可以跟客户协商的话），其实 chrome 网页基本完全够用了， so， 先就做网页吧。

---

# https://github.com/electron/electron-quick-start

electron 自己出的， 其实就是个 Hello World， 用 JS 语言， 不满足要求。

# https://github.com/electron/electron-quick-start-typescript

上一个的 Typescript 版本， 只是 Hello World，不行。

# https://github.com/chentsulin/electron-react-boilerplate

这个算是 stars 数比较多的一个了， 综合了 React + Redux + React Router + Webpack + HMR， 算是满足我的要求了。 Static Type Checking 用的[Flow](https://flow.org/)， 之前也用过， 还不错， 不过感觉使用场景没有 Typescript 那么广呢， 后来决定用 TS， 所以这次也用 TS 吧。

# https://github.com/iRath96/electron-react-typescript-boilerplate

> This is a slight modificiation of the great electron-react-boilerplate by chentsulin. Instead of Babel and flow this version uses TypeScript. Support for Sass has also been added.

上一个的 Typescript 版本， 哎， 正好！

# Create React App + Electron

前面的感觉都是以 Electron 为主， 然后加上一些前端技术栈。 可以反过来想， 能不能直接用[CRA](https://github.com/facebook/create-react-app)新建项目， 然后加上 Electron 依赖呢？

还真有人这样做了， 就是这篇[How to build an Electron app using create-react-app. No webpack configuration or “ejecting” necessary.](https://medium.freecodecamp.org/building-an-electron-application-with-create-react-app-97945861647c)。

大概步骤如下：

1.  create-react-app 新建项目（现在可以添加`--scripts-version=react-scripts-ts`创建 Typescript 项目了）
2.  `npm i -D electron`，添加 electron 为依赖
3.  将[electron-quick-start](https://github.com/electron/electron-quick-start)里的`main.js`（是 electron 的入口文件）copy 过来，可以改个名字比如`electron-starter.js`
4.  修改 3 中的`mainWindow.loadURL`参数为`localhost:3000`
5.  在`package.json`中添加如下内容：

```js
  "main": "src/electron-starter.js",
  "scripts": {
    "electron": "electron ."
  }
```

6.  执行`npm start`然后执行`npm run electron`

这样就可以享受所有 CRA 的好处了， 如果是已经有一个 react 项目的话， 这样迁移过来是最容易的了。

有两个小问题， 一是 4 中`mainWindow.loadURL`的参数， 我们指定为`localhost:3000`， 这个其实是 CRA 的开发环境的地址，如果最后正式发布的话， 应该配置`npm run build`之后的`index.html`， 可以通过环境变量控制。

```js
"electron-dev": "ELECTRON_START_URL=http://localhost:3000 electron ."
```

然后将`electron-starter.js`相应内容改为:

```js
const startUrl =
  process.env.ELECTRON_START_URL ||
  url.format({
    pathname: path.join(__dirname, "/../build/index.html"),
    protocol: "file:",
    slashes: true
  });
mainWindow.loadURL(startUrl);
```

还有一个问题， CRA 默认打包出来的`index.html`里面引用资源是认为放在根目录下， 所以需要在`package.json`里面配置`home`:

```js
"homepage": "./",
```

最后还有一个问题， 在我们通常写的 JS 代码里面直接 require `electron`是有问题的，可以通过如下方法解决（参看[讨论](https://github.com/electron/electron/issues/7300)）：

```js
const electron = window.require("electron");
const fs = electron.remote.require("fs");
const ipcRenderer = electron.ipcRenderer;
```

感觉这种方式是从现有 React 项目迁移的最好方法了， 不过对 electron 的其他东西，比如打包之类的都没有涉及。

这里还有更多[boilerplates](https://electronjs.org/community#boilerplates)， 下面这几个还没有看过仅供参考：

* https://github.com/emk/electron-test ， 这个还整合了 Rust， 也是我后面可能需要的， mark 一下。
* https://github.com/skellock/typescript-with-electron-react-kit
* http://blog.scottlogic.com/2017/06/06/typescript-electron-webpack.html

下面几个 repo 也可以看一下， 作为入门 electron 资料还是很不错的：

* https://github.com/electron/simple-samples
* https://github.com/electron/electron-api-demos
* https://github.com/hokein/electron-sample-apps

当然， 最完整权威的资料还是[官网文档](https://electronjs.org/docs)了！
