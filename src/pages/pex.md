---
title: python打包pex
draft: false
tags: [python, pex, setuptools]
category: AI
date: "2020-09-18T07:22:42Z"
---

https://github.com/pantsbuild/pex

https://yami.github.io/2018/08/11/%E4%BD%BF%E7%94%A8Pex%E7%94%9F%E6%88%90%E8%87%AA%E5%8C%85%E5%90%AB%E7%9A%84Python%E7%A8%8B%E5%BA%8F.html


https://github.com/idlerun/simple-pex


需要用[setuptools](https://setuptools.readthedocs.io/)先打包。 
* https://blog.konghy.cn/2018/04/29/setup-dot-py/
* https://juejin.im/post/6844903906158313485

参考https://github.com/idlerun/simple-pex 构建目录， 包含setup.py。

打wheel包
```bash
pip wheel .
```

pex构建
```bash
pex -v -f . termcolor myexample -e samplepkg.main -o hello.pex requests
```
pex命令感觉很灵活， 需要的依赖包可以随意放置位置。也可以用`-r requirements.txt`来指定依赖包。 **注意**， `-r requirements.txt`只是包含了一些依赖， 自己这个包还是要单独写在命令行里。

执行`./hello.pex`即可。

`python setup.py bdist_wheel`会生成build, dist, egg等目录， `pip wheel .`只有一个包， 方便一些。

package里的`__init__.py`其实不需要（如果是empty的话）了。

# flask
```py
# flask_test.py
from flask import Flask

app = Flask(__name__)


@app.route("/")
def hello_world():
    return "hello world!"


app.run(host="0.0.0.0")
```
正常打包pex， entry point指定为flask_test文件即可。


# fastapi

https://steve.dignam.xyz/2019/11/17/pex-and-poetry/

因为只能用uvicorn启动， 所以要用`pex --script uvicorn`来打包pex。 

```py
# fastapi_test.py
from typing import Optional

from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Optional[str] = None):
    return {"item_id": item_id, "q": q}
```

```bash
pex -v -f . -r requirements.txt wtf --script uvicorn -o 1.pex
```
`--script`和`-e`只能指定一个。 然后用`./1.pex pextest.fastapi_test:app --host 0.0.0.0`来启动。

https://github.com/facebookincubator/xar 这个貌似启动时间更好。