import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {
  MyContext,
  SignupType,
  LoginType,
  PostType,
  VoteArgsType
} from '../types/index.js'
import { APP_SECRET } from '../utils.js'

//ユーザー新規登録リゾルバ
async function signup(_: undefined, args: SignupType, context: MyContext) {
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
async function login(_: undefined, args: LoginType, context: MyContext) {
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
  const userIdObj = context.userId

  if (!userIdObj || typeof userIdObj === 'string') {
    throw new Error('ユーザー情報が取得できませんでした')
  }
  const { userId } = userIdObj
  const newLink = await context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedBy: { connect: { id: Number(userId) } }
    }
  })

  // 送信
  context.pubsub.publish('NEW_LINK', newLink)

  return newLink
}

async function vote(_: undefined, args: VoteArgsType, context: MyContext) {
  const userIdObj = context.userId
  if (!userIdObj || typeof userIdObj === 'string') {
    throw new Error('ユーザー情報が取得できませんでした')
  }
  const { userId } = userIdObj

  const vote = await context.prisma.vote.findUnique({
    where: {
      linkId_userId: {
        linkId: Number(args.linkId),
        userId: Number(userId)
      }
    }
  })

  // 2回投票を防ぐ
  if (Boolean(vote)) {
    throw new Error(`すでにその投稿には投票されています:${args.linkId}`)
  }

  // 投票する
  const newVote = await context.prisma.vote.create({
    data: {
      user: { connect: { id: userId } },
      link: { connect: { id: Number(args.linkId) } }
    }
  })

  context.pubsub.publish('NEW_VOTE', newVote)

  return newVote
}

export default { signup, login, post, vote }
