import React from 'react'
import Helmet from "react-helmet"
import { N, sum, paraSum } from '../../../utils/parallel-utils.js'

export default class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  sumHandler = () => {
    const t1 = Date.now();
    const result = sum(1, N);
    const t2 = Date.now();
    this.setState({
      sumCost: t2 - t1,
      sumR: result,
    })
  }
  paraSumHandler = () => {
    const t1 = Date.now();
    paraSum(N).then(data => {
      console.log(data);
      const t2 = Date.now();
      this.setState({
        paraSumCost: t2 - t1,
        paraSumR: data,
      });
    });
  }
  render() {
    return <div>
      <Helmet title="前端高性能demo" />
      <Helmet script={[{ src: `/parallel.js`, type: `text/javascript` }]} />
      <h1>parallel.js...</h1>
      <button onClick={this.sumHandler}>js单线程计算</button>
      <p>sum: {this.state.sumR}, cost: {this.state.sumCost}</p>
      <button onClick={this.paraSumHandler}>parallel.js计算</button>
      <p>sum: {this.state.paraSumR}, cost: {this.state.paraSumCost}</p>
    </div>
  }
}