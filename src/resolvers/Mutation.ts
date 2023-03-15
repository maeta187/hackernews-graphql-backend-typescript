import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { MyContext, SignupType } from '../types/index.js'

const APP_SECRET = 'Graphql'

//ユーザー新規登録リゾルバ
async function signup(args: SignupType, context: MyContext) {
  const password = await bcrypt.hash(args.password, 10)

  // ユーザー新規作成
  const user = await context.prisma.user.create({
    data: {
      ...args,
      password
    }
  })
  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  return {
    token,
    user
  }
}

export { signup }
