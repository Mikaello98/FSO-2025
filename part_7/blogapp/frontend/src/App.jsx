import { useEffect, createRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { showNotification } from './reducers/notificationReducer'
import { initializeBlogs, createBlog, likeBlog, deleteBlog } from './reducers/blogReducer'
import { loginUser, logoutUser, setUserFromStorage } from './reducers/userReducer'

import Login from './components/Login'
import Blog from './components/Blog'
import NewBlog from './components/NewBlog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'


const App = () => {
  const dispatch = useDispatch()
  const blogs = useSelector((state) => state.blogs)
  const user = useSelector((state) => state.user)

  const blogFormRef = createRef()

  const notify = (msg, type = 'success') => {
    dispatch(showNotification({ message: msg, type }))
  }

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    dispatch(setUserFromStorage())
  }, [dispatch])

  const handleLogin = async (credentials) => {
    try {
      await dispatch(loginUser(credentials))
      notify(`Welcome back, ${user.name}`)
    } catch (error) {
      notify('Wrong credentials', 'error')
    }
  }

  const handleLogout = () => {
    const name = user?.name
    dispatch(logoutUser())
    notify(`${name} logged out`)
  }

  const handleCreate = async (blog) => {
    await dispatch(createBlog(blog))
    notify(`Blog created: ${blog.title}, ${blog.author}`)
    blogFormRef.current.toggleVisibility()
  }

  const handleVote = (blog) => {
    dispatch(likeBlog(blog))
    notify(`You liked: ${blog.title} by ${blog.author}`)
  }

  const handleDelete = (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      dispatch(deleteBlog(blog))
      notify(`Blog removed: ${blog.title} by ${blog.author}`)
    }
  }

  const byLikes = (a, b) => b.likes - a.likes

  if (!user) {
    return (
      <div>
        <h2>blogs</h2>
        <Notification />
        <Login doLogin={handleLogin} />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <div>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </div>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <NewBlog doCreate={handleCreate} />
      </Togglable>
      {blogs
        .slice()
        .sort(byLikes)
        .map((blog) => (
          <Blog 
            key={blog.id} 
            blog={blog} 
            handleVote={() => handleVote(blog)}
            handleDelete={() => handleDelete(blog)}
          />
        ))}
    </div>
  )
}

export default App
