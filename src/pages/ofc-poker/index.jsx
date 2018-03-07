import React from 'react';
import Helmet from "react-helmet"

import calculateFantasy, { AllCards, getRandomCards } from '../../../utils/poker-fantasy';

class Index extends React.Component {

  constructor() {
    super();
    this.cards = [];
    this.state = {
      cards: [],
      msg: '',
    }
  }
  formatPokers(pokers) {
    const copyCards = pokers.slice(); // copy
    for (let z = 0; z < copyCards.length; z++) {
      switch (copyCards[z].slice(0, 2)) {
        case '14':
          copyCards[z] = 'A' + copyCards[z].charAt(2);
          break;
        case '13':
          copyCards[z] = 'K' + copyCards[z].charAt(2);
          break;
        case '12':
          copyCards[z] = 'Q' + copyCards[z].charAt(2);
          break;
        case '11':
          copyCards[z] = 'J' + copyCards[z].charAt(2);
          break;
        case '10':
          break;
        default:
          copyCards[z] = copyCards[z].substring(1);
          break;
      }
    }
    return copyCards;
  }

  choosePoker(poker) {
    return () => {
      const cards = this.state.cards;
      const idx = cards.indexOf(poker);
      if (idx == -1) {
        cards.push(poker);
      } else {
        cards.splice(idx, 1);
      }
      this.setState({
        cards: cards
      })
    }
  }
  calculate() {
    const cards = this.state.cards;
    if ((cards.length !== 13) && (cards.length !== 14)) {
      this.setState({
        msg: 'needs to be 13 cards for standard ofc or 14 for pineapple'
      });
    }
    this.setState({
      msg: 'caculating...预计时间' + (cards.length === 13 ? '1s' : '2s')
    })
    setTimeout(() => {
      console.log('caculating...', this.state.cards);
      if (this.state.cards.length === 14) {
        const p = calculateFantasy(this.state.cards);
        p.then(data => {
          const { answer, score } = data;
          console.log('caculated...', answer, score)
          this.setState({
            msg: `
      top: ${this.formatPokers(answer[0])} \n
      middle: ${this.formatPokers(answer[1])} \n
      bottom: ${this.formatPokers(answer[2])} \n
      total scores is : ${score}
      `
          });
        })
        return;
      }
      const { answer, score } = calculateFantasy(this.state.cards);
      console.log('caculated...', answer, score)
      this.setState({
        msg: `
      top: ${this.formatPokers(answer[0])} \n
      middle: ${this.formatPokers(answer[1])} \n
      bottom: ${this.formatPokers(answer[2])} \n
      total scores is : ${score}
      `
      });
    }, 10)// 避免calculateFantasy长时间计算， setState之后msg渲染不出来， 界面卡死
  }
  reset() {
    this.setState({
      cards: [],
      msg: '',
    });
  }
  randomChoosePoker(n) {
    // console.log(AllCards)
    const cards = getRandomCards(n);
    // console.log(cards)
    this.setState({
      cards
    })
  }

  render() {
    return <div>
      {
        <Helmet script={[{ src: `/parallel.js`, type: `text/javascript` }]} />
      }
      <br />
      <img src={require('./02s.jpg')} onClick={this.choosePoker('02s')} />
      <img src={require('./03s.jpg')} onClick={this.choosePoker('03s')} />
      <img src={require('./04s.jpg')} onClick={this.choosePoker('04s')} />
      <img src={require('./05s.jpg')} onClick={this.choosePoker('05s')} />
      <img src={require('./06s.jpg')} onClick={this.choosePoker('06s')} />
      <img src={require('./07s.jpg')} onClick={this.choosePoker('07s')} />
      <img src={require('./08s.jpg')} onClick={this.choosePoker('08s')} />
      <img src={require('./09s.jpg')} onClick={this.choosePoker('09s')} />
      <img src={require('./10s.jpg')} onClick={this.choosePoker('10s')} />
      <img src={require('./11s.jpg')} onClick={this.choosePoker('11s')} />
      <img src={require('./12s.jpg')} onClick={this.choosePoker('12s')} />
      <img src={require('./13s.jpg')} onClick={this.choosePoker('13s')} />
      <img src={require('./14s.jpg')} onClick={this.choosePoker('14s')} />
      <br />
      <img src={require('./02h.jpg')} onClick={this.choosePoker('02h')} />
      <img src={require('./03h.jpg')} onClick={this.choosePoker('03h')} />
      <img src={require('./04h.jpg')} onClick={this.choosePoker('04h')} />
      <img src={require('./05h.jpg')} onClick={this.choosePoker('05h')} />
      <img src={require('./06h.jpg')} onClick={this.choosePoker('06h')} />
      <img src={require('./07h.jpg')} onClick={this.choosePoker('07h')} />
      <img src={require('./08h.jpg')} onClick={this.choosePoker('08h')} />
      <img src={require('./09h.jpg')} onClick={this.choosePoker('09h')} />
      <img src={require('./10h.jpg')} onClick={this.choosePoker('10h')} />
      <img src={require('./11h.jpg')} onClick={this.choosePoker('11h')} />
      <img src={require('./12h.jpg')} onClick={this.choosePoker('12h')} />
      <img src={require('./13h.jpg')} onClick={this.choosePoker('13h')} />
      <img src={require('./14h.jpg')} onClick={this.choosePoker('14h')} />
      <br />
      <img src={require('./02c.jpg')} onClick={this.choosePoker('02c')} />
      <img src={require('./03c.jpg')} onClick={this.choosePoker('03c')} />
      <img src={require('./04c.jpg')} onClick={this.choosePoker('04c')} />
      <img src={require('./05c.jpg')} onClick={this.choosePoker('05c')} />
      <img src={require('./06c.jpg')} onClick={this.choosePoker('06c')} />
      <img src={require('./07c.jpg')} onClick={this.choosePoker('07c')} />
      <img src={require('./08c.jpg')} onClick={this.choosePoker('08c')} />
      <img src={require('./09c.jpg')} onClick={this.choosePoker('09c')} />
      <img src={require('./10c.jpg')} onClick={this.choosePoker('10c')} />
      <img src={require('./11c.jpg')} onClick={this.choosePoker('11c')} />
      <img src={require('./12c.jpg')} onClick={this.choosePoker('12c')} />
      <img src={require('./13c.jpg')} onClick={this.choosePoker('13c')} />
      <img src={require('./14c.jpg')} onClick={this.choosePoker('14c')} />
      <br />
      <img src={require('./02d.jpg')} onClick={this.choosePoker('02d')} />
      <img src={require('./03d.jpg')} onClick={this.choosePoker('03d')} />
      <img src={require('./04d.jpg')} onClick={this.choosePoker('04d')} />
      <img src={require('./05d.jpg')} onClick={this.choosePoker('05d')} />
      <img src={require('./06d.jpg')} onClick={this.choosePoker('06d')} />
      <img src={require('./07d.jpg')} onClick={this.choosePoker('07d')} />
      <img src={require('./08d.jpg')} onClick={this.choosePoker('08d')} />
      <img src={require('./09d.jpg')} onClick={this.choosePoker('09d')} />
      <img src={require('./10d.jpg')} onClick={this.choosePoker('10d')} />
      <img src={require('./11d.jpg')} onClick={this.choosePoker('11d')} />
      <img src={require('./12d.jpg')} onClick={this.choosePoker('12d')} />
      <img src={require('./13d.jpg')} onClick={this.choosePoker('13d')} />
      <img src={require('./14d.jpg')} onClick={this.choosePoker('14d')} />
      <br />


      <button type="button" onClick={this.calculate.bind(this)}>Calculate</button>
      <button type="button" onClick={this.reset.bind(this)}>Reset</button>
      <button type="button" onClick={this.randomChoosePoker.bind(this, 13)}>Random13</button>
      <button type="button" onClick={this.randomChoosePoker.bind(this, 14)}>Random14</button>

      {/* <p>{this.formatPokers(this.state.cards).join(', ')}</p> */}
      <div style={{ marginTop: 12 }}>{
        this.state.cards.map(card => {
          return <img key={card} src={require(`./${card}.jpg`)} />
        })
      }
      </div>
      <p>has chosen: {this.state.cards.length} pokers...</p>
      <pre>{this.state.msg}</pre>
    </div>
  }
}

export default Index;