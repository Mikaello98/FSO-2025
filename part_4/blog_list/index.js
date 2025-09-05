const express = require('express')
const mongoose = require('mongoose')
const blogsRouter = require('./routes/blogs')
const config = require('./utils/config')

const app = express()

mongoose.set('strictQuery', false)
mongoose.connect(config.MONGO_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB', err))

app.use(express.json())
app.use('/api/blogs', blogsRouter)

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
})