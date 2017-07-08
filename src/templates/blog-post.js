import React from "react"
import Helmet from "react-helmet"
import Link from "gatsby-link"
import Bio from "../components/Bio"

import 'gitment/style/default.css'
import Gitment from 'gitment'

import styles from "../styles"
import { rhythm, scale } from "../utils/typography"
import presets from "../utils/presets"

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
        <span
          css={{
            fontStyle: `normal`,
            textAlign: `left`,
          }}
        >
          tagged {tags}
        </span>
      )
    }

    // todo，应该去判断hostname是否是当前域名，如果是的话不用打开新页面，否则会导致重新加载。 由于写在这里只是一个临时方案，更好的做法应该直接写在markdown的解析插件里。
    // 已经在magicly-remark-target-new中实现，当然，这里修改html会覆盖！
    // post.html = post.html.replace(/<a href="/g, '<a name target="_blank" href="')
    return (
      <div
        css={{
          maxWidth: rhythm(26),
        }}
      >
        <Helmet title={`${post.frontmatter.title} | ${siteTitle}`} />
        {
          post.frontmatter.math ? <Helmet script={[{src: `//cdn.bootcss.com/mathjax/2.7.1/MathJax.js?config=TeX-AMS-MML_HTMLorMML`, type: `text/javascript`}]} /> : ''
        }
        <header>
          <h1
            css={{
              marginBottom: rhythm(1 / 6),
              color: post.frontmatter.shadow,
            }}
          >
            {post.frontmatter.title}
          </h1>
          <p
            css={{
              ...scale(-1 / 5),
              display: `block`,
              color: `${styles.colors.light}`,
            }}
          >
            {post.frontmatter.date}
            {post.timeToRead} min read &middot; {tagsSection}
          </p>
        </header>
        <div dangerouslySetInnerHTML={{ __html: post.html }} className="post" />
        <hr
          css={{
            marginBottom: rhythm(1),
            marginTop: rhythm(2),
          }}
        />
        <div id="comments" />
        <Bio />
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
