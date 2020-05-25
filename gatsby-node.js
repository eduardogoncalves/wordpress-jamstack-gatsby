exports.createPages = async ({ actions, graphql }) => {
  const result = await graphql(`
    {
      wpgraphql {
        pages {
          nodes {
            uri
            id
          }
        }
        posts(where: { orderby: { field: DATE, order: DESC } }) {
          edges {
            cursor
            node {
              id
              uri
            }
          }
        }
      }
    }
  `)

  const pages = result.data.wpgraphql.pages.nodes
  const posts = result.data.wpgraphql.posts.edges

  const postsPerPage = 1
  const totalPostPages = Math.ceil(posts.length / postsPerPage)

  Array.from({ length: totalPostPages }).forEach((_, i) => {
    actions.createPage({
      path: i === 0 ? `/blog` : `/blog/${i + 1}`,
      component: require.resolve("./src/templates/blog.js"),
      context: {
        after: i === 0 ? null : posts[i - 1].cursor,
        first: postsPerPage,
        hasPreviousPage: i - 1 >= 0,
        previousPageLink: i === 1 ? `/blog` : `/blog/${i}`,
        hasNextPage: i + 1 < totalPostPages,
        nextPageLink: `/blog/${i + 2}`,
        currentPageNumberHuman: i + 1,
        totalPostPages,
      },
    })
  })

  pages.forEach(page => {
    actions.createPage({
      path: page.uri,
      component: require.resolve("./src/templates/page-template.js"),
      context: {
        id: page.id,
      },
    })
  })

  posts.forEach(post => {
    actions.createPage({
      path: `blog/${post.node.uri}`,
      component: require.resolve("./src/templates/post-template.js"),
      context: {
        id: post.node.id,
      },
    })
  })
}
