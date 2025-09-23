import React from "react"
import { useState } from "react"

const Blog = ({ blog, onLike, onDelete, user }) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    padding: '5px',
    border: '1px solid black',
    marginBottom: '5px'
  }

  return (
    <div className='blog' style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>
      {visible && (
        <div>
          <div>URL: {blog.url}</div>
          <div>
            Likes: {blog.likes}{' '} 
            <button onClick={() => onLike(blog)}>like</button>
          </div>
          {blog.user && <div>Added by: {blog.user.username}</div>}
          {user && blog.user?.username === user.username && (
            <button onClick={onDelete}>remove</button>
          )}
        </div>
      )}
    </div>
)
}

export default Blog
