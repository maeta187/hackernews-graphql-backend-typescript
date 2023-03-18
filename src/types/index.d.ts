import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

export interface MyContext {
  // Context typing
  prisma: PrismaClient
  userId: string | jwt.JwtPayload | null | undefined
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
