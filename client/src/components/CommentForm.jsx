import React, { useState } from 'react'

export default function CommentForm({ postTitle, onCreate }) {
  const [comment, setComment] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      await onCreate(postTitle, comment)
      setComment('')
    } catch (err) {
      setError(err.message)
    } finally { setSaving(false) }
  }

  return (
    <form className="comment-form" onSubmit={submit}>
      <input value={comment} onChange={e => setComment(e.target.value)} placeholder="Write a comment..." required />
      <button type="submit" disabled={saving}>{saving ? 'Posting...' : 'Post'}</button>
      {error && <div className="error">{error}</div>}
    </form>
  )
}
