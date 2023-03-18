import fs from 'fs'
import path from 'path'
import Query from './resolvers/Query.js'
import Mutation from './resolvers/Mutation.js'
import Link from './resolvers/Link.js'
import User from './resolvers/User.js'
import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { fileURLToPath } from 'url'
import { PrismaClient } from '@prisma/client'
import { getUserId } from './utils.js'
import { MyContext } from './types/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const prisma = new PrismaClient()

const resolvers = { Query, Mutation, Link, User }

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer<MyContext>({
  typeDefs: fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf-8'),
  resolvers
})

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => ({
    ...req,
    prisma,
    userId: req && req.headers.authorization ? getUserId(req) : undefined
  })
})

console.log(`🚀  Server ready at: ${url}`)
