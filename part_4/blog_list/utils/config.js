require('dotenv').config()

const PORT = process.env.PORT || 3003
const USER = process.env.MONGODB_USER || 'mikkus'
const PASSWORD = process.env.MONGODB_PASSWORD
const DB_NAME = process.env.MONGODB_DB || 'bloglist'

const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

if (!PASSWORD) {
  console.error('MONGODB_PASSWORD not set in .env')
  process.exit(1)
}

const MONGO_URL = `mongodb+srv://${USER}:${PASSWORD}@cluster0.lphmomu.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`

const TEST_MONGODB_URI = `mongodb+srv://${USER}:${PASSWORD}@cluster0.lphmomu.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`

module.exports = {
  PORT,
  MONGO_URL,
  MONGODB_URI,
  TEST_MONGODB_URI
}