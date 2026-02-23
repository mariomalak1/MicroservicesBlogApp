import React, { useState } from 'react'

export default function PostForm({ onCreate }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      await onCreate({ title, content })
      setTitle('')
      setContent('')
    } catch (err) {
      setError(err.message)
    } finally { setSaving(false) }
  }

  return (
    <div className="card">
      <h2>Create Post</h2>
      <form onSubmit={submit}>
        <label>Title</label>
        <input value={title} onChange={e => setTitle(e.target.value)} required />

        <label>Content</label>
        <textarea value={content} onChange={e => setContent(e.target.value)} required />

        <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Create'}</button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  )
}
