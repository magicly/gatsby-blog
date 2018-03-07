// https://notanoctopus.github.io/open-face-chinese-poker-fantasyland/
function sortDesc(cards) {
  if (cards.length === 3) {
    // let [a, b, c] = cards; // 编译后用paralleljs，找不到_slice2Array， 用chrome没有报错， 用FF才发现的！
    let a = cards[0];
    let b = cards[1];
    let c = cards[2];
    if (a < b) {
      [a, b] = [b, a]
    }

    if (b < c) {
      [b, c] = [c, b]
    }
    if (a < b) {
      [a, b] = [b, a]
    }
    return [a, b, c];
  }
  return cards.sort();
}
function getFromTop(cardsUnsorted) {
  // cards: ["02s", "14d"...]
  // cardsUnsorted.sort();
  // cardsUnsorted.reverse();
  // const cards = cardsUnsorted;
  const cards = sortDesc(cardsUnsorted)
  // cards.sort((a, b) => {if("" + a < "" + b) {return 1} else return 0;})

  const ranks = getRanks(cards);
  if (ranks[0] == ranks[1] && ranks[1] == ranks[2]) {
    return [3, +(ranks[0])] // trips
  }
  // no || cards[1] == cards[2], because sorted!
  if (ranks[0] == ranks[1] || ranks[1] == ranks[2]) {
    return [1, +(ranks[1]), +(ranks[0]) + +(ranks[2]) - +(ranks[1])] // pair
  }
  return [0, +(ranks[0]), +(ranks[1]), +(ranks[2])]
}

function sameColorF(colors) {
  const color = colors[0];
  for (let i = 1; i < colors.length; i += 1) {
    if (colors[i] !== color) {
      return false;
    }
  }
  return true;
}
let totalHit = 0;
let totalCall = 0;
const Cache5Cards = new Map();
function getFrom5CardsWithCache(cards) {
  totalCall += 1;
  cards.sort();
  cards.reverse();
  const cardsStr = cards.toString();
  if (Cache5Cards.has(cardsStr)) {
    totalHit += 1;
    return Cache5Cards.get(cardsStr);
  }
  const result = getFrom5Cards(cards);
  Cache5Cards.set(cardsStr, result);
  return result;
}
function getRanks(cards) {
  return cards.map(card => +card.slice(0, 2));
}
function getColors(cards) {
  return cards.map(card => card.slice(2));
}

function getFrom5Cards(cards, sorted = false) {
  if (!sorted) {
    cards.sort();
    cards.reverse();
  }
  const ranks = getRanks(cards);
  const colors = getColors(cards);

  const isFlush = sameColorF(colors);
  const isStraight = ranks[0] - ranks[1] === 1 && ranks[1] - ranks[2] === 1 && ranks[2] - ranks[3] === 1 && ranks[3] - ranks[4] === 1;
  const isWheelStraight = ranks[0] === 14 && ranks[1] === 5 && ranks[2] === 4 && ranks[3] === 3 && ranks[4] === 2;
  const hasPair = (ranks[0] === ranks[1]) || (ranks[1] === ranks[2]) || (ranks[2] === ranks[3]) || (ranks[3] === ranks[4]);

  if (!isFlush & !isStraight && !isWheelStraight && !hasPair) { // 高牌最多，放在前面
    return [0, ranks[0], ranks[1], ranks[2], ranks[3], ranks[4]] // high card
  }

  if (ranks[0] === 14 && ranks[1] === 13 && ranks[2] === 12 && ranks[3] === 11 && ranks[4] === 10
    && isFlush) {
    return [9] // Royal flush
  }
  if (isStraight && isFlush) {
    return [8, ranks[0]] // straight flush
  }
  if (ranks[0] === 14 && ranks[1] === 5 && ranks[2] === 4 && ranks[3] === 3 && ranks[4] === 2
    && isFlush) {
    return [8, 5] // wheel straight flush
  }
  if (ranks[0] === ranks[1] && ranks[1] === ranks[2] && ranks[2] === ranks[3]) {
    return [7, ranks[0], ranks[4]] // quads
  }
  if (ranks[1] === ranks[2] && ranks[2] === ranks[3] && ranks[3] === ranks[4]) {
    return [7, ranks[1], ranks[0]] // quads
  }
  if (ranks[0] === ranks[1] && ranks[1] === ranks[2] && ranks[3] === ranks[4]) {
    return [6, ranks[0], ranks[3]] // full
  }
  if (ranks[0] === ranks[1] && ranks[2] === ranks[3] && ranks[3] === ranks[4]) {
    return [6, ranks[2], ranks[0]] // full
  }
  if (isFlush) {
    return [5, ranks[0], ranks[1], ranks[2], ranks[3], ranks[4]] // flush
  }
  if (isStraight) {
    return [4, ranks[0]] // straight
  }
  if (isWheelStraight) {
    return [4, 5] // wheel straight
  }
  if (ranks[0] === ranks[1] && ranks[1] === ranks[2]) {
    return [3, ranks[0], ranks[3], ranks[4]] // trips
  }
  if (ranks[1] === ranks[2] && ranks[2] === ranks[3]) {
    return [3, ranks[1], ranks[0], ranks[4]] // trips
  }
  if (ranks[2] === ranks[3] && ranks[3] === ranks[4]) {
    return [3, ranks[2], ranks[0], ranks[1]] // trips
  }
  if (ranks[0] === ranks[1] && ranks[2] === ranks[3]) {
    return [2, ranks[0], ranks[2], ranks[4]] // twopair
  }
  if (ranks[0] === ranks[1] && ranks[3] === ranks[4]) {
    return [2, ranks[0], ranks[3], ranks[2]] // twopair
  }
  if (ranks[1] === ranks[2] && ranks[3] === ranks[4]) {
    return [2, ranks[1], ranks[3], ranks[0]] // twopair
  }
  if (ranks[0] === ranks[1]) {
    return [1, ranks[0], ranks[2], ranks[3], ranks[4]] // pair
  }
  if (ranks[1] === ranks[2]) {
    return [1, ranks[1], ranks[0], ranks[3], ranks[4]] // pair
  }
  if (ranks[2] === ranks[3]) {
    return [1, ranks[2], ranks[0], ranks[1], ranks[4]] // pair
  }
  if (ranks[3] === ranks[4]) {
    return [1, ranks[3], ranks[0], ranks[1], ranks[2]] // pair
  }

  throw new Error('impossible...');
};

function biggerThan(first, second) { // require first.length >= second.length ?????
  const len = Math.min(first.length, second.length);
  for (let i = 0; i < len; i += 1) {
    if (first[i] < second[i]) {
      return false;
    }
    else if (first[i] > second[i]) {
      return true;
    }
  }
  return true;
};

// function topScore([type, rank]) {
function topScore(cardType) {
  const type = cardType[0];
  const rank = cardType[1];
  if (type == 3) {
    return 8 + rank;
  }
  if (type == 1 && rank >= 6) {
    return rank - 5;
  }
  return 0;
}

function middleScore(types) {
  const type = types[0];
  const middleScoreTable = [0, 0, 0, 2, 4, 8, 12, 20, 30, 50];

  return middleScoreTable[type];
}

function bottomScore(types) {
  const type = types[0];
  const bottomScoreTable = [0, 0, 0, 0, 2, 4, 6, 10, 15, 25];

  return bottomScoreTable[type];
}

function omfg(cards) { // 13 of them, takes like a second
  let bestScore = -1;
  let cardsList = ['', '', ''];
  for (let a = 0; a < 11; a++) { // top
    for (let b = a + 1; b < 12; b++) {
      for (let c = b + 1; c < 13; c++) {
        for (let d = 0; d < 6; d++) { // middle
          for (let e = d + 1; e < 7; e++) {
            for (let f = e + 1; f < 8; f++) {
              for (let g = f + 1; g < 9; g++) {
                for (let h = g + 1; h < 10; h++) {
                  const top = [cards[a], cards[b], cards[c]];
                  const copyCards = cards.slice();
                  copyCards.splice(c, 1);
                  copyCards.splice(b, 1);
                  copyCards.splice(a, 1);
                  const middle = [copyCards[d], copyCards[e], copyCards[f], copyCards[g], copyCards[h]];
                  const topCardType = getFromTop(top);
                  const middleCardType = getFrom5Cards(middle);
                  // const middleCardType = getFrom5CardsWithCache(middle);
                  if (!biggerThan(middleCardType, topCardType)) {
                    continue;
                  }
                  copyCards.splice(h, 1);
                  copyCards.splice(g, 1);
                  copyCards.splice(f, 1);
                  copyCards.splice(e, 1);
                  copyCards.splice(d, 1);
                  const bottom = copyCards.slice();
                  const bottomCardType = getFrom5Cards(bottom);
                  // const bottomCardType = getFrom5CardsWithCache(bottom);
                  if (biggerThan(bottomCardType, middleCardType)) {
                    // if (biggerThan(middleCardType, topCardType) && biggerThan(bottomCardType, middleCardType)) {
                    const score = topScore(topCardType) + middleScore(middleCardType) + bottomScore(bottomCardType);
                    if (score > bestScore) {
                      bestScore = score;
                      cardsList = [top, middle, bottom];
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  return {
    answer: cardsList,
    score: bestScore,
  }
}

function omfg14(cards) { // 14 of them, takes like 15-20 seconds
  let bestScore = -1;
  let bestCardsList = ['', '', ''];
  for (let i = 0; i < 14; i += 1) {
    const copyCards = cards.slice();
    copyCards.splice(i, 1);
    const { score, answer } = omfg(copyCards)
    if (score > bestScore) {
      bestScore = score;
      bestCardsList = answer;
    }
  }

  return {
    answer: bestCardsList,
    score: bestScore,
  }
}

function testParallel(cards) {
  let bestScore = -1;
  let bestCardsList = ['', '', ''];

  let [a, b, c] = cards;
  console.log('cards: ', a, b, c, cards)
  function k() {
    // console.log('cards in k...: ', cards)
    // const [a, b] = cards
    // console.log(a, b)
    Math.max(2, 3)
    "abcd".slice(3)
    return 1;
  }
  function j() { return k(); }
  function h(n) {
    j();
    return n + 1;
  }
  var slowSquare = function (n) {
    console.log('slowSquare start: ', n)
    var i = 0;
    while (++i < n * n) { }
    h(n) // 调用其他函数就不行， 也没有报错信息？！
    return i;
  };
  // Create a job
  var p1 = new Parallel([10000, 10000])
    .require(k)
    .require(j)
    .require(h)
  // Spawn our slow function
  const start = Date.now();
  // p1.map(slowSquare).reduce(data => {
  var f = function (n) {
    console.log('f====');
    return slowSquare(n);
  }
  var g = function (n) {
    console.log('g start: ', n)
    return slowSquare(n)
    var i = 0;
    while (++i < n * n) { }
    return i;
  };
  console.log(f.name, g.name, slowSquare.name)
  p1.map(slowSquare).reduce(data => {
    console.log(data);
    return data[0] + data[1];
  }).then((data) => {
    const end = Date.now();
    console.log(`${data} cost: ${end - start} ms.`);
  })
  return {
    answer: bestCardsList,
    score: bestScore,
  }
}
function omfg14Parallel(cards) {
  // return testParallel(cards);

  let bestScore = -1;
  let bestCardsList = ['', '', ''];

  const allCopyCards = [];
  for (let i = 0; i < 14; i += 1) {
    const copyCards = cards.slice();
    copyCards.splice(i, 1);
    allCopyCards.push(copyCards);
  }
  const start = Date.now();
  const p = new Parallel(allCopyCards).require(omfg)
    .require(getRanks)
    .require(getFromTop)
    .require(getFrom5Cards)
    .require(biggerThan)
    .require(topScore)
    .require(middleScore)
    .require(bottomScore)
    .require(getColors)
    .require(sameColorF)
    .require(sortDesc)
  p.map(omfg).reduce(data => {
    const acc = data[0];
    const e = data[1];
    if (e.score > acc.score) {
      acc.score = e.score;
      acc.answer = e.answer;
    }
    return acc;
  }).then(data => {
    const end = Date.now();
    console.log(`result: ${data} cost: ${end - start} ms.`);
    return data;
  })
  return p;
}


function calculate(cards) {
  if (cards.length == 13) {
    return omfg(cards);
  }
  else {
    return omfg14Parallel(cards);
    return omfg14(cards);
  }
}

function timedF(cards) {
  const start = Date.now();
  const result = calculate(cards);
  const end = Date.now();
  console.log(`cost ${(end - start)} ms.`);
  return result;
}

const AllCards = ['02s', '02h', '02d', '02c', '03s', '03h', '03d', '03c', '04s', '04h', '04d', '04c', '05s', '05h', '05d', '05c', '06s', '06h', '06d', '06c', '07s', '07h', '07d', '07c', '08s', '08h', '08d', '08c', '09s', '09h', '09d', '09c', '10s', '10h', '10d', '10c', '11s', '11h', '11d', '11c', '12s', '12h', '12d', '12c', '13s', '13h', '13d', '13c', '14s', '14h', '14d', '14c'];

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
const temp = shuffle(AllCards);
function getRandomCards(n = 13) {
  // return temp.slice(0, n);
  // return AllCards.slice(0, n);
  return shuffle(AllCards).slice(0, n); // todo 会改变AllCards
}


function prefetch() {
  const start = Date.now();
  for (let i = 0; i < 100000; i += 1) {
    const cards = shuffle(AllCards);
    for (let j = 0; j + 5 < cards.length; j += 5) {
      getFrom5CardsWithCache(cards.slice(j, j + 5))
    }
  }
  const end = Date.now();
  console.log(`prefetch cost: ${end - start} ms.`);
}
// prefetch();
console.log(totalCall, totalHit)



// export default calculate;


// export { AllCards, getRandomCards };


// module.exports = calculate;
module.exports = timedF;
module.exports.AllCards = AllCards;
module.exports.getRandomCards = getRandomCards;
module.exports.getFrom5Cards = getFrom5Cards;
module.exports.getFrom5CardsWithCache = getFrom5CardsWithCache;
module.exports.getFromTop = getFromTop;
module.exports.biggerThan = biggerThan;
module.exports.topScore = topScore;
module.exports.middleScore = middleScore;
module.exports.bottomScore = bottomScore;
module.exports.sortDesc = sortDesc;
module.exports.Cache5Cards = Cache5Cards;
module.exports.totalCall = totalCall;
module.exports.totalHit = totalHit;
