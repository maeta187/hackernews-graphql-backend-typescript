import { PrismaClient } from '@prisma/client'
import { PubSub } from 'graphql-subscriptions'
import jwt from 'jsonwebtoken'

export interface MyContext {
  // Context typing
  prisma: PrismaClient
  pubsub: PubSub
  userId: string | jwt.JwtPayload | null | undefined
}

export interface MySubscribeContext {
  // Context typing
  pubsub: PubSub
}

export type SignupType = {
  email: string
  password: string
  name: string
}

export type LoginType = Omit<SignupType, 'name'>

export type PostType = {
  url: string
  description: string
}

export type LinkType = {
  id: number
  description: string
  url: string
  postedBy: UserType
}

export type UserType = {
  id: number
  name: string
  email: string
  links: [LinkType]
}

export type VoteType = {
  id: number
  links: [LinkType]
  users: [User]
}

