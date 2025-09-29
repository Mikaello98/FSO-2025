const mongoose = require('mongoose')
const Blog = require('./models/blog')
const {MONGODB_URI}=require('./utils/config')



const deleteBlogs = async () => {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB')

    const res = await Blog.deleteMany({}) // delete all blogs
    console.log(res)

    await mongoose.connection.close()
    console.log('Connection closed')
  } catch (err) {
    console.error(err)
  }
}

deleteBlogs()
