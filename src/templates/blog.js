import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"

export const query = graphql`
  query($first: Int, $after: String = null) {
    wpgraphql {
      posts(
        where: { orderby: { field: DATE, order: DESC } }
        first: $first
        after: $after
      ) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          endCursor
          startCursor
        }
        edges {
          node {
            id
            title
            date
            uri
          }
        }
      }
    }
  }
`
const Blog = ({ data, pageContext }) => {
  const posts = data.wpgraphql.posts.edges

  return (
    <Layout>
      {posts.map(post => (
        <article key={post.node.id}>
          <h2>
            <Link
              to={post.node.uri}
              dangerouslySetInnerHTML={{ __html: post.node.title }}
            />
          </h2>
          {/* <div dangerouslySetInnerHTML={{ __html: post.excerpt }} /> */}
        </article>
      ))}
      {pageContext.hasPreviousPage && (
        <Link to={pageContext.previousPageLink}>Prev</Link>
      )}

      {` ${pageContext.currentPageNumberHuman} of ${pageContext.totalPostPages} `}

      {pageContext.hasNextPage && (
        <Link to={pageContext.nextPageLink}>Next</Link>
      )}
    </Layout>
  )
}

export default Blog
