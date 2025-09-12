require('dotenv').config()
const { test, beforeEach, after } = require('node:test')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../index')
const User = require('../models/user')
const Blog = require('../models/blog')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const assert = require('node:assert')

const api = supertest(app)
let token

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })
  const savedUser = await user.save()

  const userForToken = { username: savedUser.username, id: savedUser._id }
  token = jwt.sign(userForToken, process.env.SECRET)

  const initialBlog = new Blog({
    title: 'First Blog',
    author: 'Author One',
    url: 'http://example.com',
    likes: 5,
    user: savedUser._id
  })
  const savedBlog = await initialBlog.save()
  savedUser.blogs = savedUser.blogs.concat(savedBlog._id)
  await savedUser.save()
})

test('blogs are returned as JSON and include the user info', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.length, 1)
  assert.strictEqual(response.body[0].user.username, 'root')
})

test('creating a new blog succeeds with valid token', async () => {
  const newBlog = {
    title: 'New Blog',
    author: 'Author Two',
    url: 'http://newblog.com',
    likes: 10
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAfter = await Blog.find({})
  assert.strictEqual(blogsAfter.length, 2)
  assert.ok(blogsAfter.map(b => b.title).includes('New Blog'))
})

test('creating a blog fails without token', async () => {
  const newBlog = {
    title: 'Unauthorized Blog',
    author: 'No Token',
    url: 'http://fail.com'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
})

test('missing likes property defaults to 0', async () => {
  const newBlog = {
    title: 'No Likes Blog',
    author: 'Author',
    url: 'http://nolikes.com'
  }

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)

  assert.strictEqual(response.body.likes, 0)
})

test('missing title or url returns 400', async () => {
  const newBlog = { author: 'Author Only' }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
})

after(async () => {
  await mongoose.connection.close()
})
