import { useState } from 'react'
import React from 'react'

const BlogForm = ({ onCreate }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    onCreate({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h3>Create new blog</h3>
      <form onSubmit={handleSubmit}>
        <div>
          title: <input value={title} onChange={({ target }) => setTitle(target.value)} placeholder='Title' />
        </div>
        <div>
          author: <input value={author} onChange={({ target }) => setAuthor(target.value)} placeholder='Author' />
        </div>
        <div>
          url: <input value={url} onChange={({ target }) => setUrl(target.value)} placeholder='Url' />
        </div>
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default BlogForm