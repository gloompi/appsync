import { an_authenticated_user } from '../../steps/given'
import { a_user_calls_tweet } from '../../steps/when'
import { Chance } from 'chance'

const chance = Chance()

describe('Given an authenticated user', () => {
  let userA
  beforeAll(async () => {
    userA = await an_authenticated_user()
  })

  describe('When he sends a tweet', () => {
    let tweet
    const text = chance.string({ length: 16 })
    beforeAll(async () => {
      tweet = await a_user_calls_tweet(userA, text)
    })

    it('Should return the new tweet', () => {
      expect(tweet).toMatchObject({
        text,
        replies: 0,
        likes: 0,
        retweets: 0,
      })
    })
  })
})
