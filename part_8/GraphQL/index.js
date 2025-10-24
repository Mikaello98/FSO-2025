const { ApolloServer } = require('@apollo/server')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const { createServer } = require('http')
const { WebSocketServer} = require('ws')
const { useServer } = require('graphql-ws/lib/use/ws')
const { PubSub } = require('graphql-subscriptions')
const { GraphQLError } = require('graphql')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

const pubsub = new PubSub()

const MONGODB_URI = 'mongodb://127.0.0.1:27017/library'
const JWT_SECRET = 'SALAISUUS'

mongoose.set('strictQuery', false)
console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => console.log('connected to MongoDB'))
  .catch((error) => console.log('error connection to MongoDB:', error.message))

const typeDefs = `

  type Author {
    name: String!
    born: Int
    bookCount: Int
    id: ID!
  }

  type Book {
    title: String!
    author: Author!
    published: Int!
    genres: [String!]!
    id: ID!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book

    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author

    createUser(
      username: String!
      favoriteGenre: String!
    ): User

    login(
      username: String!
      password: String!
    ): Token
  }

  type Subscription {
    bookAdded: Book!
  }
`

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),

    allBooks: async (root, args) => {
      let filter = {}
      if (args.genre) filter.genres = { $in: [args.genre] }
      
     const books = await Book.find(filter).populate('author')
      if (args.author) return books.filter(b => b.author.name === args.author)
      
      return books
    },

    allAuthors: async () => ({}),
    me: (root, args, context) => context.currentUser
  },

  Author: {
    bookCount: async (root, args, context) => {
      return context.bookCountLoader.load(root._id)
    }
  },

  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' }
        })
      }
      try {
        let author = await Author.findOne({ name: args.author })
        if (!author) {
          author = new Author({ name: args.author })
          await author.save()
        }
        const book = new Book({ ...args, author: author._id })
        await book.save()
        const populatedBook = await book.populate('author')

        pubsub.publish('BOOK_ADDED', { bookAdded: populatedBook })

        return populatedBook
      } catch (error) {
        throw new GraphQLError(error.message, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
          }
        })
      }
    },

    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' }
        })
      }
      const author = await Author.findOne({ name: args.name })
      if (!author) {
        throw new GraphQLError('author not found', {
          extensions: { code: 'BAD_USER_INPUT', invalidArgs: args.name }
        })
      }

      author.born = args.setBornTo
      await author.save()
      return author
    },

    createUser: async (root, args) => {
      const user = new User({ ...args })
      try {
        return await user.save()
      } catch (error) {
        throw new GraphQLError(error.message, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
            error
          },
        })
      }
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
      if (!user || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'BAD_USER_INPUT' }
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, JWT_SECRET) }
    },
  },

  Subscription: {
      bookAdded: {
        subscribe: () => pubsub.asyncIterator('Book_ADDED')
      }
    }
}

const express = require('express')
const cors = require('cors')
const { expressMiddleWare } = require('@apollo/server/express4')
const { decode } = require('punycode')

const app = express()
app.use(cors())
app.use(express.json())

const httpServer = createServer(app)
const schema = makeExecutableSchema({ typeDefs, resolvers })

const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
})
useServer({ schema }, wsServer)

const server = new ApolloServer({
  schema,
})

await server.start()

app.use(
  '/graphql',
  expressMiddleWare(server, {
    context: async ({ req }) => {
      const auth = req ? req.headers.authorization : null
      let currentUser = null
      
      if (auth && auth.toLowerCase().startsWith('bearer ')) {
        try {
          const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET)
          const currentUser = await User.findById(decodedToken.id)
          return { currentUser }
        } catch {
          return { currentUser: null }
        }
      }
      return { currentUser, bookCountLoader }
    }
  })
)

const PORT = 4000
httpServer.listen(PORT, () => {
  console.log(`Server ready at http://localhost:${PORT}/graphql`)
  console.log(`Subscriptions ready at ws://localhost:${PORT}/graphql`)
})