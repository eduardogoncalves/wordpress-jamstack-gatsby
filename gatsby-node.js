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
        posts(where: { orderby: { field: DATE, order: DESC } }, first: 500) {
          edges {
            cursor
            node {
              id
              uri
            }
          }
        }
        readingSettings {
          postsPerPage
        }
      }
    }
  `)

  const pages = result.data.wpgraphql.pages.nodes
  const posts = result.data.wpgraphql.posts.edges

  const postsPerPage = result.data.wpgraphql.readingSettings.postsPerPage
  const totalPostPages = Math.ceil(posts.length / postsPerPage)

  Array.from({ length: totalPostPages }).forEach((_, i) => {
    actions.createPage({
      path: i === 0 ? `/blog` : `/blog/${i + 1}`,
      component: require.resolve("./src/templates/blog.js"),
      context: {
        after: i === 0 ? null : posts[i * postsPerPage - 1].cursor,
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

  //TODO: change gatsby-source-graphql to gatsby-source-wordpress-experimental

  /// TODO: load more client side
  //https://www.wpgraphql.com/2020/03/26/forward-and-backward-pagination-with-wpgraphql/
  //https://www.gatsbyjs.org/docs/data-fetching/#retrieving-data-with-the-fetch-api
  //https://github.com/gatsbyjs/gatsby/blob/master/examples/data-fetching/src/pages/index.js#L24

  pages.forEach(page => {
    actions.createPage({
      path: page.uri,
      component: require.resolve("./src/templates/page-template.js"),
      context: {
        id: page.id,
      },
    })
  })

  //TODO: Gatsby Incremental Builds to build only new posts
  //https://www.netlify.com/blog/2020/04/23/enable-gatsby-incremental-builds-on-netlify/
  posts.forEach(post => {
    actions.createPage({
      path: post.node.uri,
      component: require.resolve("./src/templates/post-template.js"),
      context: {
        id: post.node.id,
      },
    })
  })
}
