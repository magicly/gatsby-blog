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
    const edges = result.data.allMarkdownRemark.edges;
    for (let i = 0; i < edges.length; i += 1) {
      const currentUrl = edges[i].node.fields.slug;
      const prevUrl = i === 0 ? null : edges[i - 1].node.fields.slug;
      const prevTitle = i === 0 ? null : edges[i - 1].node.frontmatter.title;
      const nextUrl = i === edges.length - 1 ? null : edges[i + 1].node.fields.slug;
      const nextTitle = i === edges.length - 1 ? null : edges[i + 1].node.frontmatter.title;
      createPage({
        path: 'articles' + currentUrl, // required
        component: blogPost,
        context: {
          prev: { url: prevUrl, title: prevTitle },
          slug: currentUrl,
          next: { url: nextUrl, title: nextTitle },
        },
      })
    };

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
