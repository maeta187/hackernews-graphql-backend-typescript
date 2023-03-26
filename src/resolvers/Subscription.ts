import { MyContext, LinkType } from '../types/index.js'

function newLinkSubscribe(_: undefined, __: undefined, context: MyContext) {
  return context.pubsub.asyncIterator('NEW_LINK')
}

const newLink = {
  subscribe: newLinkSubscribe,
  resolve: (payload: LinkType) => {
    return payload
  }
}

export default { newLink }
