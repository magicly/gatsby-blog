import React from "react"
import Helmet from "react-helmet"
import Link from "gatsby-link"
import Bio from "../components/Bio"

import styles from "../styles"
import { rhythm, scale } from "../utils/typography"
import presets from "../utils/presets"

class BlogPostTemplate extends React.Component {
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

    return (
      <div
        css={{
          maxWidth: rhythm(26),
        }}
      >
        <Helmet title={`${post.frontmatter.title} | ${siteTitle}`} />
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
      }
    }
  }
`
