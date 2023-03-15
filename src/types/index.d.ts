import { PrismaClient } from '@prisma/client'
import { type } from 'os'

export interface MyContext {
  // Context typing
  prisma: PrismaClient
}

export type SignupType = {
  email: string
  password: string
  name: string
}

export type LoginType = Omit<SignupType, 'name'>

