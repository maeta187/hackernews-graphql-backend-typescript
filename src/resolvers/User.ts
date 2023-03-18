import { MyContext, UserType } from '../types/index.js'

function links(parent: UserType, _: undefined, context: MyContext) {
  return context.prisma.user
    .findUnique({
      where: { id: parent.id }
    })
    .links()
}

export default { links }
