import { MyContext, LinkType, UserType, VoteArgsType } from '../types/index.js'

function link(parent: LinkType, __: undefined, context: MyContext) {
  return context.prisma.vote
    .findUnique({
      where: { id: parent.id }
    })
    .link()
}

function user(parent: UserType, __: undefined, context: MyContext) {
  return context.prisma.vote
    .findUnique({
      where: { id: parent.id }
    })
    .user()
}

export default { link, user }
