---
title: Java Concurrency（三）——J.U.C AQS源码解读
date: "2015-01-13T21:34:10Z"
tags: [Java, concurrency, jdk, 源码阅读]
category: Java
---

java5之后的java.util.concurrent包是世界级并发大师Doug Lea的作品，里面主要实现了
1. atomic包里Integer/Long对应的原子类，主要基于CAS；
2. 一些同步子，包括Lock，CountDownLatch，Semaphore，FutureTask等，这些都是基于AbstractQueuedSynchronizer类；
3. 关于线程执行的Executors类等；
4. 一些并发的集合类，比如ConcurrentHashMap，ConcurrentLinkedQueue，CopyOnWriteArrayList等。

今天我们主要介绍AbstractQueuedSynchronizer这个可以说是最核心的类，没有之一。整个concurrent包里，基本都直接或间接地用到了这个类。Doug Lea的这篇[论文][aqs]里面讲AQS的实现。

<!-- more -->

# AQS

首先，我们来想象一下，一间屋里有一个大家都想要得到的会让你很爽的东西（something which makes you so happy, e.g. W.C）。当有人进去把门关起来在独占享用的时候，其他人就只能在外面排队等待，既然在等待，你就不能老是去敲门说哎，好了没有啊。老是这样的话里面的人就很不爽了，而且你可以利用这点等待时间干点别的，比如看看小说视频背背单词或者就干脆椅子上睡觉，当前面独占的人爽完之后，就会出来说，啊，好爽，到你们了。然后大家可能按照排队顺序获取或者大家疯抢这个状态，有可能一个人自己进去独占，有可能几个人说，哎没关系，我们可以一起来。然后他们进去爽，爽完之后再出来通知下一个。

我们来把上面这段话翻译成AQS里面的术语。有一个状态state，会有多个Thread尝试获取，当一个Thread独占（EXCLUSIVE，比如Lock）之后，其他后面到来的Thread就会被放到一个Queue的队尾（tail），然后睡眠（park），一直等到前面的Thread唤醒（unpark）它，当然这里有可能被假唤醒（就好比你定了闹钟8点起床，结果7点就自然醒或者被外面车吵醒），所以这个Thread会判断一下是不是到自己了，没有的话就继续park（在一个死循环里）；当拥有state的Thread释放（release）之后，它会唤醒Queue中的下一个Thread（unparkSuccessor）。然后下一个Thread获取（acquire）到state，完成自己的任务，然后继续unparkSuccessor。前面主要说的是EXCLUSIVE模式，AQS还支持共享（SHARED）模式，区别在于尝试获取（tryAcquireShared）的时候即使之前已经有Thread获取了state，但是可能仍然能获取（比如ReadLock）。同样释放（doReleaseShared）的时候除了通知Queue里面第一个（head），还会继续通知后续的节点（Node），只要它们是SHARED。

AQS就是实现了：
1. 自动管理这个同步状态state（int类型），更新的时候需要用CAS保证原子性
2. 阻塞和唤醒线程park/unpark
3. 队列管理，一个双向链表实现queue

AQS是一个abstract class，可以通过继承AQS，定义state的含义，以及tryAcquire，tryRelease，以及对应的share模式下tryAcquireShared，tryReleaseShared这几个方法，定义出自己想要的同步子（Synchronizers）。一般而言，是定义一个内部类Sync extends AQS，实现前面说的几个方法，然后再包一层，暴露出相应的方法。这样做的好处是你可以在包装器类里面取更直观的名字，如ReentrantLock里的lock，unlock和CountDownLatch里的countDown，await，而不是太通用的acquire和release等。而且AQS里面一些方法是为了监控和调试使用，直接暴露出来也不好。

下面我们来看J.U.C里面两个常用的Synchronizers。

# ReentrantLock

## 使用

ReentrantLock的语义跟synchronized关键字基本一样，而且我之前看[《深入理解Java虚拟机》][jvm]里面的评测说JDK6之后，两者的效率基本一致了（JDK5之前ReentrantLock要比synchronized快很多）。Javadoc里面说基本用法如下：
```
class X {
  private final ReentrantLock lock = new ReentrantLock();
  // ...
  public void m() {
    lock.lock();  // block until condition holds
    try {
      // ... method body
    } finally {
      lock.unlock()
    }
  }
}
```

## 源码

ReentrantLock用state表示是否被锁，0表示没有线程获取到锁，>=1表示某个线程获取了N次锁（因为是重入的，只要保证lock和unlock成对出现就没有问题）。
```
    /** Synchronizer providing all implementation mechanics */
    private final Sync sync;

    abstract static class Sync extends AbstractQueuedSynchronizer {
```
定义了一个内部类，基本任务都代理给sync完成。而Sync又是一个abstract class，这里主要是因为实现了两种抢占锁的机制，公平锁和非公平锁。
```
	static final class FairSync extends Sync
	
	static final class NonfairSync extends Sync
```
所谓公平不公平简单来说就是本文开头说的，当资源释放的时候，大家是按照排队顺序先到先得，还是有人插队大家疯抢。

提供了两个构造函数：
```
	public ReentrantLock() {
        sync = new NonfairSync();//默认非公平锁，AQS论文说非公平锁效率高些，理由其实很简单，公平锁通知队列第一个节点，要把它唤醒，而唤醒是需要时间的，在锁释放到第一个节点被唤醒这段时间其实锁是可以用但是没有被用的（available but not used）；而非公平锁，释放了之后立马就可以被别人用，所以提高了效率，但是有可能导致饥饿锁，这个就要具体看业务需求了。
    }

	public ReentrantLock(boolean fair) {
        sync = fair ? new FairSync() : new NonfairSync();//指定公平与否
    }
```
加锁的实现
```
	public void lock() {
        sync.lock();
    }
```
简单代理给了sync，在FairSync里为
```
	final void lock() {
		acquire(1);
	}
```
acquire的实现在AQS里面：
```
    public final void acquire(int arg) {
        if (!tryAcquire(arg) &&
            acquireQueued(addWaiter(Node.EXCLUSIVE), arg))
            selfInterrupt();
    }
```
tryAcquire是要在子类里自己实现的，在FairSync如下;
```
		 protected final boolean tryAcquire(int acquires) {
            final Thread current = Thread.currentThread();
            int c = getState();
            if (c == 0) {//0表示锁没有被线程用，1表示已经有线程占用
                if (!hasQueuedPredecessors() && //判断自己是否是第一个节点，实现公平
                    compareAndSetState(0, acquires)) {//CAS更新状态
                    setExclusiveOwnerThread(current);//设置当前线程拥有状态
                    return true;
                }
            }
            else if (current == getExclusiveOwnerThread()) {//1表示已经有线程占用，再判断一下是否被当前线程占用，来实现重入（Reentrant）特性
                int nextc = c + acquires;
                if (nextc < 0)
                    throw new Error("Maximum lock count exceeded");
                setState(nextc);//更新状态
                return true;
            }
            return false;
        }
```
如果获取失败，addWaiter(Node.EXCLUSIVE)将当前线程加入队尾
```
	private Node addWaiter(Node mode) {
        Node node = new Node(Thread.currentThread(), mode);//用当前线程构造Node，独占模式
        // Try the fast path of enq; backup to full enq on failure
        Node pred = tail;
        if (pred != null) {
            node.prev = pred;
            if (compareAndSetTail(pred, node)) {//快速判断，CAS更新tail节点
                pred.next = node;
                return node;
            }
        }
        enq(node);//如果失败，进入enq方法
        return node;
    }
    
	 private Node enq(final Node node) {
        for (;;) {
            Node t = tail;
            if (t == null) { // Must initialize
                if (compareAndSetHead(new Node()))//如果还没有head，CAS初始化一个head
                    tail = head;
            } else {//这段代码跟addWaiter里一样，CAS更新tail节点
                node.prev = t;
                if (compareAndSetTail(t, node)) {
                    t.next = node;
                    return t;
                }
            }
        }
    }
```
现在我们已经将获取不到锁的线程加入队尾了，现在要将它挂起acquireQueued(addWaiter(Node.EXCLUSIVE), arg))：
```
	final boolean acquireQueued(final Node node, int arg) {
        boolean failed = true;
        try {
            boolean interrupted = false;
            for (;;) {//在一个死循环中，避免假唤醒
                final Node p = node.predecessor();//获取当前节点的前一个节点，如果是head说明自己是第一个可以获取资源的线程，实现公平
                if (p == head && tryAcquire(arg)) {//是第一个可以获取资源的线程并且尝试获取成功
                    setHead(node);
                    p.next = null; // help GC
                    failed = false;
                    return interrupted;
                }
                if (shouldParkAfterFailedAcquire(p, node) &&
                    parkAndCheckInterrupt())//没有获取到资源，睡眠park去
                    interrupted = true;
            }
        } finally {
            if (failed)
                cancelAcquire(node);
        }
    }

	private final boolean parkAndCheckInterrupt() {
        LockSupport.park(this);
        return Thread.interrupted();
    }
```
上面完成了获取锁的过程，简单来说就是尝试获取，失败就加入队尾，挂起，等待被唤醒。

下面来看看释放锁
```
	public void unlock() {
        sync.release(1);//代理给sync，调用AQS的release
    }

//下面代码在AQS中
	public final boolean release(int arg) {
        if (tryRelease(arg)) {//尝试释放资源，需要在子类里实现
            Node h = head;
            if (h != null && h.waitStatus != 0)
                unparkSuccessor(h);//通知下一个节点
            return true;
        }
        return false;
    }

	private void unparkSuccessor(Node node) {
        /*
         * If status is negative (i.e., possibly needing signal) try
         * to clear in anticipation of signalling.  It is OK if this
         * fails or if status is changed by waiting thread.
         */
        int ws = node.waitStatus;
        if (ws < 0)
            compareAndSetWaitStatus(node, ws, 0);

        /*
         * Thread to unpark is held in successor, which is normally
         * just the next node.  But if cancelled or apparently null,
         * traverse backwards from tail to find the actual
         * non-cancelled successor.
         */
         // 主要在这里找到下一个需要通知的节点，如果node.next就是需要通知的节点，则直接通知；否则，可能node.next == null（原因是双向链表设置b.pre = a和a.next = b的时候不能保证原子性，只能保证b.pre = a成功，这时候另一条线程可能看到a.next == null）或者s.waitStatus > 0（原因是线程等不及被取消了static final int CANCELLED = 1;），这个时候就要从队尾tail开始找，找到离队头head最近的一个需要通知的节点Node。
        Node s = node.next;
        if (s == null || s.waitStatus > 0) {
            s = null;
            for (Node t = tail; t != null && t != node; t = t.prev)
                if (t.waitStatus <= 0)
                    s = t;
        }
        if (s != null)
            LockSupport.unpark(s.thread);//唤醒线程
    }
```
看看需要在子类里实现的tryRelease：
```
		protected final boolean tryRelease(int releases) {
            int c = getState() - releases;//释放锁，state减去相应的值
            if (Thread.currentThread() != getExclusiveOwnerThread())
                throw new IllegalMonitorStateException();//避免A线程锁了之后，B线程故意捣乱释放锁
            boolean free = false;
            if (c == 0) {//当前线程已经完全释放了锁
                free = true;
                setExclusiveOwnerThread(null);//释放锁的拥有者
            }
            setState(c);//设置状态，这个方面没有同步，没有CAS，有同学问过岂不是有线程并发问题？其实到这里，只有一个线程会调用这个方法，所以不会有并发错误，仔细想想，是吧？是吧？
            return free;
        }
```
到这里，基本都已经完成，对了，还没有说非公平锁NonfairSync是怎么抢占锁的。
```
		final void lock() {
            if (compareAndSetState(0, 1))//先抢一把（插队），万一成功了就不排队，不公平性就体现在这里！
                setExclusiveOwnerThread(Thread.currentThread());
            else
                acquire(1);
        }
```
跟FairSync.lock()对比，可以看出，只是在acquire(1)之前，先抢一把，抢不到才乖乖的去排队。

我们再看看NonfairSync.tryAcquire()怎么实现的
```
		protected final boolean tryAcquire(int acquires) {
            return nonfairTryAcquire(acquires);//调用父类方法nonfairTryAcquire
        }

		final boolean nonfairTryAcquire(int acquires) {
            final Thread current = Thread.currentThread();
            int c = getState();
            if (c == 0) {
                if (compareAndSetState(0, acquires)) {//跟FairSync.tryAcquire只有这里一行有差异，即少了!hasQueuedPredecessors()，也就是说不判断前面有没有人，任何时候只要它醒来，都会去抢，所以不公平！============刚又看了一遍，发现其实final boolean acquireQueued(final Node node, int arg)方法里已经有node.predecessor() == head的判断，感觉这个不公平的tryAcquire貌似没有意义，各位看官怎么看呢，请留言哈，谢谢~
                    setExclusiveOwnerThread(current);
                    return true;
                }
            }
            else if (current == getExclusiveOwnerThread()) {
                int nextc = c + acquires;
                if (nextc < 0) // overflow
                    throw new Error("Maximum lock count exceeded");
                setState(nextc);
                return true;
            }
            return false;
        }
```
# CountDownLatch

我们之前说了，AQS支持独占EXCLUSIVE和共享SHARED两种模式，而刚刚的ReentrantLock的就是独占模式，我们来看看一个使用共享模式的类。

## 使用

CountDownLatch就好比一道门，它可以用来等所有资源都到齐了，才开门，让这些线程同时通过。比如如下是CountDownLatch一个通用用法：
```
package concurrentStudy;

import java.util.concurrent.CountDownLatch;

/**
 * Created by magicalli on 2014/12/13.
 */
public class IndexPlusPlusTest01 {
    private static final int NThreads = 10;// 线程数
    private static final int M = 100000;//循环次数，太小的话（比如10）可能看不出来效果
    private volatile static int n = 0;//加volatile的目的是为了证明volatile没有“原子性”！

    public static void main(String[] args) throws InterruptedException {
        final CountDownLatch startGate = new CountDownLatch(1);
        final CountDownLatch endGate = new CountDownLatch(NThreads);

        for (int i = 0; i < NThreads; i++) {
            new Thread(new Runnable() {
                @Override
                public void run() {
                    try {
                        startGate.await();//所有线程start之后等待“门“打开，保证同时真正开始运行
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }

                    for (int j = 0; j < M; j++) {
                        n += 1;
                    }

                    endGate.countDown();
                }
            }).start();
        }

        startGate.countDown();//打开“门”，让所有线程同时run起来
        long t1 = System.currentTimeMillis();
        endGate.await();//等所有线程都结束之后才打印n，否则总是会打出错误的n；我见过这里用Thread.sleep()，但是问题在于，你怎么知道该等多久才能保证所有线程结束以及刚好结束呢？！
        long t2 = System.currentTimeMillis();
        System.out.println("cost time: " + (t2 - t1));
        System.out.println("n: " + n);
    }
}
```
对了，上面代码是拿来验证volatile不具备原子性的，是错误的代码哦。如果想并发安全，大家可以想想可以用哪些方式实现。

## 源码

CountDownLatch同样也是定义了一个继承自AQS的内部类Sync：
```
	private static final class Sync extends AbstractQueuedSynchronizer
```
构造函数如下：
```
    public CountDownLatch(int count) {
        if (count < 0) throw new IllegalArgumentException("count < 0");
        this.sync = new Sync(count);
    }
```
count表示有多少个任务还在运行，每个Thread完成了任务或者准备好开始之前，就会调用countDown方法将count-1，当count==0时候，await就不再阻塞，所有在上面阻塞的Thread都可以顺利通过。
```
    public void await() throws InterruptedException {
        sync.acquireSharedInterruptibly(1);
    }
```
直接调用AQS的acquireSharedInterruptibly方法，从方法名可以看出，支持中断响应
```
    public final void acquireSharedInterruptibly(int arg)
            throws InterruptedException {
        if (Thread.interrupted())
            throw new InterruptedException();//响应中断
        if (tryAcquireShared(arg) < 0)
            doAcquireSharedInterruptibly(arg);
    }
```
tryAcquireShared在子类中实现：
```
        protected int tryAcquireShared(int acquires) {
            return (getState() == 0) ? 1 : -1;//如果state为0，说明所有Thread完成任务，可以不阻塞了
        }
```
如果没有获取到，将Thread加入队尾，挂起。下面这个方法跟独占模式下acquireQueued(addWaiter(Node.EXCLUSIVE), arg))这个方法代码是基本一致的。
```
	private void doAcquireSharedInterruptibly(int arg)
        throws InterruptedException {
        final Node node = addWaiter(Node.SHARED);//共享模式
        boolean failed = true;
        try {
            for (;;) {
                final Node p = node.predecessor();
                if (p == head) {
                    int r = tryAcquireShared(arg);
                    if (r >= 0) {
                        setHeadAndPropagate(node, r);//跟EXCLUSIVE的一大区别
                        p.next = null; // help GC
                        failed = false;
                        return;
                    }
                }
                if (shouldParkAfterFailedAcquire(p, node) &&
                    parkAndCheckInterrupt())
                    throw new InterruptedException();//响应中断，这里直接抛异常
            }
        } finally {
            if (failed)
                cancelAcquire(node);
        }
    }

	private void setHeadAndPropagate(Node node, int propagate) {
        Node h = head; // Record old head for check below
        setHead(node);
        /*
         * Try to signal next queued node if:
         *   Propagation was indicated by caller,
         *     or was recorded (as h.waitStatus either before
         *     or after setHead) by a previous operation
         *     (note: this uses sign-check of waitStatus because
         *      PROPAGATE status may transition to SIGNAL.)
         * and
         *   The next node is waiting in shared mode,
         *     or we don't know, because it appears null
         *
         * The conservatism in both of these checks may cause
         * unnecessary wake-ups, but only when there are multiple
         * racing acquires/releases, so most need signals now or soon
         * anyway.
         */
         // 如果当前节点是愿意共享，并且下一个节点也是愿意共享的，那么就进入doReleaseShared，唤醒下一个节点，下面会详解
        if (propagate > 0 || h == null || h.waitStatus < 0 ||
            (h = head) == null || h.waitStatus < 0) {
            Node s = node.next;
            if (s == null || s.isShared())
                doReleaseShared();
        }
    }
```
前面完成了等待CountDownLatch的count变成0的过程，下面看看countDown
```
	public void countDown() {
        sync.releaseShared(1);//调用AQS的
    }

	// AQS中
	public final boolean releaseShared(int arg) {
        if (tryReleaseShared(arg)) {//尝试释放，需要在子类中实现
            doReleaseShared();//真正释放
            return true;
        }
        return false;
    }

		// Sync子类中实现
	    protected boolean tryReleaseShared(int releases) {
            // Decrement count; signal when transition to zero
            for (;;) {
                int c = getState();
                if (c == 0)
                    return false;
                int nextc = c-1;
                if (compareAndSetState(c, nextc))// 在死循环中CAS将count-1
                    return nextc == 0;
            }
        }
        
    // AQS中
	private void doReleaseShared() {
        /*
         * Ensure that a release propagates, even if there are other
         * in-progress acquires/releases.  This proceeds in the usual
         * way of trying to unparkSuccessor of head if it needs
         * signal. But if it does not, status is set to PROPAGATE to
         * ensure that upon release, propagation continues.
         * Additionally, we must loop in case a new node is added
         * while we are doing this. Also, unlike other uses of
         * unparkSuccessor, we need to know if CAS to reset status
         * fails, if so rechecking.
         */
        for (;;) {
            Node h = head;
            if (h != null && h != tail) {
                int ws = h.waitStatus;
                if (ws == Node.SIGNAL) {
                    if (!compareAndSetWaitStatus(h, Node.SIGNAL, 0))
                        continue;            // loop to recheck cases
                    unparkSuccessor(h);//遍历queue，通知所有SHARED的节点，因为是共享模式，这些Node都应该被唤醒，直到遇到某个EXCLUSIVE的Node
                }
                else if (ws == 0 &&
                         !compareAndSetWaitStatus(h, 0, Node.PROPAGATE))
                    continue;                // loop on failed CAS
            }
            if (h == head)                   // loop if head changed
                break;
        }
    }
```
unparkSuccessor跟之前独占模式里面的是同一个函数，即调用unpark唤醒Thread。

我们知道为了避免获取不到锁长时间等待，一般阻塞的方法都会支持带超时时间的方法，比如CountDownLatch里就有
```
	public boolean await(long timeout, TimeUnit unit)
        throws InterruptedException {
        return sync.tryAcquireSharedNanos(1, unit.toNanos(timeout));
    }
```
调用AQS里面的tryAcquireSharedNanos方法
```
    public final boolean tryAcquireSharedNanos(int arg, long nanosTimeout)
            throws InterruptedException {
        if (Thread.interrupted())
            throw new InterruptedException();
        return tryAcquireShared(arg) >= 0 ||
            doAcquireSharedNanos(arg, nanosTimeout);
    }

	private boolean doAcquireSharedNanos(int arg, long nanosTimeout)
            throws InterruptedException {
        if (nanosTimeout <= 0L)
            return false;
        final long deadline = System.nanoTime() + nanosTimeout;
        final Node node = addWaiter(Node.SHARED);
        boolean failed = true;
        try {
            for (;;) {
                final Node p = node.predecessor();
                if (p == head) {
                    int r = tryAcquireShared(arg);
                    if (r >= 0) {
                        setHeadAndPropagate(node, r);
                        p.next = null; // help GC
                        failed = false;
                        return true;
                    }
                }
                nanosTimeout = deadline - System.nanoTime();
                if (nanosTimeout <= 0L)
                    return false;//如果已经没时间了，直接return false
                if (shouldParkAfterFailedAcquire(p, node) &&
                    nanosTimeout > spinForTimeoutThreshold)//大于某个阈值，才park，否则进入自旋
                    LockSupport.parkNanos(this, nanosTimeout);//调用带超时的park方法
                if (Thread.interrupted())
                    throw new InterruptedException();
            }
        } finally {
            if (failed)
                cancelAcquire(node);
        }
    }
```
可以看到，跟不带超时的doAcquireSharedInterruptibly方法相比，区别主要在于每次for循环期间，检查时间是否过期和调用带超时的park。nanosTimeout > spinForTimeoutThreshold这个判断主要是因为park/unpark本身也需要花时间，为了更准确地完成超时的机制，在超时时间马上就要到了的时候，就进入自旋，不再park了，这应该是Doug Lea测试了park/unpark时间比1000纳秒要长吧。
```
	/**
     * The number of nanoseconds for which it is faster to spin
     * rather than to use timed park. A rough estimate suffices
     * to improve responsiveness with very short timeouts.
     */
    static final long spinForTimeoutThreshold = 1000L;
```


# 总结

J.U.C里AQS是一个相当核心的类，可以说没有它就没有J.U.C包。推荐大家看看[AQS][aqs]这篇论文（网上有一些翻译，推荐大家还是看原文吧）。主要是用一个state表示状态，子类可以根据需要来定义state的含义，以及获取释放资源时具体如何操作state，当然需要通过CAS实现原子更改。当获取不到state的时候，线程加入队列，挂起。释放之后，唤醒队列中的线程。AQS支持两种模式，独占EXCLUSIVE和共享SHARED。J.U.C里本身也有很多直接继承AQS实现的类，包括Lock，CountDownLatch，Semaphore，FutureTask等，如果这些还不能满足你的使用，那么可以直接继承AQS来实现需要。

# Refers
1. [http://gee.cs.oswego.edu/dl/papers/aqs.pdf](http://gee.cs.oswego.edu/dl/papers/aqs.pdf)
2. [http://ifeve.com/introduce-abstractqueuedsynchronizer/](http://ifeve.com/introduce-abstractqueuedsynchronizer/)
3. [http://ifeve.com/jdk1-8-abstractqueuedsynchronizer/](http://ifeve.com/jdk1-8-abstractqueuedsynchronizer/)
4.  [http://ifeve.com/jdk1-8-abstractqueuedsynchronizer-part2/](http://ifeve.com/jdk1-8-abstractqueuedsynchronizer-part2/)
5. [http://book.douban.com/subject/6522893/](http://book.douban.com/subject/6522893/)
6. [http://my.oschina.net/magicly007/blog/364102](http://my.oschina.net/magicly007/blog/364102)


[aqs]: http://gee.cs.oswego.edu/dl/papers/aqs.pdf
[jvm]: http://book.douban.com/subject/6522893/

> Written with [StackEdit](https://stackedit.io/).
