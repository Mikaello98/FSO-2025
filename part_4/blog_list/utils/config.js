require('dotenv').config()

const PORT = process.env.PORT || 3003
const USER = process.env.MONGODB_USER || 'mikkus'
const PASSWORD = process.env.MONGODB_PASSWORD
const DB_NAME = process.env.MONGODB_DB || 'bloglist'

if (!PASSWORD) {
  console.error('MONGODB_PASSWORD not set in .env')
  process.exit(1)
}

const MONGO_URL = `mongodb+srv://${USER}:${PASSWORD}@cluster0.lphmomu.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`

module.exports = {
  PORT,
  MONGO_URL
}