import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"

export const query = graphql`
  query($id: ID!) {
    wpgraphql {
      post(id: $id) {
        title
        content
        date
        modified
        categories {
          nodes {
            id
            name
          }
        }
      }
    }
  }
`

const PostTemplate = ({ data }) => {
  const post = data.wpgraphql.post

  console.log(post.categories.nodes)

  return (
    <Layout>
      <h1 dangerouslySetInnerHTML={{ __html: post.title }} />
      {post.date} {post.modified}
      {post.categories.nodes.map(category => (
        <span key={category.id}>{category.name}</span>
      ))}
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </Layout>
  )
}

export default PostTemplate
