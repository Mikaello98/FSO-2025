const DataLoader = require('dataloader')
const Book = require('../models/book')

const bookCountLoader = new DataLoader(async (authorIds) => {
  const books = await Book.aggregate([
    { $match: { author: { $in: authorIds } } },
    { $group: { _id: '$author', count: { $sum: 1 } } }
  ])

  const bookCountMap = {}
  books.forEach(b => {
    bookCountMap[b._id.toString()] = b.count
  })

  return authorIds.map(id => bookCountMap[id.toString()] || 0)
})

module.exports = bookCountLoader