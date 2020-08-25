---
title: Python performance profile
draft: false
tags: [python, performance, profiler, line-profiler]
category: AI
date: '2020-04-08T08:15:32Z'
---

<!-- more -->

# cProfile
https://docs.python.org/3/library/profile.html
http://love67.net/2016/03/08/python-profile

```bash
python -m cProfile -o output.pstat test.py
gprof2dot -f pstats output.pstat | dot -Tpng -o output.png
```

# line_profiler

https://github.com/pyutils/line_profiler

## kernprof

`@profile`

```bash
kernprof -l script_to_profile.py # 写入文件
python -m line_profiler script_to_profile.py.lprof # 查看上步写入的结果

kernprof -l -v script_to_profile.py # 直接看
```

## 通过api访问：

https://stackoverflow.com/questions/23885147/how-do-i-use-line-profiler-from-robert-kern

```python
from line_profiler import LineProfiler
import random
 

def f(ns):
    sum(ns)
    s = sum(numbers)
    l = [numbers[i]/43 for i in range(len(numbers))]
    m = ['hello'+str(numbers[i]) for i in range(len(numbers))]
    
def do_stuff(numbers):
    s = sum(numbers)
    l = [numbers[i]/43 for i in range(len(numbers))]
    m = ['hello'+str(numbers[i]) for i in range(len(numbers))]
    f(numbers)
 
numbers = [random.randint(1,100) for i in range(1000)]
lp = LineProfiler(f)
# lp.add_function(f, do_stuff)   # add additional function to profile
lp_wrapper = lp(do_stuff)
lp_wrapper(numbers)
lp.print_stats()
lp.get_stats()
```

## jupyter notebook

https://stackoverflow.com/questions/44734297/how-to-profile-python-3-5-code-line-by-line-in-jupyter-notebook-5

```python
%load_ext line_profiler

%lprun -f do_stuff do_stuff(numbers)
```

https://mortada.net/easily-profile-python-code-in-jupyter.html

https://ipython-books.github.io/43-profiling-your-code-line-by-line-with-line_profiler/
https://jakevdp.github.io/PythonDataScienceHandbook/01.07-timing-and-profiling.html

## numba?
no!

https://stackoverflow.com/questions/54545511/using-line-profiler-with-numba-jitted-functions

https://github.com/numba/numba/issues/5028
https://github.com/numba/numba/issues/3254

# jupyterLab
https://github.com/jupyterlab/jupyterlab
https://jupyterlab.readthedocs.io/en/stable/
https://blog.jupyter.org/jupyterlab-is-ready-for-users-5a6f039b8906
https://zhuanlan.zhihu.com/p/38612108

格式化:
https://jupyterlab-code-formatter.readthedocs.io/en/latest/index.html ， FAQ看版本对不对

# jupyter nbextensions
https://github.com/ipython-contrib/jupyter_contrib_nbextensions