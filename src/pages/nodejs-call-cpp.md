---
title: Node.js调用cpp
draft: false
tags: [nodejs, c++, c, cpp, hpc]
category: AI
date: '2020-02-01T12:55:32Z'
---

<!-- more -->

Node.js 调用 cpp

- https://www.zhihu.com/question/284918302
- https://iweiyun.github.io/2019/01/04/node-cpp-addon/
- https://medium.com/@atulanand94/beginners-guide-to-writing-nodejs-addons-using-c-and-n-api-node-addon-api-9b3b718a9a7f
- https://github.com/nodejs/node-gyp
- https://github.com/nodejs/node-addon-api
- https://github.com/nodejs/node-addon-examples

node-gyp 低版本只支持 python2.7， 可以`npm run build --python=python2.7`，或者

```bash
npm config set python `which python2.7`
```

发现还是报错，

```bash
  CC(target) Release/obj.target/nothing/node_modules/node-addon-api/src/nothing.o
  LIBTOOL-STATIC Release/nothing.a
Traceback (most recent call last):
  File "./gyp-mac-tool", line 611, in <module>
    sys.exit(main(sys.argv[1:]))
  File "./gyp-mac-tool", line 28, in main
    exit_code = executor.Dispatch(args)
  File "./gyp-mac-tool", line 43, in Dispatch
    return getattr(self, method)(*args[1:])
  File "./gyp-mac-tool", line 246, in ExecFilterLibtool
    if not libtool_re.match(line) and not libtool_re5.match(line):
TypeError: cannot use a string pattern on a bytes-like object
make: *** [Release/nothing.a] Error 1
```

找到`mac-tool.py`(`node_modules/node-gyp/gyp/pylib/gyp/mac_tool.py`)，删除响应行，用`./node_modules/.bin/node-gyp rebuild --python=python2.7`即可。

升级之后支持 python3.7 可以了， 但是用`npm run build`还是 node-gyp 3.8， 要用`./node_modules/.bin/node-gyp rebuild`才可以？？

默认都是 3.8???

```bash
node-gyp -v v3.8.0
```

node 自带的。

```bash
gyp ERR! command "/Users/magicly/.nvm/versions/node/v10.11.0/bin/node" "/Users/magicly/.nvm/versions/node/v10.11.0/lib/node_modules/npm/node_modules/node-gyp/bin/node-gyp.js" "rebuild"


gyp ERR! command "/Users/magicly/.nvm/versions/node/v12.3.1/bin/node" "/Users/magicly/.nvm/versions/node/v12.3.1/lib/node_modules/npm/node_modules/node-gyp/bin/node-gyp.js" "rebuild"
```

高版本支持`Python v2.7, v3.5, v3.6, or v3.7`了。
