require('dotenv').config()
const supertest = require('supertest')
const mongoose = require('mongoose')
const { test, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const app = require('../index')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})

  const user = new User({
    username: 'root',
    name: 'Super User',
    passwordHash: 'hashedpassword'
  })
  await user.save()
})

test('creation succeeds with a fresh username', async () => {
  const newUser = {
    username: 'newuser',
    name: 'Test User',
    password: 'password123'
  }

  const response = await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.username, newUser.username)

    const users = await User.find ({})
    assert.strictEqual(users.length, 2)
})

test('fails if username is missing', async () => {
  const newUser = { name: 'No Username', password: 'password123' }

  const response = await api.post('/api/users').send(newUser).expect(400)

  assert.match(response.body.error, /username and password are required/i)

  const users = await User.find({})
  assert.strictEqual(users.length, 1)
})

test('fails if password is missing', async () => {
  const newUser = { username: 'nopassword', name: 'No Password' }

  const response = await api.post('/api/users').send(newUser).expect(400)

  assert.match(response.body.error, /username and password are required/i)

  const users = await User.find({})
  assert.strictEqual(users.length, 1)
})

test('fails if username is shorter than 3 characters', async () => {
  const newUser = { username: 'an', name: 'Short User', password: 'password123' }

  const response = await api.post('/api/users').send(newUser).expect(400)

  assert.match(response.body.error, /username must be at least 3 characters/i)
})

test('fails if password is shorter than 3 characters', async () => {
  const newUser = { username: 'validuser', name: 'Short Pass', password: 'pw' }

  const response = await api.post('/api/users').send(newUser).expect(400)

  assert.match(response.body.error, /password must be at least 3 characters/i)
})

test('fails if username is not unique', async () => {
  const newUser = { username: 'root', name: 'Duplicate', password: 'password123' }

  const response = await api.post('/api/users').send(newUser).expect(400)

  assert.match(response.body.error, /E11000 duplicate key error/i)
})

after(async () => {
  await mongoose.connection.close()
})