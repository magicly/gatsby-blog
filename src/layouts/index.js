import React from "react"

// import 'antd/dist/antd.css';

import Header from '../components/Header';
import Footer from '../components/Footer';

class DefaultLayout extends React.Component {
  render() {
    return (
      <div>
        <Header />
        {this.props.children()}
        <Footer />
      </div>
    )
  }
}

export default DefaultLayout
