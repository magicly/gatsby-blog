import React from "react"
import Helmet from "react-helmet"
import Link from "gatsby-link"
import { CategoryAndTags } from '../components/Articles/Footer';
import ArticleHeader from '../components/Articles/Header';
import styled, { injectGlobal } from 'styled-components';

import 'gitment/style/default.css'
import Gitment from 'gitment'

injectGlobal`
  img {
    margin: 0;
    vertical-align: middle;
    max-width: 100%;
  }
`
const Article = styled.article`
  margin: 30px;
  position: relative;
  border: 1px solid #ddd;
  border-top: 1px solid #fff;
  border-bottom: 1px solid #fff;
  background: #fff;
  transition: all .2s ease-in;

  @media screen and (max-width: 800px) {
    padding: 10px;
    margin: 10px 0;
    border: 0;
    font-size: 16px;
    color: #555;
  }
`
const ArticleEntry = styled.div`
  line-height: 1.8em;
  padding: 0 7.6923%;
  font-size: 16px;
  ul {
    font-size: 14px;
    margin: 10px 0;
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
  li ul {
    margin-left: 30px;
  }
  li ul li:before {
    background: #dedede;
  }
  ol {
    font-size: 14px;
    margin: 10px 0;
    counter-reset: item;
  }
  ol li:before {
    counter-increment: item;
    content: counter(item) ".";
    margin-right: 10px;
  }

  @media screen and (max-width: 800px) {
    padding: 10px 0 30px;
  }
  p {text-indent: 2rem};
  table, tr, th, td {
    border: 1px solid black;
  }
`
const Nav = styled.nav`
  margin: 0 0 20px;
  padding: 0 32px 10px;
  min-height: 30px;

  @media screen and (max-width: 800px) {
    margin: 0;
    padding: 5px 10px 10px;
  }
  a {
    @media screen and (max-width: 800px) {
      margin: 5px 0;
      display: block;
      clear: both;
    }
  }
`
const PrevLink = styled(Link) `
  float: left;
  i {
    margin-right: 5px;
  }
`
const NextLink = styled(Link) `
  float: right;
  i {
    margin-left: 5px;
  }
  @media screen and (max-width: 800px) {
    float: none;
    i {
      float: left;
      margin-left: 0;
      margin-right: 5px;
    }
  }
`
const Comment = styled.div`
  padding: 0 7.6923%;
`
class BlogPostTemplate extends React.Component {
  componentDidMount() {
    const gitment = new Gitment({
      // id: 'Your page ID', // optional
      owner: 'magicly',
      repo: 'magicly.github.io',
      oauth: {
        client_id: '4e646a8f7e6ecc752ce9',
        client_secret: 'efe58343f04307c92a491a6bbffbee83ee12b89d',
      },
      // ...
      // For more available options, check out the documentation below
    });
    gitment.render('comments')
  }
  render() {
    const post = this.props.data.markdownRemark
    const siteTitle = this.props.data.site.siteMetadata.title;

    // todo，应该去判断hostname是否是当前域名，如果是的话不用打开新页面，否则会导致重新加载。 由于写在这里只是一个临时方案，更好的做法应该直接写在markdown的解析插件里。
    // 已经在magicly-remark-target-new中实现，当然，这里修改html会覆盖！
    // 由于remarkjs解析markdown后，[x][x]这种定义的链接在AST不是link而是definition，所以不好处理，放在这里比较好。
    post.html = post.html.replace(/<a href="/g, '<a target="_blank" href="')
    return (
      <div>
        <Helmet title={`${post.frontmatter.title} | ${siteTitle}`} />
        {
          post.frontmatter.math ? <Helmet script={[{ src: `//cdn.bootcss.com/mathjax/2.7.1/MathJax.js?config=TeX-AMS-MML_HTMLorMML`, type: `text/javascript` }]} /> : ''
        }
        <Article>
          <ArticleHeader article={{ title: post.frontmatter.title, time: post.frontmatter.date }} />
          <ArticleEntry dangerouslySetInnerHTML={{ __html: post.html }} />
          <CategoryAndTags article={{ category: post.frontmatter.category, tags: post.frontmatter.tags }} />
        </Article>
        <Nav>
          {
            this.props.pathContext.prev.url && this.props.pathContext.prev.title &&
            <PrevLink to={this.props.pathContext.prev.url}><i className="iconfont icon-arrowleftcircle" />{this.props.pathContext.prev.title}</PrevLink>
          }
          {
            this.props.pathContext.next.url && this.props.pathContext.next.title &&
            <NextLink to={this.props.pathContext.next.url}>{this.props.pathContext.next.title}<i className="iconfont icon-arrowrightcircle" /></NextLink>
          }
        </Nav>
        <Comment id="comments" />
      </div>
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostByPath($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug }}) {
      id
      html
      timeToRead
      frontmatter {
        title
        date(formatString: "YYYY-MM-DD")
        category
        tags
        math
      }
    }
  }
`
