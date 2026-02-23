import React, { useEffect, useState } from 'react'
import axios from 'axios'
import PostForm from './components/PostForm'
import PostList from './components/PostList'

const QUERY_URL = 'http://localhost:4003/'
const POSTS_URL = 'http://localhost:4001/posts-create'
const COMMENTS_URL_BASE = 'http://localhost:4002/posts'

export default function App() {
  const [posts, setPosts] = useState({})
  const [loading, setLoading] = useState(false)

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get(QUERY_URL)
      setPosts(data.posts || {})
    } catch (err) {
      console.error('Error fetching posts', err.message || err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPosts() }, [])

  const createPost = async ({ title, content }) => {
    try {
      await axios.post(POSTS_URL, { title, content })
      await fetchPosts()
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Failed to create post'
      throw new Error(msg)
    }
  }

  const createComment = async (postTitle, comment) => {
    const url = `${COMMENTS_URL_BASE}/${encodeURIComponent(postTitle)}/comments`
    try {
      await axios.post(url, { comment })
      await fetchPosts()
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Failed to create comment'
      throw new Error(msg)
    }
  }

  return (
    <div className="app-root">
      <header>
        <h1>Microservices Blog</h1>
        <p className="muted">A simple frontend talking to three microservices</p>
      </header>

      <main>
        <section className="left">
          <PostForm onCreate={createPost} />
        </section>

        <section className="right">
          {loading ? <div className="loading">Loading posts...</div>
            : <PostList posts={posts} onCreateComment={createComment} />}
        </section>
      </main>

      <footer>
        <small>Assumes backend services run on ports 4001 (posts), 4002 (comments), 4003 (query).</small>
      </footer>
    </div>
  )
}
