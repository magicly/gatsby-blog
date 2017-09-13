import React from "react"
import styled, { injectGlobal } from 'styled-components';

import SideBar from '../components/LeftCol';
import MiddleCol from '../components/MiddleCol';
import Footer from '../components/Footer';

require('prismjs/themes/prism-solarizedlight.css')

injectGlobal`
  .iconfont{
    font-family:"iconfont" !important;
    font-size:16px;font-style:normal;
    -webkit-font-smoothing: antialiased;
    -webkit-text-stroke-width: 0.2px;
    -moz-osx-font-smoothing: grayscale;
  }
  body {
    margin: 0;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    background: #eaeaea;
    color: #1a1a1a;
    font-family: lucida grande,lucida sans unicode,lucida,helvetica,Hiragino Sans GB,Microsoft YaHei,WenQuanYi Micro Hei,sans-serif;
    font-size: 16px;
    font-size: 1rem;
    line-height: 1.75;
  }
  ul {
    list-style-type: none;
  }
  dd, dl, li, ol, ul {
    margin: 0;
    padding: 0;
  }
  ul li:before {
    content: "";
    width: 6px;
    height: 6px;
    border: 1px solid #999;
    border-radius: 10px;
    background: #aaa;
    display: inline-block;
    margin-right: 10px;
    float: left;
    margin-top: 10px;
  }
  a {
    background: transparent;
    text-decoration: none;
    color: #08c;
  }
  * {
    box-sizing: border-box;
  }
`

const RightCol = styled.div`
    position: absolute;
    right: 0;
    min-height: 100%;
    background: #eaeaea;
    left: 300px;
    width: auto;
`
const RightCol2 = RightCol.extend`
    left: 660px;
`

class DefaultLayout extends React.Component {
  constructor(props) {
    super(props);

    const posts = props.data.allMarkdownRemark.edges
    this.articles = posts.map(post => {
      return {
        id: post.node.fields.slug.replace('/', ''),
        time: post.node.frontmatter.date,
        title: post.node.frontmatter.title,
        category: post.node.frontmatter.category,
        tags: post.node.frontmatter.tags,
      }
    });
    this.state = {
      showContent: '',
    }
  }
  showMiddleHandler = (showContent) => {
    this.setState({
      showContent,
    })
  }
  render() {
    return (
      <div>
        <SideBar showMiddle={this.showMiddleHandler} />
        {
          this.state.showContent ?
            < MiddleCol all={this.articles} showContent={this.state.showContent} close={() => this.showMiddleHandler(false)} />
            :
            null
        }
        {
          this.state.showContent ?
            <RightCol2>
              {this.props.children()}
              <Footer />
            </RightCol2>
            :
            <RightCol>
              {this.props.children()}
              <Footer />
            </RightCol>
        }
      </div>
    )
  }
}

export default DefaultLayout

export const pageQuery = graphql`
query AllArticles {
  allMarkdownRemark(
    filter: { frontmatter: { draft: { ne: true } } }
    sort: {fields: [frontmatter___date], order: DESC}
  ) {
    edges {
      node {
        fields {
          slug
        }
        frontmatter {
          title
          date(formatString: "YYYY-MM-DD")
          tags
        }
      }
    }
  }
}
`