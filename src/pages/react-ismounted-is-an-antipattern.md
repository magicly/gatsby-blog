---
title: react系列之isMounted is an Antipattern
draft: false
tags: [react]
category: FE
date: "2016-11-19T17:45:42Z"
---

用了一年多的[React](https://facebook.github.io/react/)，真是爽的不要不要的， 谁用谁知道， 一般人我不告诉他！

最近用的过程中发现console里面总是出现这样的警告
```
react.js:20478 Warning: setState(...): Can only update a mounted or mounting component. This usually means you called setState() on an unmounted component. This is a no-op. Please check the code for the Small component.
```
虽不影响使用， 但是对于一个有代码洁癖的有追求的程序员来说， 怎么受得了呢！

react的error或者warning信息还是写得比较好的， 从上面我们可以看出原因是我们在一个unmounted的component上调用setState方法。分析业务代码， 发现是某个弹窗component需要从server加载数据， 有时候网络慢， 还没有加载出来用户就把弹窗关了， 所以对应的component变成了unmounted， 等到fetch请求成功之后， 再调用setState就warning了。

为了方便分析问题， 我把问题简化了， 同时为了用户直接能在浏览器打开看到效果， 而不用nodejs、npm、babel、webpack、react等一堆东西install半天， 我直接引用了react cdn上的文件。代码如下：
```html
<!DOCTYPE html>
<html>

<head>
	<meta charset="UTF-8" />
	<title>Hello World</title>
	<script src="https://unpkg.com/react@latest/dist/react.js"></script>
	<script src="https://unpkg.com/react-dom@latest/dist/react-dom.js"></script>
	<script src="https://unpkg.com/babel-standalone@6.15.0/babel.min.js"></script>
</head>

<body>
	<div id="root"></div>
	<script type="text/babel">

  class Big extends React.Component {
    constructor() {
      super();
      this.state = {
        small: true
      }
    }
    closeSmall = () => {
      console.log('closeSmall');
      this.setState({ small: false });
    }
    render() {
      return <div>
        <h1>hello from Big Component </h1>
        <h2 onClick={this.closeSmall}>close small </h2>
        {this.state.small ? <Small /> : null}
      </div>
    }
  }
  class Small extends React.Component {
    constructor() {
      super();
      this.state = {
        data: 'init data'
      }
    }
    componentDidMount() {
      console.log('componentDidMount');
      setTimeout(() => {
        console.log('fetch data from server succeed...')
        console.log(`this._isMounted: ${this._isMounted}`)
        this.setState({ data: 'data from server' });
      }, 5000)
    }
    render() {
      return <div>
        <h1>hello from Small Component ...  </h1>
        data: {this.state.data}
      </div>
    }
  }

      ReactDOM.render(
        <Big />,
        document.getElementById('root')
      );

    </script>
</body>

</html>
```
代码里面用setTimeout模拟了从server获取数据， 大家如果在5s内点击close small， 就可以重现这个问题。

问题的解决方法很自然地想到，如果可以在setState之前检查一下this component是否还是mounted状态就可以了。查react的文档，发现原来之前确实是有isMounted()这个方法的， 不过已经不推荐使用了， 因为[isMounted is an Antipattern](https://facebook.github.io/react/blog/2015/12/16/ismounted-antipattern.html)。

第一种解决方法就是自己模拟实现isMounted这个方法， 虽然已经被贴上Antipattern的标签， 但是有些时候用这种方法还是比较方便的。代码如下：
```html
<!DOCTYPE html>
<html>

<head>
	<meta charset="UTF-8" />
	<title>Hello World</title>
	<script src="https://unpkg.com/react@latest/dist/react.js"></script>
	<script src="https://unpkg.com/react-dom@latest/dist/react-dom.js"></script>
	<script src="https://unpkg.com/babel-standalone@6.15.0/babel.min.js"></script>
</head>

<body>
	<div id="root"></div>
	<script type="text/babel">

  class Big extends React.Component {
    constructor() {
      super();
      this.state = {
        small: true
      }
    }
    closeSmall = () => {
      console.log('closeSmall');
      this.setState({ small: false });
    }
    render() {
      return <div>
        <h1>hello from Big Component </h1>
        <h2 onClick={this.closeSmall}>close small </h2>
        {this.state.small ? <Small /> : null}
      </div>
    }
  }
  class Small extends React.Component {
    constructor() {
      super();
      this.state = {
        data: 'init data'
      }
      this._isMounted = false;
    }
    componentDidMount() {
      this._isMounted = true;
      console.log('componentDidMount');
      setTimeout(() => {
        console.log('fetch data from server succeed...')
        console.log(`this._isMounted: ${this._isMounted}`)
        if (this._isMounted) {
          this.setState({ data: 'data from server' });
        }
      }, 5000)
    }
    componentWillUnmount() {
      this._isMounted = false;
    }
    render() {
      return <div>
        <h1>hello from Small Component ...  </h1>
        data: {this.state.data}
      </div>
    }
  }

      ReactDOM.render(
        <Big />,
        document.getElementById('root')
      );

    </script>
</body>

</html>
```

对于callback现在已经有更好的解决方案， 伟大的[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)！如果这个promise能在componentWillUnmount()的时候cancel掉就完美了。可惜google之后发现官方Promise实现目前并不支持cancel！[看这里](http://stackoverflow.com/questions/29478751/how-to-cancel-an-emcascript6-vanilla-javascript-promise-chain)， 还有[这里](http://stackoverflow.com/questions/30233302/promise-is-it-possible-to-force-cancel-a-promise)，所以除非你使用第三方Promise库， 比如据说性能比原生还好的[Bluebird](http://bluebirdjs.com/docs/api/cancellation.html)。

当然有些时候没必要搞这么复杂， facebook的[文档](https://facebook.github.io/react/blog/2015/12/16/ismounted-antipattern.html)给了一个简易的cancelable的Promise。最好代码如下：
```html
<!DOCTYPE html>
<html>

<head>
	<meta charset="UTF-8" />
	<title>Hello World</title>
	<script src="https://unpkg.com/react@latest/dist/react.js"></script>
	<script src="https://unpkg.com/react-dom@latest/dist/react-dom.js"></script>
	<script src="https://unpkg.com/babel-standalone@6.15.0/babel.min.js"></script>
</head>

<body>
	<div id="root"></div>
	<script type="text/babel">

  class Big extends React.Component {
  constructor() {
    super();
    this.state = {
      small: true
    }
  }
  closeSmall = () => {
    console.log('closeSmall');
    this.setState({ small: false });
  }
  render() {
    return <div>
      <h1>hello from Component </h1>
      <h2 onClick={this.closeSmall}>close small </h2>
      {this.state.small ? <Small /> : null}
    </div>
  }
}
class Small extends React.Component {
  constructor() {
    super();
    this.state = {
      data: 'init data'
    }
  }
  componentDidMount() {
    console.log('componentDidMount');
    this.cancelablePromise = makeCancelable(new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('fetch data from server succeed...')
        resolve('data from server');
      }, 5000)
    }))

    this.cancelablePromise
      .promise
      .then(data => {
        console.log('resolved: ', data, this.state);
        this.setState({ data });
      })
      .catch(reason => console.log(reason, ' isCanceled', reason.isCanceled));

  }
  componentWillUnmount() {
    this.cancelablePromise.cancel();// Cancel the promise
  }
  render() {
    return <div>
      <h1>hello from Small Component ...  </h1>
      data: {this.state.data}
    </div>
  }
}

const makeCancelable = (promise) => {
  let hasCanceled_ = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then((val) =>
      hasCanceled_ ? reject({ isCanceled: true }) : resolve(val)
    );
    promise.catch((error) =>
      hasCanceled_ ? reject({ isCanceled: true }) : reject(error)
    );
  });

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled_ = true;
    },
  };
};
      ReactDOM.render(
        <Big />,
        document.getElementById('root')
      );

    </script>
</body>

</html>
```

well, it's ok now!