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

blogsRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const deletedBlog = await Blog.findByIdAndDelete(id)

    if (!deletedBlog) {
      return res.status(404).json({ error: 'Blog not found' })
    }

    res.status(204).end()
  } catch (error) {
    res.status(400).json({ error: 'Malformated id' })
  }
})

blogsRouter.put('/:id', async (req, res) => {
  try {
    const { likes } = req.body
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { likes },
      { new:true, runValidators: true, context: 'query'}
    )

    if (!updatedBlog) {
      return res.status(404).end()
    }

    res.json(updatedBlog)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

module.exports = blogsRouter