import { ApolloServer, gql } from 'apollo-server'
import { GraphQLScalarType, Kind } from 'graphql'

const books = [
  {
    id: 1,
    title: 'O Senhor dos Anéis - A sociedade do Anel',
    author: 1,
    description: 'A Sociedade do Anel O volume inicial de O Senhor dos Anéis, lançado originalmente em julho de 1954, foi o primeiro grande épico de fantasia moderno, conquistando milhões de leitores e se tornando o padrão de referência para todas as outras obras do gênero até hoje. A imaginação prodigiosa de J.R.R. Tolkien e seu conhecimento profundo das antigas mitologias da Europa permitiram que ele criasse um universo tão complexo e convincente quanto o mundo real. A Sociedade do Anel começa no Condado, a região rural do oeste da Terra-média onde vivem os diminutos e pacatos hobbits. Bilbo Bolseiro, um dos raros aventureiros desse povo, cujas peripécias foram contadas em O Hobbit, resolve ir embora do Condado e deixa sua considerável herança nas mãos de seu jovem parente Frodo. O mais importante legado de Bilbo é o anel mágico que costumava usar para se tornar invisível. No entanto, o mago Gandalf, companheiro de aventuras do velho hobbit, revela a Frodo que o objeto é o Um Anel, a raiz do poder demoníaco de Sauron, o Senhor Sombrio, que deseja escravizar todos os povos da Terra-média. A única maneira de eliminar a ameaça de Sauron é destruir o Um Anel nas entranhas da própria montanha de fogo onde foi forjado. A revelação faz com que Frodo e seus companheiros hobbits Sam, Merry e Pippin deixem a segurança do Condado e iniciem uma perigosa jornada rumo ao leste. Ao lado de representantes dos outros Povos Livres que resistem ao Senhor Sombrio, eles formam a Sociedade do Anel. Alguém uma vez disse que o mundo dos leitores de língua inglesa se divide entre os que já leram O Senhor dos Anéis e os que um dia lerão o livro. Com esta nova tradução da obra, o fascínio dessa aventura atemporal ficará ainda mais evidente para os leitores brasileiros, tanto os que já conhecem a saga como os que estão prestes a descobrir seu encanto.',
    createdAt: new Date(),
    categories: ['FANTASY']
  },

  {
    id: 2,
    title: 'Jurassik Park',
    author: 3,
    description: 'Uma impressionante técnica de recuperação e clonagem de DNA de seres pré-históricos foi descoberta. Finalmente, uma das maiores fantasias da mente humana, algo que parecia impossível, tornou-se realidade. Agora, criaturas extintas há eras podem ser vistas de perto, para o fascínio e o encantamento do público. Até que algo sai do controle. Em Jurassic Park, escrito em 1990 por Michael Crichton, questões de bioética e a teoria do caos funcionam como pano de fundo para uma trama de aventura e luta pela sobrevivência. O livro inspirou o filme homônimo de 1993, dirigido por Steven Spielberg, uma das maiores bilheterias do cinema de todos os tempos.',
    createdAt: 123, // Data convertida pra String pelo tipo Scalar.
    categories: ['SCIFI']
  },

  {
    id: 3,
    title: 'Cartas de um diabo a seu aprendiz',
    author: 2,
    description: 'Irônica, astuta, irreverente. Assim pode ser descrita esta obra-prima de C.S. Lewis, dedicada a seu amigo J.R.R. Tolkien. Um clássico da literatura cristã, este retrato satírico da vida humana, feito pelo ponto de vista do diabo, tem divertido milhões de leitores desde sua primeira publicação, na década de 1940; agora com novo projeto gráfico e tradução atual.Cartas de um diabo a seu aprendiz é a correspondência ao mesmo tempo cômica, séria e original entre um diabo e seu sobrinho aprendiz. Revelando uma personalidade mais espirituosa, Lewis apresenta nesta obra a mais envolvente narrativa já escrita sobre tentações ― e a superação delas.',
    createdAt: new Date(),
    categories: [
      'SATIRE',
      'ROMANCE',
      'FICTION',
      'RELIGION'
    ]

  }
]

const authors = [
  {
    id: 1,
    name: 'John',
    lastname: 'Ronald Reuel Tolkien',
    abbreviation: 'J.R.R Tolkien'
  },

  {
    id: 2,
    name: 'Clive',
    lastname: 'Staples Lewis',
    abbreviation: 'C.S Lewis'
  },

  {
    id: 3,
    name: 'John',
    lastname: 'Michael Crichton',
    abbreviation: 'Michael Crichton'
  }
]

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
    author: book => authors.find(author => book.author === author.id)
  },

  Author: {
    fullname: author => `${author.name} ${author.lastname}`,
    books: author => books.filter(book => book.author === author.id)
  },

  Query: {
    books: () => books,
    book: (_, args) => books.find(book => book.id === args.id),
    authors: () => authors,
    author: (_, args) => authors.find(author => author.id === args.id)
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
    title: String
    author: Author
    description: String
    createdAt: Date
    categories: [Category]
  }

  type Author {
    name: String
    lastname: String
    fullname: String
    abbreviation: String
    books: [Book]
  }

  type Query {
    books: [Book]
    book (id: Int!): Book,
    authors: [Author],
    author (id: Int!): Author
  }
`

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers
})

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})
