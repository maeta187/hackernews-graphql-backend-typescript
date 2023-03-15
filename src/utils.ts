import jwt from 'jsonwebtoken'
import { IncomingMessage } from 'http'

const APP_SECRET = 'Graphql-is-aw3some'

// ユーザーIDを取得する関数
// TODO:本来第二引数にauthTokenを引き取るがどこから渡されているのか不明なので確認する
function getUserId(req: IncomingMessage) {
  if (req) {
    // ヘッダーを確認(認証権限を確認)
    const authHeader = req.headers.authorization
    // 権限があるなら
    if (authHeader) {
      const token = authHeader.replace('Bearer', '')
      if (!token) {
        throw new Error('トークンが見つかりませんでした。')
      }
      // トークンを複合する
      const userId = getTokenPayload(token)
      return userId
    }
  }
}

// トークンを複合する関数
function getTokenPayload(token: string) {
  // トークン化された物の前の情報(user.id)を複合する
  return jwt.verify(token, APP_SECRET)
}

export { getUserId }
