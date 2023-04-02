import { MyContext, LinkType, VoteArgsType } from '../types/index.js'

// 誰によって投稿されたのかのリゾルバ
function postedBy(parent: LinkType, _: undefined, context: MyContext) {
  return context.prisma.link
    .findUnique({
      where: { id: parent.id }
    })
    .postedBy()
}

function votes(parent: VoteArgsType, __: undefined, context: MyContext) {
  return context.prisma.link
    .findUnique({
      where: { id: Number(parent.linkId) }
    })
    .votes()
}

export default { postedBy, votes }
