import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { MyContext, SignupType, LoginType, PostType } from '../types/index.js'

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

// ユーザーログイン
async function login(args: LoginType, context: MyContext) {
  const user = await context.prisma.user.findUnique({
    where: { email: args.email }
  })
  if (!user) {
    throw new Error('ユーザーが見つかりませんでした。')
  }

  // パスワードの比較
  const valid = await bcrypt.compare(args.password, user.password)
  if (!valid) {
    throw new Error('無効なパスワードです。')
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  return {
    token,
    user
  }
}

// ニュースの投稿
async function post(_: undefined, args: PostType, context: MyContext) {
  const { userId } = context
  if (!userId) {
    throw new Error('ユーザー情報が取得できませんでした')
  }
  const newLink = await context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedBy: { connect: { id: Number(userId) } }
    }
  })

  return newLink
}

export { signup, login, post }
