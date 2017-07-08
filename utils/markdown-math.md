$$ \frac{1}{\Bigl(\sqrt{\phi \sqrt{5}}-\phi\Bigr) e^{\frac25 \pi}} = 1+\frac{e^{-2\pi}} {1+\frac{e^{-4\pi}} {1+\frac{e^{-6\pi}} {1+\frac{e^{-8\pi}} {1+\cdots} } } } $$

这是行内公式根号2这样写: \\(\\sqrt{2}\\)
```
\\(\\sqrt{2}\\)
```
这是单独一行的公式:
```
$$ a ^ 2 + b ^ 2 = c ^ 2 $$
$$ \sqrt{2} $$
$$ evidence\_{i}=\sum \_{j}W\_{ij}x\_{j}+b\_{i} $$
```
$$ a ^ 2 + b ^ 2 = c ^ 2 $$
$$ \sqrt{2} $$
$$ evidence_{i}=\displaystyle\sum _{j}W_{ij}x_{j}+b_{i} $$
细心的同学会发现， 里面有很多**\\\\**, **\\_**之类， 原因是**\\**本身在markdown和LaTex里都有含义， 因此需要转义。但是LaTex里面， **\\**太常用了， 所以每次遇到都转义的话就很痛苦， 而且在hexo里面写的公式，复制到其他地方去就不支持了。

网上有改hexo渲染的源码的， 有换用pandoc的， 其实最简单的方式是用hexo-math里的tag。网上搜索到的很多资料都是用的{&#37; math_block %}，我试了发现总是不对， 后来看[官网](https://github.com/akfish/hexo-math)，发现这个方法已经deprecated了， 最新的用{&#37; math %}，如下：

```
这是行内公式：{% math %}\sqrt{2 + 3}{% endmath %}
```
显示为：这是行内公式：{% math %}\sqrt{2 + 3}{% endmath %}
一行公式：
```
$$ evidence\_{i}=\sum \_{j}W\_{ij}x\_{j}+b\_{i} $$

{% math %}
\begin{aligned}
evidence_{i}=\sum _{j}W_{ij}x_{j}+b_{i}
\end{aligned}
{% endmath %}
```
$$ evidence\_{i}=\sum \_{j}W\_{ij}x\_{j}+b\_{i} $$
{% math %}
\begin{aligned}
evidence_{i}=\sum _{j}W_{ij}x_{j}+b_{i}
\end{aligned}
{% endmath %}
可以看出， 如果有需要转义的字符， 用{&#37; math %}tag这种方式要好很多。

再来一个复杂点的公式， 这是[word2vec](https://www.tensorflow.org/tutorials/word2vec)的损失函数公式（选中公式， 右键可以查看LaTex源码）：
```
{% math %}
J_\text{NEG} = \log Q_\theta(D=1 |w_t, h) +
  k \mathop{\mathbb{E}}_{\tilde w \sim P_\text{noise}}
     \left[ \log Q_\theta(D = 0 |\tilde w, h) \right]
{% endmath %}
```
$$
J_\text{NEG} = \log Q_\theta(D=1 |w_t, h) +
  k \mathop{\mathbb{E}}_{\tilde w \sim P_\text{noise}}
     \left[ \log Q_\theta(D = 0 |\tilde w, h) \right]
$$