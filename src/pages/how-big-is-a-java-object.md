---
title: 一个Java对象到底有多大
draft: false
date: "2015-06-13T21:34:10Z"
tags: [Java, JVM, Java反射]
category: Java
---

经常遇到一个问题，需要在内存里缓存一批数据来提高效率（避免每次都读取DB）。那问题来了，这些对象到底会占用多大内存呢，这直接决定了可以缓存多少条记录，以及上线之后是否会内存不够等问题。

来看几种解决方法。

<!-- more -->

# 测试

实践是检验真理的唯一标准！比如你要想cache10w条记录，那你就把10w条记录加载到内存，然后看看到底用了多少内存。至于怎么看内存花了多少，你可以
1. 任务管理器
2. top
3. Java Runtime类
4. blabla。。。。

我们来看看直接从Java程序里能获取到的Runtime。

```java
import java.util.*;

/**
 * Created by magicalli on 2015/2/3.
 */
public class TestMemory {
    static class A {
        int a;
    }

    public static void main(String[] args) throws InterruptedException {
        System.out.println("--- Memory Usage ---:");
        Runtime rt = Runtime.getRuntime();
        //打印总内存大小 //打印空闲内存大小 //打印已用内存大小 单位(字节)
        long usedMemory = rt.totalMemory() - rt.freeMemory();
        System.out.println("Total Memory= " + rt.totalMemory() + " Free Memory = " + rt.freeMemory() + " Used　Memory=" + usedMemory);

        // 把你要测试的占用内存的代码放在这里------start--------------
        final int N = 100000;
        int[] arr = new int[N];
        Integer[] arr2 = new Integer[N];
        A[] arrA = new A[N];
        for (int i = 0; i < N; i++) {
            arr[i] = i;
//            arr2[i] = i;
//            arrA[i] = new A();
        }
//        List<Integer> list = new ArrayList<Integer>();
        Map<Integer, String> map = new HashMap<Integer, String>();
//        for (int i = 0; i < N; i++) {
//            list.add(i);
//            map.put(i, UUID.randomUUID().toString());
//        }
//        System.out.println(map.size());
        // 把你要测试的占用内存的代码放在这里------end--------------

        long usedMemory2 = rt.totalMemory() - rt.freeMemory();
        System.out.println("Total Memory= " + rt.totalMemory() + " Free Memory = " + rt.freeMemory() + " Used　Memory=" + usedMemory2);
        long objMemory = usedMemory2 - usedMemory;
        System.out.println("object use memory: " + objMemory / 1024 + "k" + " each is: " + objMemory / N);
    }
}

```

上面方法的最大好处就是可以直接获得实际占用内存大小，是比较简单有效的方法。不好的地方就是如果数据量比较小，可能偏差比较大，而且你也不能解释为什么Integer[]比int[]占用内存大很多，关键是专家说：这种内存占用应该是心里算出来的，你还要去run一下程序，明显就low了，还想晋级？再练练吧！所以我们来看看怎么掐指一算！

# 计算

这个需要了解JVM里的内存分布，知道每个对象都有object header，blabal。这里推荐一篇好文[一个Java对象到底占用多大内存？](http://www.cnblogs.com/magialmoon/p/3757767.html)，我就不重复了。

还看到另一种计算方式，用的Unsafe，不过感觉没有前面用Instrumentation的好。参考这里[Java计算一个对象占用内存的大小](http://blog.csdn.net/bobpauline/article/details/20699233)

# 线上查看

如果是要查看线上程序哪个对象占用了大量内存（比如分析内存泄露），那么可以使用jmap。

# 相关知识
你可能需要了解jps，jinfo，打包jar，manifest，查看jvm运行参数等。

# Refers
1. [http://www.importnew.com/14948.html](http://www.importnew.com/14948.html)
2. [http://www.cnblogs.com/magialmoon/p/3757767.html](http://www.cnblogs.com/magialmoon/p/3757767.html)
3. [http://www.oschina.net/question/1_4486](http://www.oschina.net/question/1_4486)
4. [http://blog.csdn.net/bobpauline/article/details/20699233](http://blog.csdn.net/bobpauline/article/details/20699233)
5. [http://happyqing.iteye.com/blog/2013639](http://happyqing.iteye.com/blog/2013639)
6. [http://sunqi.iteye.com/blog/1917802](http://sunqi.iteye.com/blog/1917802)
7. [http://www.blogjava.net/stone2083/archive/2013/06/08/400410.html](http://www.blogjava.net/stone2083/archive/2013/06/08/400410.html)
8. [http://yueyemaitian.iteye.com/blog/2033046](http://yueyemaitian.iteye.com/blog/2033046)
9. [http://www.ibm.com/developerworks/cn/java/j-lo-jse61/index.html](http://www.ibm.com/developerworks/cn/java/j-lo-jse61/index.html)
10. [http://www.ibm.com/developerworks/cn/java/j-lo-instrumentation/](http://www.ibm.com/developerworks/cn/java/j-lo-instrumentation/)


> Written with [StackEdit](https://stackedit.io/).
