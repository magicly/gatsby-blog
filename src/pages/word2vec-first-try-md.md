---
title: 用word2vec分析中文维基语料库
draft: false
tags: [machine learning, nlp, word2vec]
category: ML
date: "2017-03-03T10:37:02Z"
---

最近需要做一些自然语言处理的工作， 发现google推出的wrod2vec比较有意思，据说可以推算出king + man - woman = queue，感觉很nb啊， 后续可以拿来做文本分类、情绪分析、关键词提取等。本文记录一下在中文wiki语料库上做的实验。

<!-- more -->

# word2vec下载安装
自从google推出了[word2vec](https://code.google.com/archive/p/word2vec/)后，网上已经有众多实现，包括：
* [google发布的c++版本](https://code.google.com/archive/p/word2vec/)
* python版[Gensim](https://radimrehurek.com/gensim/models/word2vec.html)
* java版[DeepLearning4J](https://deeplearning4j.org/word2vec)
* [Python interface to Google word2vec](https://github.com/danielfrg/word2vec)。

我选用Gensim版本，python3.5.2。

# 数据集简介
我们用的是中文wiki语料库，下载链接https://dumps.wikimedia.org/zhwiki/latest/zhwiki-latest-pages-articles.xml.bz2，有1.3G， 解压之后是一个5.7G左右的xml文档。里面包含了标题、分类、正文部分等。

# 数据预处理
上一步解压之后的xml文档我们没法直接用， 需要经过一系列的处理， 包括xml标签去除， 编码转换、简繁体转换、分词等。
## xml内容提取
你可以自己写正则表达式提取内容， 当然这个太费事了。 好在已经有人做了这个事情， Gensim里自带了提取wiki内容的工具，代码如下：
```python
from gensim.corpora import WikiCorpus

space = b" "
i = 0
output = open('wiki-zh-article.txt', 'wb')
wiki = WikiCorpus('zhwiki-latest-pages-articles.xml.bz2', lemmatize = False, dictionary = {})
for text in wiki.get_texts():
    output.write(space.join(text) + b"\n")
    i = i + 1
    if (i % 10000 == 0):
        print("Saved " + str(i) + " articles")

output.close()
print("Finished Saved " + str(i) + " articles")
```
代码在我的macpro上大概了运行了20多分钟， 得到280819行的文本， 每行为一篇文章。有个坑大家要小心， 输入文件是压缩文件bz2，直接传解压缩之后的xml文件是会报错的。

另外， 我为了简洁，把不相关代码删除了，因此贴出来的代码，并不符合编程的最佳实践，请自行忽略这个问题。

## 简繁体换过
由于wiki语料库里简体、繁体都有，不统一的话对后面分词和跑模型准确率有影响， 所以先统一转化为简体。用到的工具是[opencc](https://github.com/BYVoid/OpenCC)。
```
opencc -i wiki-zh-article.txt -o wiki-zh-article-zhs.txt -c t2s.json
```
话说作者BYVoid也是超级大神， 据说小时候玩电脑，出现乱码， 于是自己写了opencc，然后提交给Linus， 被整合到linux kernel里了，那时候应该是小学还是初中吧。后来本科毕业去阿里面试，得到青睐，晚上流传了当时的面试记录。![http://s12.sinaimg.cn/orignal/001OxbOzzy6EHEbsLWP8b](http://s12.sinaimg.cn/orignal/001OxbOzzy6EHEbsLWP8b)

## 编码转化
网上说文件中包含非utf-8字符，需要用iconv处理一下。我忘了我之前在全量数据上跑得时候有没有遇到， 反正写文章的时候，我拿了1/10的数据跑没遇到问题。如果遇到了可以用[iconv](https://zh.wikipedia.org/wiki/Iconv)一行命令解决：
```
iconv -c -t utf-8 < wiki-zh-article-zhs.txt > wiki-zh-article-zhs-utf8.txt
```

## 分词
接下来就是做分词，比较好用的工具有[结巴分词](https://github.com/fxsjy/jieba)、[中科院的ICTCLAS](http://ictclas.nlpir.org/)、[清华的THULAC](http://thulac.thunlp.org/)、[复旦的FudanNLP](https://github.com/FudanNLP/fnlp)等。我选用了结巴，代码如下：
```python
import codecs
import jieba

infile = 'wiki-zh-article-zhs.txt'
outfile = 'wiki-zh-words.txt'

descsFile = codecs.open(infile, 'rb', encoding='utf-8')
i = 0
with open(outfile, 'w', encoding='utf-8') as f:
    for line in descsFile:
        i += 1
        if i % 10000 == 0:
            print(i)
        line = line.strip()
        words = jieba.cut(line)
        for word in words:
            f.write(word + ' ')
        f.write('\n')
```
又跑几十分钟， 喝杯茶去。。。

# Gensim跑模型训练
终于可以跑模型了，这次时间会更长，看你的电脑配置了，强烈建议约个妹纸出去看看电影逛逛街再回来等。据同事说，gensim有一个坑，在windows下不能用多核？！！！于是我在我的8核macpro下跑一个多小时的，他在windows下要跑七八个小时，哈哈哈哈。。。
```python
import multiprocessing

from gensim.models import Word2Vec
from gensim.models.word2vec import LineSentence

inp = 'wiki-zh-words.txt'
outp1 = 'wiki-zh-model'
outp2 = 'wiki-zh-vector'

model = Word2Vec(LineSentence(inp), size = 400, window = 5, min_count = 5, workers = multiprocessing.cpu_count())

model.save(outp1) ## 以二进制格式存储
model.save_word2vec_format(outp2, binary = False) ## 以文本格式存储， 一行是一个词的vector
```
这里用save_word2vec_format纯粹是为了看看输出的模型是什么样子的， 这样：
```
台湾 0.396402 1.611405 -0.291840 -0.951169 -0.109141 1.918246 0.215038 0.674539 2.335748 -0.757200 -0.290877 2.198100 -0.309420 0.438734 -1.731025 -0.233053 0.150694 2.214514 ......
```
即每个词一行， 后面是400个数字， 即将每一个词变为一个400维的向量。
```
size is the dimensionality of the feature vectors.
```
# 看看效果
看看跟杜甫相关的词呢：
```python
from gensim.models import Word2Vec

model = Word2Vec.load('./wiki-zh-model')
# model = Word2Vec.load_word2vec_format('./wiki-zh-vector', binary = False) # 如果之前用文本保存话， 用这个方法加载
res = model.most_similar('杜甫')
print(res)
```
```
[('白居易', 0.8842014074325562), ('苏轼', 0.8444569706916809), ('陆游', 0.8307716846466064), ('一诗', 0.8290032148361206), ('韩愈', 0.8263246417045593), ('王勃', 0.8244832754135132), ('陶渊明', 0.8243700861930847), ('赋诗', 0.8211008906364441), ('吟咏', 0.82026606798172), ('辛弃疾', 0.8185226917266846)]
```
```
>>> model.most_similar('语言学')
[('语言学家', 0.7147563695907593), ('民族学', 0.6887255907058716), ('历史学', 0.6869072914123535), ('比较语言学', 0.6818138360977173), ('语音学', 0.6741021871566772), ('音韵学', 0.6673719882965088), ('语言所', 0.6434118747711182), ('比较文学', 0.633540153503418), ('人类学', 0.633027195930481), ('方言学', 0.6314626336097717)]
>>> model.most_similar('林丹')
[('谌龙', 0.9071081280708313), ('鲍春来', 0.9035789966583252), ('傅海峰', 0.8911731243133545), ('蔡赟', 0.8886306285858154), ('汪鑫', 0.8803133964538574), ('李宗伟', 0.8767721652984619), ('谢杏芳', 0.8706355690956116), ('周蜜', 0.865954577922821), ('李雪芮', 0.8658450841903687), ('赵芸蕾', 0.8650676012039185)]
>>> model.most_similar('习近平')
[('胡锦涛', 0.8577725291252136), ('江泽民', 0.8138135075569153), ('赵紫阳', 0.7295876741409302), ('温家宝', 0.7284029722213745), ('朱镕基', 0.7241271734237671), ('邓小平', 0.7226930856704712), ('李克强', 0.7181681990623474), ('曾庆红', 0.6949223279953003), ('周永康', 0.6847086548805237), ('反腐', 0.681549072265625)]
>>> model.most_similar(positive=['中国', '东京'], negative=['日本'])
[('北京', 0.35159438848495483), ('中央电视台', 0.3406861424446106), ('辽艺版', 0.3394508361816406), ('宗藤', 0.32839435338974), ('寻奇', 0.3166041970252991), ('china', 0.3111165761947632), ('是冈瓦', 0.3110591471195221), ('北京电视台', 0.31081947684288025), ('女热', 0.30060601234436035), ('北京市', 0.29704713821411133)]
>>> model.most_similar('林志玲')
[('伊能静', 0.7900516986846924), ('柯震东', 0.787365198135376), ('言承旭', 0.7779808044433594), ('徐熙媛', 0.7775079607963562), ('林志颖', 0.7681171894073486), ('谢依霖', 0.7657250761985779), ('阮经天', 0.7654315233230591), ('郭书瑶', 0.7628788948059082), ('张钧宁', 0.7612718939781189), ('何润东', 0.7598745822906494)]
```
还有没有觉得这个可以拿来干点有意思的事情呢？比如：
```
>>> model.most_similar('苍井空')
[('吉泽明步', 0.7175988554954529), ('反町隆史', 0.6755084991455078), ('金城武', 0.6724058389663696), ('柴崎幸', 0.6579034924507141), ('藤原纪香', 0.656890332698822), ('松隆子', 0.6524500846862793), ('仓田保昭', 0.6456934809684753), ('柴咲幸', 0.6456423997879028), ('叶山豪', 0.6449219584465027), ('濑户朝香', 0.6442539095878601)]
```
请尽情发挥想象。。。。。。。。。。。。。。。。

# 其他
列几个word2vec的用途。
* 情感分析 http://datartisan.com/article/detail/48.html
* SEO https://seofangfa.com/seo-articles/word2vec.html

另外，如果想深入了解word2vec的原理， 可以看最初的论文[Distributed Representations of Words and Phrases
and their Compositionality](https://arxiv.org/pdf/1310.4546.pdf)，以及[有道的这篇分析](http://techblog.youdao.com/?p=915)。

如果想自己动手实现word2vec的话， 可以考虑用当前最热的深度学习框架[TensorFlow](https://www.tensorflow.org/)来实现， 官网上有[详细地介绍](https://www.tensorflow.org/tutorials/word2vec)。


# Refers
* http://www.52nlp.cn/%E4%B8%AD%E8%8B%B1%E6%96%87%E7%BB%B4%E5%9F%BA%E7%99%BE%E7%A7%91%E8%AF%AD%E6%96%99%E4%B8%8A%E7%9A%84word2vec%E5%AE%9E%E9%AA%8C
* https://radimrehurek.com/gensim/models/word2vec.html
* https://code.google.com/archive/p/word2vec/
* http://licstar.net/archives/262
* https://github.com/fxsjy/jieba
* http://thulac.thunlp.org/
* http://arxiv.org/pdf/1310.4546.pdf
* https://www.tensorflow.org/tutorials/word2vec
* http://techblog.youdao.com/?p=915
* http://blog.csdn.net/zhaoxinfan/article/details/11069485
* http://cikuapi.com/index.php


