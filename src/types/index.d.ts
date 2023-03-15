import { PrismaClient } from '@prisma/client'
import { type } from 'os'
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
