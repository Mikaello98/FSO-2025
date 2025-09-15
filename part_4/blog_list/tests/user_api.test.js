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
let blogToDelete

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })
  const savedUser = await user.save()

  const userForToken = { username: savedUser.username, id: savedUser._id }
  token = jwt.sign(userForToken, process.env.SECRET)

  const blog = new Blog({
    title: 'Blog to Delete',
    author: 'Author',
    url: 'http://delete.com',
    likes: 3,
    user: savedUser._id
  })
  blogToDelete = await blog.save()
  savedUser.blogs = savedUser.blogs.concat(blogToDelete._id)
  await savedUser.save()
})

test('creator can delete their blog', async () => {
  await api
    .delete(`/api/blogs/${blogToDelete._id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const blogsAfter = await Blog.find({})
  assert.strictEqual(blogsAfter.length, 0)
})

test('deleting without token fails with 401', async () => {
  const response = await api
    .delete(`/api/blogs/${blogToDelete._id}`)
    .expect(401)

  assert.strictEqual(response.body.error, 'token missing or invalid')
})

test('deleting with another user’s token fails with 403', async () => {
  const passwordHash = await bcrypt.hash('otherpass', 10)
  const otherUser = new User({ username: 'other', passwordHash })
  const savedOtherUser = await otherUser.save()

  const otherToken = jwt.sign(
    { username: savedOtherUser.username, id: savedOtherUser._id },
    process.env.SECRET
  )

  const response = await api
    .delete(`/api/blogs/${blogToDelete._id}`)
    .set('Authorization', `Bearer ${otherToken}`)
    .expect(403)

  assert.strictEqual(response.body.error, 'only the creator can delete this blog')
})

after(async () => {
  await mongoose.connection.close()
})
