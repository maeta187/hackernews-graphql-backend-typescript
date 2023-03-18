import { MyContext, LinkType } from '../types/index.js'

// 誰によって投稿されたのかのリゾルバ
function postedBy(parent: LinkType, _: undefined, context: MyContext) {
  return context.prisma.link
    .findUnique({
      where: { id: parent.id }
    })
    .postedBy()
}

export default { postedBy }
