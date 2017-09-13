import React from "react"
import MediaQuery from 'react-responsive';
import { Archives } from '../components/Articles';

import Link from "gatsby-link"
import Helmet from "react-helmet"

const Index = (props) => {
  const siteTitle = props.data.site.siteMetadata.title;
  const posts = props.data.allMarkdownRemark.edges
  const codingnet = props.data.site.siteMetadata.codingnet;

  const articles = posts.map(post => {
    const html = post.node.html;
    const moreOffset = html.indexOf('<!-- more -->');
    const summary = html.slice(0, moreOffset === -1 ? 800 : moreOffset);
    return {
      id: post.node.fields.slug.replace('/', ''),
      time: post.node.frontmatter.date,
      title: post.node.frontmatter.title,
      summary,
      category: post.node.frontmatter.category,
      tags: post.node.frontmatter.tags,
    }
  });
  const categoryList = articles.map(post => post.category)
  const tagsList = articles.map(post => post.tags)
  const total = props.pathContext.total;
  const current = props.pathContext.current;
  const main = <Archives articles={articles} current={current} total={total} />;
  return (
    <div>
      <Helmet title={siteTitle} />
      <div>{main}</div>
    </div>
  );
}

export default Index;

export const pageQuery = graphql`
query ArchivesQuery {
  site {
    siteMetadata {
      title
    }
  }
  allMarkdownRemark(
    filter: { frontmatter: { draft: { ne: true } } }
    sort: {fields: [frontmatter___date], order: DESC}
    ) {
    edges {
      node {
        html
        timeToRead
        excerpt
        fields {
          slug
        }
        frontmatter {
          title
          date(formatString: "YYYY-MM-DD")
          category
          tags
        }
      }
    }
  }
}
`
