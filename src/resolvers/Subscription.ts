import { MySubscribeContext, LinkType } from '../types/index.js'

function newLinkSubscribe(_: any, __: any, context: MySubscribeContext) {
  return context.pubsub.asyncIterator('NEW_LINK')
}

const newLink = {
  subscribe: newLinkSubscribe,
  resolve: (payload: LinkType) => {
    return payload
  }
}

export default { newLink }
