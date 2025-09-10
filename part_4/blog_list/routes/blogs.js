const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find ({})
  res.json(blogs)
})

blogsRouter.post('/', async (req, res) => {
  try {
    const blog = new Blog(req.body)
    const savedBlog = await blog.save()
    res.status(201).json(savedBlog)
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message})
    }
    res.status(500).json({ error: 'Something went wrong'})
  }
})

module.exports = blogsRouter