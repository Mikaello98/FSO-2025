require('dotenv').config()
const { test, beforeEach, after  } = require('node:test')
const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const assert = require('node:assert')

const app = require('../index')
const User = require('../models/user')
const Blog = require('../models/blog')

const api = supertest(app)

let token
beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User ({ username: 'root', passwordHash })
  const savedUser = await user.save()

  const userForToken = { username: savedUser.username, id: savedUser._id }
  token = jwt.sign(userForToken, process.env.SECRET)
})

test('adding a blog fails with 401 if token is not provided', async () => {
  const newBlog = {
    title: 'Unauthorized Attempt',
    author: 'Cracker',
    url: 'http://crack.com',
    likes: 1
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)

    assert.strictEqual(response.body.error, 'token missing or invalid')

    const blogsAfter = await Blog.find({})
    assert.strictEqual(blogsAfter.length, 0)
})

after(async () => {
  await mongoose.connection.close()
})