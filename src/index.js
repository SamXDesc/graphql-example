import { ApolloServer, gql } from 'apollo-server'
import { GraphQLScalarType, Kind } from 'graphql'
import depthLimit from 'graphql-depth-limit'
import AuthorsAPI from './services/authors.service'
import BooksAPI from './services/books.service'

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue (value) {
      return new Date(value) // value from the client
    },
    serialize (value) {
      return value.toLocaleString('pt-BR') // value sent to the client
    },
    parseLiteral (ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10) // ast value is always in string format
      }
      return null
    }
  }),

  Book: {
    author: (book, _, { dataSources }) => dataSources.authorsApi.retrieveOne(book.author)
  },

  Author: {
    fullname: author => `${author.name} ${author.lastname}`,

    books: (author, _, { dataSources }) => dataSources.booksApi.retrieveMany({ author: author._id })
  },

  Query: {
    books: (_, __, { dataSources }) => dataSources.booksApi.retrieveMany(), // parent, args, context, info

    book: (_, { id }, { dataSources }) => dataSources.booksApi.retrieveOne(id),

    authors: (_, __, { dataSources }) => dataSources.authorsApi.retrieveMany(),

    author: (_, { id }, { dataSources }) => dataSources.authorsApi.retrieveOne(id)
  }
}

const typeDefs = gql`
  scalar Date

  enum Category {
    SATIRE
    ROMANCE
    FICTION
    RELIGION
    BIOGRAPHY
    SCIFI
    FANTASY
  }

  type Book {
    _id: String
    title: String
    author: Author
    description: String
    createdAt: Date
    categories: [Category]
  }

  type Author {
    _id: String
    name: String
    lastname: String
    fullname: String
    abbreviation: String
    books: [Book]
  }

  type Query {
    books: [Book]
    book (id: String!): Book,
    authors: [Author],
    author (id: String!): Author
  }
`

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => {
    return {
      booksApi: new BooksAPI(),
      authorsApi: new AuthorsAPI()
    }
  },
  validationRules: [depthLimit(2)]
})

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})
