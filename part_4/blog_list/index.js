require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const blogsRouter = require('./routes/blogs')
const usersRouter = require('./routes/users')
const config =require('./utils/config')

const app = express()

mongoose.connect(config.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err.message))

app.use(express.json())
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

module.exports = app