import fs from 'fs'
import path from 'path'
import cors from 'cors'
import bodyParser from 'body-parser'
import { WebSocketServer } from 'ws'
import { createServer } from 'http'
import { fileURLToPath } from 'url'
import express from 'express'
import Query from './resolvers/Query.js'
import Mutation from './resolvers/Mutation.js'
import Subscription from './resolvers/Subscription.js'
import Link from './resolvers/Link.js'
import User from './resolvers/User.js'
import Vote from './resolvers/Vote.js'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { PubSub } from 'graphql-subscriptions'
import { useServer } from 'graphql-ws/lib/use/ws'
import { PrismaClient } from '@prisma/client'
import { getUserId } from './utils.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const prisma = new PrismaClient()
const app = express()
const httpServer = createServer(app)

const typeDefs = fs.readFileSync(
  path.join(__dirname, 'schema.graphql'),
  'utf-8'
)
const resolvers = { Query, Mutation, Subscription, Link, User, Vote }
const pubsub = new PubSub()

const schema = makeExecutableSchema({ typeDefs, resolvers })

// Creating the WebSocket server
const wsServer = new WebSocketServer({
  // This is the `httpServer` we created in a previous step.
  server: httpServer,
  // Pass a different path here if app.use
  // serves expressMiddleware at a different path
  path: '/graphql'
})

// Hand in the schema we just created and have the
// WebSocketServer start listening.
const serverCleanup = useServer(
  {
    // Our GraphQL schema.
    schema,
    // Adding a context property lets you add data to your GraphQL operation contextValue
    context: async (ctx, msg, args) => {
      // You can define your own function for setting a dynamic context
      // or provide a static value
      return { pubsub, prisma }
    }
  },
  wsServer
)

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  schema,
  plugins: [
    // Proper shutdown for the HTTP server.
    ApolloServerPluginDrainHttpServer({ httpServer }),

    // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose()
          }
        }
      }
    }
  ]
})

await server.start()
app.use(
  '/graphql',
  cors<cors.CorsRequest>(),
  bodyParser.json(),
  expressMiddleware(server, {
    context: async ({ req }) => ({
      ...req,
      prisma,
      pubsub,
      userId: req && req.headers.authorization ? getUserId(req) : undefined
    })
  })
)

const PORT = 4000
// Now that our HTTP server is fully set up, we can listen to it.
httpServer.listen(PORT, () => {
  console.log(`Server is now running on http://localhost:${PORT}/graphql`)
})
