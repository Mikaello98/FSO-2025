const jwt = require('jsonwebtoken')
const User = require('../models/user')

const userExtractor = async (req, res, next) => {
  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)

    if (!decodedToken) {
      return res.status(401).json({ error: 'token missing or invalid'})
    }

    const user = await User.findById(decodedToken.id)
    if(!user) {
      return res.status(401).json({ error: 'user not found' })
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }
}

module.exports = { userExtractor}