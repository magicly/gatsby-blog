import React from "react"
import Helmet from "react-helmet"
import Link from "gatsby-link"
import styled from 'styled-components';

import 'gitment/style/default.css'
import Gitment from 'gitment'

const Article = styled.div`
  margin: 30px;
  position: relative;
  border: 1px solid #ddd;
  border-top: 1px solid #fff;
  border-bottom: 1px solid #fff;
  background: #fff;
  transition: all .2s ease-in;
`
const Header = styled.header`
  border-left: 5px solid #4d4d4d;
  padding: 30px 0 15px 25px;
  padding-left: 7.6923%;
`
const Title = styled.h1`
  margin-bottom: 10px;
  display: inline;
`
const ArticleEntry = styled.div`
  line-height: 1.8em;
  padding-right: 7.6923%;
  padding-left: 7.6923%;
  font-size: 16px;
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

    let tags, tagsSection;
    if (post.fields.tagSlugs) {
      const tagsArray = post.fields.tagSlugs;
      tags = tagsArray.map((tag, i) => {
        const divider = i < tagsArray.length - 1 && <span>{`, `}</span>
        return (
          <span key={tag}>
            <Link to={tag}>
              {post.frontmatter.tags[i]}
            </Link>
            {divider}
          </span>
        )
      })
      tagsSection = (
        <span>
          tagged {tags}
        </span>
      )
    }

    // todo，应该去判断hostname是否是当前域名，如果是的话不用打开新页面，否则会导致重新加载。 由于写在这里只是一个临时方案，更好的做法应该直接写在markdown的解析插件里。
    // 已经在magicly-remark-target-new中实现，当然，这里修改html会覆盖！
    // 由于remarkjs解析markdown后，[x][x]这种定义的链接在AST不是link而是definition，所以不好处理，放在这里比较好。
    post.html = post.html.replace(/<a href="/g, '<a target="_blank" href="')
    return (
      <Article>
        <Helmet title={`${post.frontmatter.title} | ${siteTitle}`} />
        {
          post.frontmatter.math ? <Helmet script={[{ src: `//cdn.bootcss.com/mathjax/2.7.1/MathJax.js?config=TeX-AMS-MML_HTMLorMML`, type: `text/javascript` }]} /> : ''
        }
        <Header>
          <Title>
            {post.frontmatter.title}
          </Title>
          <p>
            {post.frontmatter.date}
            {post.timeToRead} min read &middot; {tagsSection}
          </p>
        </Header>
        <ArticleEntry dangerouslySetInnerHTML={{ __html: post.html }} />
        <hr />
        <div id="comments" />
      </Article>
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
      fields {
        tagSlugs
      }
      frontmatter {
        title
        date(formatString: "YYYY-MM-DD HH:mm:ss")
        tags
        math
      }
    }
  }
`
