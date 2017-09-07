---
title: J.U.C源码解读之atomic
draft: false
date: "2015-01-13T21:34:10Z"
tags: [Java, concurrency, jdk, 源码阅读]
category: Java
---

java5之后的java.util.concurrent包是世界级并发大师Doug Lea的作品，里面主要实现了
1. atomic包里Integer/Long对应的原子类，主要基于CAS；
2. 一些同步子，包括Lock，CountDownLatch，Semaphore，FutureTask等，这些都是基于AbstractQueuedSynchronizer类；
3. 关于线程执行的Executors类等；
4. 一些并发的集合类，比如ConcurrentHashMap，ConcurrentLinkedQueue，CopyOnWriteArrayList等。

今天我们主要介绍atomic包下相关内容。

<!-- more -->

# CAS

atomic包下的类主要基于现代主流 CPU 都支持的一种指令，Compare and Swap（CAS），这个指令能为多线程编程带来更好的性能。引用《Java Concurrency in Practice》里的一段描述：
>在这里，CAS 指的是现代 CPU 广泛支持的一种对内存中的共享数据进行操作的一种特殊指令。这个指令会对内存中的共享数据做原子的读写操作。简单介绍一下这个指令的操作过程：首先，CPU 会将内存中将要被更改的数据与期望的值做比较。然后，当这两个值相等时，CPU 才会将内存中的数值替换为新的值。否则便不做操作。最后，CPU 会将旧的数值返回。这一系列的操作是原子的。它们虽然看似复杂，但却是 Java 5 并发机制优于原有锁机制的根本。简单来说，CAS 的含义是“我认为原有的值应该是什么，如果是，则将原有的值更新为新值，否则不做修改，并告诉我原来的值是多少”。

# AtomicInteger
```java
private volatile int value;
```
AtomicInteger里面只包含一个字段，用来记录当前值，定义为volatile是为了满足**可见性**。
```java
  // setup to use Unsafe.compareAndSwapInt for updates
    private static final Unsafe unsafe = Unsafe.getUnsafe();
    private static final long valueOffset;

    static {
      try {
        valueOffset = unsafe.objectFieldOffset
            (AtomicInteger.class.getDeclaredField("value"));
      } catch (Exception ex) { throw new Error(ex); }
    }
```
一开始定义了static变量Unsafe，AtomicInteger里面的方法都是对unsafe里面
```java
public final native boolean compareAndSwapInt(Object var1, long var2, int var4, int var5);
```
方法的封装。
我们来看原子性的i++，
```java
    public final int getAndIncrement() {
        for (;;) {
            int current = get();
            int next = current + 1;
            if (compareAndSet(current, next))
                return current;
        }
    }
```
在一个无限循环里面，首先获取当前值，用当前值+1，然后调用
```java
   public final boolean compareAndSet(int expect, int update) {
	return unsafe.compareAndSwapInt(this, valueOffset, expect, update);
    }
```
unsafe.compareAndSwapInt(this, valueOffset, expect, update)的含义是把this对象里面valueOffset（在一开始static代码里面获取）这个位置（即value值）跟expect比较，如果相等，则修改为update，返回true；如果不相等，说明在获取到current之后有其他线程修改过value的值，则重新来一遍，一直到修改成功为止。这里就可以看出，理论上来说，这个方法是有可能永远不能返回的，实际而言，当并发冲突很严重，反复compareAndSet(current, next)失败，有可能也需要花费很多时间。

AtomicInteger里面的其他方法，基本类似；其他类包括AtomicLong，AtomicReference等也是基本对Unsafe里面compareAndSet的一个封装。

# Unsafe

前面可以看到Unsafe类在实现atomic的重要性。为什么有Unsafe这个class呢，基本原因是Java不允许代码直接操作内存，好处是更安全，一般不会出现内存泄露，因为有JVM的GC；坏处是有些底层调用执行不了。我的理解是，Unsafe就是这个java安全围城通向比如c++这个不安全外围的一道门，所以叫Unsafe嘛。Unsafe里面基本都是native，即通过JNI调用c/c++等代码。大部分是直接内存操作，以及后面会讲到的挂起唤醒线程等，包括park和unpark。

前面到
```java
public final native boolean compareAndSwapInt(Object var1, long var2, int var4, int var5);
```
这个方法就不是java代码了，如果想看实现的话，需要下载OpenJDK源码，里面是c++代码调用汇编代码，blabla。我不建议大家再往下继续了，原因有几个，一是我们用java等高级语言的目的就是为了避免纠结复杂的底层细节，站在更高层的角度思考问题，而且java里面还有更多的问题等待你去解决，更多的知识可以学习呢！如果你说你已经把java完全掌握了，包括把jdk源码，tomcat、spring，xxxxx源码都看过了，实在没得看了，那我会说，多陪陪家人吧~除非你是JVM开发工程师，哦，那不好意思，大神，当我啥都没说。。。。为了完整性，我贴几个参考链接http://www.blogjava.net/mstar/archive/2013/04/24/398351.html, http://zl198751.iteye.com/blog/1848575.

那么如果获取Unsafe呢？Unsafe有一个static方法可以获取Unsafe实例，如下
```java
 public static Unsafe getUnsafe() {
        Class var0 = Reflection.getCallerClass(2);
        if(var0.getClassLoader() != null) {
            throw new SecurityException("Unsafe");
        } else {
            return theUnsafe;
        }
    }
```
可是你如果在自己代码里使用，可以编译通过，但是运行时候报错。因为里面限制了调用getUnsafe()这个方法的类必须是启动类加载器Bootstrap Loader。所以如果想在自己代码里面调用Unsafe的话（强烈建议不要这样子做），可以用Java的反射来实现：
```java
    static class UnsafeSupport {
        private static Unsafe unsafe;

        static {
            Field field;
            try {
                // 由反编译Unsafe类获得的信息
                field = Unsafe.class.getDeclaredField("theUnsafe");
                field.setAccessible(true);
                // 获取静态属性,Unsafe在启动JVM时随rt.jar装载
                unsafe = (Unsafe) field.get(null);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        public static Unsafe getInstance() {
//            return Unsafe.getUnsafe();//没有用，只能native获取，否则会抛异常
            return unsafe;
        }
    }    
```    
获取到了Unsafe的实例之后，你照样可以自己实现Atomic类，再说一遍，强烈建议不要这样做！！！

# CAS优点

Compare and Set 是一个非阻塞的算法，这是它的优势。因为使用的是CPU支持的指令，提供了比原有的并发机制更好的性能和伸缩性。可以认为一般情况下性能更好，并且也更容易使用（这才是关键啊）。

# CAS缺点

## ABA问题

CAS操作容易导致ABA问题,也就是在做a++之间，a可能被多个线程修改过了，只不过回到了最初的值，这时CAS会认为a的值没有变。a在外面逛了一圈回来，你能保证它没有做任何坏事，不能！！也许它讨闲，把b的值减了一下，把c的值加了一下等等。解决ABA问题的方法有很多，可以考虑增加一个修改计数（版本号），只有修改计数不变的且a值不变的情况下才做a++，atomic包下有AtomicStampedReference类做这个事情，这和事务原子性处理有点类似！

## 循环时间长开销大

1. 即使没有任何争用也会做一些无用功
2. 如果冲突比较严重的话，可能导致多次修改失败，for循环时间很长，可能比同步还慢

我在自己的电脑上用100个线程去修改一个共享变量，发现用AtomicInteger就比synchronized慢，但是都很快！所以还是那个建议，不要过早优化，不要纠结到底是1ms还是2ms，除非测试之后发现确实是性能瓶颈，然后再仔细看一下，是不是代码的使用有问题，要相信，能写到JDK里的代码，一般都不会有问题。一般不到一天几千万上亿的PV，应该是没啥问题的。而且JVM对synchronized做了很多优化，包括锁去除（Lock Elimination），轻量级锁，偏向锁等，所以写代码的时候首先还是主要考虑代码正确、清晰、可维护。

## 只能保证一个共享变量的原子操作

如果并发约束条件涉及到两个变量，就不能用两个原子变量来达到整体的原子性，还是得用同步。当然你也可以用一个变通的方法，定义一个class，里面包含约束条件涉及到的变量，然后用AtomicReference来实现原子性。

# 总结

atomic包下的类比如AtomicInteger实现原子性的方法主要是依靠现代主流 CPU 都支持的CAS指令，它是通过Unsafe类的native方法调用的。一般而言性能比用锁同步要好，但是都已经很好了，一般而言不会遇到性能问题，关键还是看它的语义是否满足使用要求，以及是否可以让代码更清新。

# Refers
1. [http://my.oschina.net/lifany/blog/133513](http://my.oschina.net/lifany/blog/133513)
2. [http://zl198751.iteye.com/blog/1848575](http://zl198751.iteye.com/blog/1848575)
3. [http://blog.csdn.net/aesop_wubo/article/details/7537960](http://blog.csdn.net/aesop_wubo/article/details/7537960)
4. [http://my.oschina.net/u/177808/blog/166819](http://my.oschina.net/u/177808/blog/166819)
5. [http://www.blogjava.net/mstar/archive/2013/04/24/398351.html](http://www.blogjava.net/mstar/archive/2013/04/24/398351.html)
6. [http://mishadoff.com/blog/java-magic-part-4-sun-dot-misc-dot-unsafe/](http://mishadoff.com/blog/java-magic-part-4-sun-dot-misc-dot-unsafe/)
7. [http://zeroturnaround.com/rebellabs/dangerous-code-how-to-be-unsafe-with-java-classes-objects-in-memory/](http://zeroturnaround.com/rebellabs/dangerous-code-how-to-be-unsafe-with-java-classes-objects-in-memory/)
8. [http://www.pwendell.com/2012/08/13/java-lock-free-deepdive.html](http://www.pwendell.com/2012/08/13/java-lock-free-deepdive.html)
