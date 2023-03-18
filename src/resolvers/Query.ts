import { MyContext } from '../types/index.js'

function feed(_: undefined, __: undefined, context: MyContext) {
  return context.prisma.link.findMany()
}

export default { feed }
