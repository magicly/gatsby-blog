import React from "react"
import { Row, Col, Pagination, message } from 'antd';
import MediaQuery from 'react-responsive';
import ArticleCard from '../components/ArticleCard';
import Sidebar from '../components/Sidebar';

import Link from "gatsby-link"
import Helmet from "react-helmet"

import Bio from "../components/Bio"

const Index = (props) => {
  const siteTitle = props.data.site.siteMetadata.title;
  const posts = props.data.allMarkdownRemark.edges
  const codingnet = props.data.site.siteMetadata.codingnet;

  const articles = posts.map(post => {
    return {
      id: post.node.fields.slug,
      time: post.node.frontmatter.date,
      title: post.node.frontmatter.title,
      summary: post.node.excerpt,
      category: post.node.frontmatter.category,
      tags: post.node.frontmatter.tags,
    }
  });
  const categoryList = articles.map(post => post.category)
  const tagsList = articles.map(post => post.tags)
  const total = posts.length;
  const main = (
    <div>
      <ArticleCard articles={articles} />
      <Pagination
        showQuickJumper
        defaultCurrent={1}
        defaultPageSize={5}
        total={total}
        //onChange={this.handleChange} // todo
        //className={styles.pagination}
      />
    </div>
  );
  return (
    <Row>
      <Helmet title={siteTitle} />
      <Col span={1} />
      <MediaQuery query="(min-width:800px)">
        <Col span={17}>{main}</Col>
        <Col span={5}>
          <Sidebar categoryList={categoryList} tagsList={tagsList} />
        </Col>
      </MediaQuery>
      <MediaQuery query="(max-width:800px)">
        <Col span={22}>
          {main}
        </Col>
      </MediaQuery>
      <Col span={1} />
    </Row>
  );
}

export default Index;

export const pageQuery = graphql`
query IndexQuery3 {
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
