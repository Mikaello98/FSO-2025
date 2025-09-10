require('dotenv').config()
const supertest = require('supertest')
const mongoose = require('mongoose')
const { test } = require('node:test')
const assert = require('node:assert')
const app = require('../index')
const Blog = require('../models/blog')

const api = supertest(app)

test('blogs are returned as JSON and correct amount', async () => {
  await Blog.deleteMany({})

  const initialBlogs = [
    { title: 'Blog 1', author: 'Author 1', url: 'url1.com', likes: 5 },
    { title: 'Blog 2', author: 'Author 2', url: 'url2.com', likes: 3 }
  ]
  await Blog.insertMany(initialBlogs)

  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.length, 2)
  const titles = response.body.map(blog => blog.title)
  assert(titles.includes('Blog 1'))
  assert(titles.includes('Blog 2'))
})

test('blog posts have id property instead of _id', async () => {
  await Blog.deleteMany({})

  const newBlog = {
    title: 'Test Blog',
    author: 'Tester',
    url: 'http://test.com',
    likes: 1
  }

  await Blog.create(newBlog)

  const response = await api.get('/api/blogs').expect(200)

  const blog = response.body[0]
  assert.ok(blog.id, 'id property is missing')
  assert.strictEqual(blog._id, undefined, '_id property should not be present')
})

test('creating a new blog increases the total number of blogs', async () => {
  await Blog.deleteMany({})

  const blogsAtStart = await Blog.find({})
  assert.strictEqual(blogsAtStart.length, 0)

  const newBlog = {
    title: 'New Test Blog',
    author: 'Test Author',
    url: 'http://newblog.com',
    likes: 10
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.title, newBlog.title)
    assert.strictEqual(response.body.author, newBlog.author)
    assert.strictEqual(response.body.url, newBlog.url)
    assert.strictEqual(response.body.likes, newBlog.likes)

    const blogsAtEnd = await Blog.find({})
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    assert(titles.includes(newBlog.title))
})

test('missing likes property defaults to 0', async () => {
  await Blog.deleteMany({})

  const newBlog = {
    title: 'Blog without likes',
    author: 'Author X',
    url: 'http://nolikes.com'
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, 0)
})

test('missing title or url returns 400', async () => {
  await Blog.deleteMany({})

  const blogMissingTitle = {
    author: 'Author A',
    url: 'http://missingtitle.com',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .send(blogMissingTitle)
    .expect(400)

    const blogMissingUrl = {
      title: 'Blog without URL',
      author: 'Author B',
      likes: 3
    }

    await api
      .post('/api/blogs')
      .send(blogMissingUrl)
      .expect(400)

    const blogsAtEnd = await Blog.find({})
    assert.strictEqual(blogsAtEnd.length, 0)
})

test('close DB connection', async () => {
  await mongoose.connection.close()
})
