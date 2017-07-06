const _ = require("lodash")
// const Promise = require("bluebird")
const path = require("path")
// const slash = require(`slash`)

exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators

  const pages = []
  const blogPost = path.resolve("./src/templates/blog-post.js")
  const tagPage = path.resolve("./src/templates/tag.js")
  return graphql(
    `
      {
        allMarkdownRemark(limit: 1000, filter: { frontmatter: { draft: { ne: true }}}) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                tags
              }
            }
          }
        }
      }
    `
  ).then(result => {
    if (result.errors) {
      console.log(result.errors)
      reject(result.errors)
    }

    // Create blog posts pages.
    result.data.allMarkdownRemark.edges.forEach(edge => {
      createPage({
        path: edge.node.fields.slug, // required
        component: blogPost,
        context: {
          slug: edge.node.fields.slug,
        },
      })
    });

    // create tag pages
    const tags = result.data.allMarkdownRemark.edges.reduce((tags, edge) => {
      return tags.concat(edge.node.frontmatter.tags);
    }, []);
    let uniqueTags = _.uniq(tags);
    uniqueTags.forEach(tag => {
      createPage({
        path: `/tags/${_.kebabCase(tag)}/`,
        component: tagPage,
        context: {
          tag
        }
      })
    })
  })
}

// Add custom slug for blog posts to both File and MarkdownRemark nodes.
exports.onCreateNode = ({ node, boundActionCreators, getNode }) => {
  const { createNodeField } = boundActionCreators

  switch (node.internal.type) {
    case 'File':
      const parsedFilePath = path.parse(node.relativePath)
      let slug = `/${parsedFilePath.dir}/`
      if (slug === '//') {
        slug = `/${parsedFilePath.name}/`
      }
      createNodeField({
        node,
        name: 'slug',
        value: slug
      })
      return

    case 'MarkdownRemark':
      const fileNode = getNode(node.parent)
      createNodeField({
        node,
        name: 'slug',
        value: fileNode.fields.slug,
      })
      if (node.frontmatter.tags) {
        const tagSlugs = node.frontmatter.tags.map(tag => {
          return `/tags/${_.kebabCase(tag)}/`;
        });
        createNodeField({
          node,
          name: 'tagSlugs',
          value: tagSlugs
        })
      }
      return
  }
}

// exports.modifyWebpackConfig = ({config, stage}) => {
  // config.merge({
  //   output: {
  //     publicPath: 'http://localhost:50000000000/',
  //   }
  // })

  // return config;
// }
