const express = require('express')
require('dotenv').config()
const mongoose = require('mongoose')
const blogsRouter = require('./routes/blogs')

const app = express()

const password = process.env.MONGODB_PASSWORD
const user = process.env.MONGODB_USER || 'mikkus'
const dbName = process.env.MONGODB_DB || 'personApp'

if (!password) {
  console.error('MONGODB_PASSWORD not set in .env')
  process.exit(1)
}

const mongoUrl = `mongodb+srv://mikkus:${password}@cluster0.lphmomu.mongodb.net/personApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(mongoUrl)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB'))

app.use(express.json())
app.use('/api/blogs', blogsRouter)

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})