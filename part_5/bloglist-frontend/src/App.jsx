import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const sortBlogs = (blogs) => {
  return [...blogs].sort((a, b) => (b.likes || 0) - (a.likes || 0))
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    const fetchBlogs = async () => {
      const fetched = await blogService.getAll()
      setBlogs(sortBlogs(fetched))
    }
    fetchBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials)
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setMessage(`Welcome back, ${user.name}`)
      setMessageType('success')
      setTimeout(() => {
        setMessage(null)
        setMessageType(null)
      }, 5000)
    } catch {
      setMessage('Wrong credentials')
      setMessageType('error')
      setTimeout(() => {
        setMessage(null)
        setMessageType(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
    setMessage('Logged out successfully')
    setMessageType('success')
    setTimeout(() => {
      setMessage(null)
      setMessageType(null)
    }, 5000)
  }

  const addBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.create(blogObject)
      setBlogs(prev => sortBlogs(prev.concat(newBlog)))
      setMessage(`A new blog '${newBlog.title}' by ${newBlog.author} added`)
      setMessageType('success')
      setTimeout(() => {
        setMessage(null)
        setMessageType(null)
      }, 5000)

      blogFormRef.current?.toggleVisibility?.()
    } catch {
      setMessage('Failed to add blog')
      setMessageType('error')
      setTimeout(() => {
        setMessage(null)
        setMessageType(null)
      }, 5000)
    }
  }

  const handleLike = async (blog) => {
    try {
      const updated = {
        ...blog,
        likes: (blog.likes || 0) + 1,
        user: blog.user.id || blog.user
      }
      const returnedBlog = await blogService.update(blog.id, updated)
      const blogWithUser = { ...returnedBlog, user: blog.user }

      setBlogs(prev =>
        sortBlogs(prev.map(b => (b.id === blog.id ? blogWithUser : b)))
      )
    } catch {
      setMessage('Failed to like blog')
      setMessageType('error')
      setTimeout(() => {
        setMessage(null)
        setMessageType(null)
      }, 5000)
    }
  }

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        await blogService.remove(blog.id)
        setBlogs(prev => prev.filter(b => b.id != blog.id))
        setMessage(`Blog '${blog.title}' removed by ${blog.author}`)
        setMessageType('success')
        setTimeout(() => {
          setMessage(null)
          setMessageType(null)
        }, 5000)
      } catch {
        setMessage('Failed to remove blog')
        setMessageType('error')
        setTimeout(() => {
          setMessage(null)
          setMessageType(null)
        }, 5000)
      }
    }
  }

  return (
    <div>
      <h2>{user === null ? 'log in to application' : 'blogs'}</h2>
      <Notification message={message} type={messageType} />

      {user === null ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <div>
          <p>
            {user.name || user.username} logged in{' '}
            <button onClick={handleLogout}>logout</button>
          </p>

          <Togglable buttonLabel="create new blog" ref={blogFormRef}>
            <BlogForm onCreate={addBlog} />
          </Togglable>

          {blogs.map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              onLike={() => handleLike(blog)}
              onDelete={() => handleDelete(blog)}
              user={user}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default App