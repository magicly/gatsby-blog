const N = 100000000;// 总次数1亿

function sum(start, end) {
  let total = 0;
  for (let i = start; i <= end; i += 1) {
    if (i % 2 == 0 || i % 3 == 1) {
      total += i;
    } else if (i % 5 == 0 || i % 7 == 1) {
      total += i / 2;
    }
  }
  for (let i = start; i <= end; i += 1) {
    if (i % 2 == 0 || i % 3 == 1) {
      total -= i;
    } else if (i % 5 == 0 || i % 7 == 1) {
      total -= i / 2;
    }
  }

  return total;
}

function paraSum(N) {
  const N1 = N / 10;//我们分成10分，没分分别交给一个web worker，parallel.js会根据电脑的CPU核数建立适量的workers
  let p = new Parallel([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .require(sum);
  return p.map(n => sum((n - 1) * 10000000 + 1, n * 10000000))// 在parallel.js里面没法直接应用外部变量N1
    .reduce(data => {
      const acc = data[0];
      const e = data[1];
      return acc + e;
    });
}

export { N, sum, paraSum }