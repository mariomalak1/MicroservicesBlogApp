import React from 'react'
import CommentForm from './CommentForm'

function PostCard({ post, onCreateComment }) {
  return (
    <div className="post-card">
      <h3>{post.title}</h3>
      <div className="date">{new Date(post.date).toLocaleString()}</div>
      <p>{post.content}</p>
      <div className="comments">
        <h4>Comments</h4>
        {post.comments && post.comments.length > 0 ? (
          post.comments.map((c, i) => (
            <div key={i} className="comment">{c.comment} <span className="cdate">{new Date(c.date).toLocaleString()}</span></div>
          ))
        ) : <div className="muted">No comments yet</div>}
      </div>
      <CommentForm postTitle={post.title} onCreate={onCreateComment} />
    </div>
  )
}

export default function PostList({ posts, onCreateComment }) {
  const keys = Object.keys(posts)
  if (!keys.length) return <div className="muted">No posts available</div>

  return (
    <div className="posts-grid">
      {keys.map(k => <PostCard key={k} post={posts[k]} onCreateComment={onCreateComment} />)}
    </div>
  )
}
