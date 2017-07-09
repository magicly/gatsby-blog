import React from "react"
import Link from "gatsby-link"
import Helmet from "react-helmet"

import Bio from "../components/Bio"
import { rhythm } from "../utils/typography"

import styles from "../styles"
import presets from "../utils/presets"

class Index extends React.Component {
  render() {
    const siteTitle = this.props.data.site.siteMetadata.title;
    const posts = this.props.data.allMarkdownRemark.edges
    const codingnet = this.props.data.site.siteMetadata.codingnet;

    return (
      <div>
        <Helmet title={siteTitle} />
        <Bio />
        <ul
            css={{
              marginBottom: rhythm(2),
              marginTop: rhythm(2),
              marginLeft: 0,
              listStyle: `none`,
            }}
          >
            {posts.map(post =>
              <li key={post.node.fields.slug}>
                <span
                  css={{
                    color: styles.colors.light,
                    display: `block`,
                    [presets.Tablet]: {
                      float: `right`,
                      marginLeft: `1rem`,
                    },
                  }}
                >
                  {post.node.frontmatter.date}
                </span>
                <Link to={post.node.fields.slug} className="link-underline">
                  {post.node.frontmatter.title}
                </Link>
              </li>
            )}
          </ul>
           <p>Powerd By <a href="https://github.com/gatsbyjs/gatsby" target="_blank">Gatsby</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
           Hosted by {codingnet ? <a href="https://pages.coding.me" target="_blank" style={{"font-weight": "bold"}}>Coding Pages</a> : 
                                  <a href="https://netlify.com" target="_blank" style={{"font-weight": "bold"}}>Netlify</a>}
           </p>
      </div>
    )
  }
}

export default Index;

export const pageQuery = graphql`
query IndexQuery {
  site {
    siteMetadata {
      title
      codingnet
    }
  }
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
        }
      }
    }
  }
}
`
