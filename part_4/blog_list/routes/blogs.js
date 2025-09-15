const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../middleware/userExtractor')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  res.json(blogs)
})

blogsRouter.post('/', userExtractor, async (req, res) => {
  const user = req.user
  const body = req.body

  if (!user) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }

  if (!body.title || !body.url) {
    return res.status(400).json({ error: 'title and url are required' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  const populatedBlog = await savedBlog.populate('user', { username: 1, name: 1 })
  res.status(201).json(populatedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (req, res) => {
  const user = req.user
  if (!user) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = await Blog.findById(req.params.id)
  if (!blog) {
    return res.status(404).json({ error: 'Blog not found' })
  }

  if (blog.user.toString() !== user._id.toString()) {
    return res.status(403).json({ error: 'only the creator can delete this blog' })
  }

  await blog.deleteOne()
  res.status(204).end()
})

blogsRouter.put('/:id', async (req, res) => {
  const { likes } = req.body
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { likes },
      { new: true, runValidators: true, context: 'query' }
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
