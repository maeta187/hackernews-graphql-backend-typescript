import { MySubscribeContext, LinkType, VoteType } from '../types/index.js'

function newLinkSubscribe(_: any, __: any, context: MySubscribeContext) {
  return context.pubsub.asyncIterator('NEW_LINK')
}

const newLink = {
  subscribe: newLinkSubscribe,
  resolve: (payload: LinkType) => {
    return payload
  }
}

function newVoteSubscribe(_: any, __: any, context: MySubscribeContext) {
  return context.pubsub.asyncIterator('NEW_VOTE')
}

const newVote = {
  subscribe: newVoteSubscribe,
  resolve: (payload: VoteType) => {
    return payload
  }
}

export default { newLink, newVote }
