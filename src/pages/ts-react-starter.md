---
title: TypeScript React入门
draft: false
tags: [typescript, ts, react]
category: FE
date: "2018-02-24T10:15:42Z"
---

Javascript作为一门动态语言， 简单易学，容易上手，非常适合web开发（浏览器也只支持JS啊）。但是随着项目逐渐变大，动态语言的弊端慢慢显露出来，比如没有编译器检查，代码质量不容易保证，IDE支持有限， 不便于重构等等， 而且JS设计之初比较仓促遗留了很多问题，好在ES6等后续版本慢慢修复了很多问题。也有各种尝试将其它语言编译成JS来做web开发，包括GWT、Dart、Java、Scala、Kotlin、Go等，而微软出的TypeScript由于一系列的优点，算是目前最流行的吧。当前Web开发基本是三大框架三分天下：Angular、React、Vue，而Angular本身就是TS开发的，React和Vue也支持TS开发。本文就简单介绍一下如何用TS开发React。

另外Facebook自己开发的Flow也可以给JS添加静态类型，我之前写过一篇文章介绍React Native里面如何使用Flow，有兴趣的可以移步[Flow使用](http://gitbook.cn/gitchat/column/5a17c2e113c02f4a35ca5a7d/topic/5a17de4013c02f4a35ca67a6)。

本文涵盖内容如下：
* TypeScript & React
* TSLint
* Jest & Enzyme
* Redux

<!-- more -->

# 安装create-react-app
```bash
npm i -g create-react-app
```

# 新建项目
```bash
create-react-app ts-react-demo --scripts-version=react-scripts-ts
```
[react-scripts-ts](https://github.com/wmonk/create-react-app-typescript)是CRA的一个fork，可以很方便的开始使用TS。

项目初始结构为：
```bash
➜  ts-react-demo tree -L 1
.
├── README.md
├── node_modules
├── package.json
├── public
├── src
├── tsconfig.json
├── tsconfig.test.json
├── tslint.json
└── yarn.lock

3 directories, 6 files
```
其中：
* tsconfig.json是关于TS编译器的一些配置项；
* tslint.json，是TSLint的配置文件，类似ESLint

其他文件跟普通CRA建的项目一样。

# 运行
```bash
npm start
```
会自动启动浏览器打开http://localhost:3000 。

# 测试
```bash
npm run test
```
会运行Jest做测试， 检查所有以`.test.ts`或者`.spec.ts`结尾的文件。

# 打正式包
```bash
npm run build
```

下面， 我们正式开始用TS来写React组件。
# 创建组件 
我们写一个简单的`Counter`组件，接受`name`和`count`参数， 显示`Counter {name}: {count}`，可以如下调用：
```jsx
<Counter name="counter1" count={1} />
```
React里，最简单的写组件的方式是用函数定义，即所谓的[Stateless Component](https://react-course.magicfun.ai/basics/stateless-component.html)，定义如下：
```jsx
// src/components/Counter.tsx

import * as React from 'react';

interface Props {
  name: string;
  count?: number;
}

export default ({ name, count = 1 }: Props) => (
  <div>
    Counter {name}: {count}
  </div>
);
```
当然也可以用`class`的方式定义组件，写作如下：
```jsx
export default class Counter extends React.Component<Props, object> {
  render() {
    const { name, count = 1 } = this.props;
    return (
      <div>
        Counter {name}: {count}
      </div>
    );
  }
}
```
这里`React.Component<Props, object>`第一个是`props`的参数类型， 第二个是`state`的类型。因为我们暂时用不到`state`，所以简单放一个`objcet`类型即可。

然后我们修改`index.tsx`文件：
```jsx
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Hello from './components/Counter';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

ReactDOM.render(<Hello name="counter1" />, document.getElementById('root') as HTMLElement);
registerServiceWorker();
```
最后提一下`document.getElementById('root') as HTMLElement`是TS里的强制类型转化，因为`document.getElementById('root')`返回的类型是`HTMLElement | null`，即有可能为null。当然了， 如果html里面没有id是root的DOM，返回值就是null了。但是这里我们自己知道肯定有id是root的DOM的， 也就是说我们比TS编译器更清楚事实真相，所以可以用强制类型转化告诉编译器。PS, 其实不做貌似也没问题。

# 添加样式
前端开发，一个很重要的工作就是编写样式。CRA（也就是webpack和一堆loaders）支持直接`import css`，所以我们可以直接编写`src/components/Counter.css`，然后在`Counter.tsx`中`import`即可。
```css
/* src/components/Counter.css */
.counter {
  text-align: center;
  font-size: 48px;
}
```
```jsx
import * as React from 'react';
import './Counter.css';

interface Props {
  name: string;
  count?: number;
}
export default ({ name, count = 1 }: Props) => (
  <div className="counter">
    Counter {name}: {count}
  </div>
);
```
当然，由于CSS只有全局作用域，很容易出现命名冲突，现在越来越流行用CSSInJS来开发，推荐使用[Styled Components](https://react-course.magicfun.ai/css/)。

# 测试
我们用[Enzyme](http://airbnb.io/enzyme/)来做测试。首先安装依赖：
```bash
npm i -D enzyme @types/enzyme react-addons-test-utils
```
其中`enzyme`是实际运行的代码， `@types/enzyme`是类型声明文件，类似于C/C++中的`.h`文件。

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

**注意！！！**：这里我遇到一些问题， 直接执行`npm run test`，报错：
```bash
Error: Cannot find module './development/fe/ts-react-demo/node_modules/jest-cli'
```
发现`jest-cli`目录为空：
```bash
➜  ts-react-demo git:(master) ✗ ll node_modules/jest-cli
total 0
drwxr-xr-x  3 magicly  staff    96B  2 24 12:12 node_modules
```
而重新用`yarn`安装所有依赖， 则正常了：
```bash
➜  ts-react-demo git:(master) ✗ ll node_modules/jest-cli
total 16
-rw-r--r--   1 magicly  staff   595B  5 12  2017 README.md
drwxr-xr-x   3 magicly  staff    96B  2 24 12:16 bin
drwxr-xr-x  23 magicly  staff   736B  2 24 12:16 build
drwxr-xr-x   3 magicly  staff    96B  2 24 12:16 node_modules
-rw-r--r--   1 magicly  staff   1.7K  5 24  2017 package.json
```
貌似`jest`跟`yarn`更适合？
然后执行`npm run test`报错：
```bash
FAIL  src/components/Counter.test.tsx
  ● renders the correct text when no count is given


          Enzyme Internal Error: Enzyme expects an adapter to be configured, but found none. To
          configure an adapter, you should call `Enzyme.configure({ adapter: new Adapter() })`
          before using any of Enzyme's top level APIs, where `Adapter` is the adapter
          corresponding to the library currently being tested. For example:

          import Adapter from 'enzyme-adapter-react-15';

          To find out more about this, see http://airbnb.io/enzyme/docs/installation/index.html
```
因为我们用的Reactv16，安装相应adapter即可：
```bash
npm i -D enzyme-adapter-react-16
```
结果，很奇怪，`jest-cli`又被清空了！又重新用`yarn`安装了一次，ok了， 看样子以后用CRA的话还是用yarn吧，毕竟都是Facebook的产品。

还会报错说没有`enzyme-adapter-react-16`的类型定义信息， 于是安装之: `yarn add -D @types/enzyme-adapter-react-16`。 一起正常了！
```bash
 PASS  src/components/Counter.test.tsx
  ✓ renders the correct text when count is not given (3ms)
  ✓ renders the correct text when count is given (1ms)

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        0.597s, estimated 2s
Ran all test suites related to changed files.

Watch Usage: Press w to show more.
```
最终测试代码如下：
```jsx
// src/components/Counter.test.tsx

import * as React from 'react';
import * as enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import Counter from './Counter';

enzyme.configure({ adapter: new Adapter() });

it('renders the correct text when count is not given', () => {
  const hello = enzyme.shallow(<Counter name="counter1" />);
  expect(hello.find('.counter').text()).toEqual('Counter counter1: 1');
});

it('renders the correct text when count is given', () => {
  const hello = enzyme.shallow(<Counter name="counter1" count={5} />);
  expect(hello.find('.counter').text()).toEqual('Counter counter1: 5');
});
```

# 状态管理
稍微复杂点的应用都需要专门的状态管理工具， 比较流行的有[Redux](http://redux.js.org/)和[MobX](https://mobx.js.org/)， 这里我们使用[更熟悉的Redux](http://gitbook.cn/gitchat/column/5a17c2e113c02f4a35ca5a7d/topic/5a17ddd313c02f4a35ca676f), 以前做培训的时候录制过一个[redux视频](https://www.bilibili.com/video/av17174653/)，有兴趣的可以看看。

## 安装redux
首先我们还是安装`redux`和`react-redux`。
```bash
yarn add redux react-redux @types/react-redux
```
这里我们只需要安装`react-redux`的types，因为`redux`包里自己包含了类型定义（现在很多流行的包都这样做了，也可以反映出TS的流行程度）。

redux有三个重要部分，分别是`state`, `action`和`reducer`，接下来我们分别介绍。
## state
redux的设计原则是整个App里就只有一颗状态树，我们的应用比较简单，状态只有两个变量即可：
```js
// src/types/index.tsx
export interface StoreState {
  name: string;
  count: number;
}
```

## actions
action就是简单的JS对象，只需要有`type`属性即可，为了便于重构，我们把用作`action.type`的字符串作为常量放在单独的文件。 
```js
// src/constants/index.ts

export const INCX = 'INC';

export const DEC = 'DEC';
```
然后定义`action`文件：
```js
import * as constants from '../constants';

interface ActionINC {
  type: typeof constants.INC;
}
interface ActionDEC {
  type: typeof constants.DEC;
}

export type ActionCount = ActionINC | ActionDEC;

export function inc() {
  return {
    type: constants.INC,
  };
}

export function dec() {
  return {
    type: constants.DEC,
  };
}
```
**注意**，TS有[字符串字面量类型String Literal Types](https://www.typescriptlang.org/docs/handbook/advanced-types.html)，也就是说`typeof 'INC'`类型也就是`'INC'`，但是不能把作为`type`的`'INC'`跟作为字符串本身的`'INC'`混淆。这就是为什么在定义`ActionINC`中，需要使用`typeof constants.INC`而不能直接使用`constants.INC`（会报找不到INC）。

如果觉得我们为了定义两个action写了太多**boilerplate**代码， 可以看一下[redux-actions](https://github.com/reduxactions/redux-actions)。

## reducers
redux中，reducer是一个pure function，接受之前的状态和当前的action，返回下一个状态，即：
```js
(prevState, action) => nextState
```
```js
// src/reducers/index.ts

import { ActionCount } from '../actions';
import { StoreState } from '../types';
import { INC, DEC } from '../constants';

export default function reducer(prevState: StoreState, action: ActionCount): StoreState {
  switch (action.type) {
    case INC:
      return { ...prevState, count: prevState.count + 1 };
    case DEC:
      return { ...prevState, count: prevState.count - 1 };
    default:
      return prevState;
  }
}
```

## Container Component
一般在开发React应用时，我们会把控制显示的组件定义成无状态组件（Stateless Functional Component），然后在此基础上包装状态，控制逻辑。可以参考redux作者[Dan Abramov](https://twitter.com/dan_abramov)的这篇文章[Presentational and Container Components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)。

我们先给`Presentational`组件`Counter`添加一些行为，可以增加和减少count。
```jsx
// src/components/Counter.tsx

import * as React from 'react';
import './Counter.css';

interface Props {
  name: string;
  count?: number;
  onInc?: () => void;
  onDec?: () => void;
}

export default ({ name, count = 1, onInc, onDec }: Props) => (
  <div className="counter">
    Counter {name}: {count}
    <div>
      <button onClick={onInc}>+</button>
      <button onClick={onDec}>-</button>
    </div>
  </div>
);
```
然后我们用`react-redux`的`connect`将`redux`的状态等跟`Counter`组件关联起来。`connect`函数接受两个参数：
* mapState2Props： 将state跟props关联起来，redux的state变化的时候自动触发props更新导致组件重新渲染
* mapDispatch2Props： 将redux的dispatch传递给事件回调函数，用户触发redux的state更新

```jsx
// src/containers/Counter.tsx
import { connect, Dispatch } from 'react-redux';
import Counter from '../components/Counter';
import * as actions from '../actions';
import { StoreState } from '../types';

const mapState2Props = ({ name, count }: StoreState) => {
  return {
    name,
    count,
  };
};

const mapDispatch2Props = (dispatch: Dispatch<actions.ActionCount>) => {
  return {
    onInc: () => dispatch(actions.inc()),
    onDec: () => dispatch(actions.dec()),
  };
};

export default connect(mapState2Props, mapDispatch2Props)(Counter);
```

## Store
最后，我们在最上层组件（通常是在index.tsx里），初始化redux的store，然后传递下去。
```jsx
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { StoreState } from './types';
import reducer from './reducers';
import Hello from './containers/Counter';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

const store = createStore<StoreState>(reducer, { name: 'counter1', count: 0 });

ReactDOM.render(
  <Provider store={store}>
    <Hello />
  </Provider>,
  document.getElementById('root'),
);
registerServiceWorker();
```

一切都搞定了。 最后，如果要部署上线的话， 请记得用`yarn run build`打包压缩代码，然后部署`build`目录下的文件即可。

本文代码托管在https://github.com/magicly/ts-react-demo ，随意使用~

# Refers
* https://github.com/Microsoft/TypeScript-React-Starter
* https://github.com/wmonk/create-react-app-typescript
* https://www.typescriptlang.org/docs/home.html
* http://airbnb.io/enzyme/