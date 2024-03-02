import { Chance } from 'chance'
import { a_random_user } from '../../steps/given'
import { we_invoke_confirmUserSignup } from '../../steps/when'
import { user_exists_in_UsersTable } from '../../steps/then'

const chance = new Chance()

describe('When confirmUserSignup runs', () => {
  it("The user's profile should be saved in DynamoDB", async () => {
    const { name, email } = a_random_user()
    const username = chance.guid()

    await we_invoke_confirmUserSignup(username, name, email)

    const ddbUser = await user_exists_in_UsersTable(username)
    expect(ddbUser).toMatchObject({
      id: username,
      name,
      createdAt: expect.stringMatching(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(?:\.\d+)?Z?/g),
      followersCount: 0,
      followingCount: 0,
      tweetsCount: 0,
      likesCount: 0
    })

    const [firstName, lastName] = name.split(' ')
    expect(ddbUser.screenName).toContain(firstName)
    expect(ddbUser.screenName).toContain(lastName)
  })
})