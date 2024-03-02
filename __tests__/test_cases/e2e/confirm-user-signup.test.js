import { a_random_user } from '../../steps/given'
import { a_user_signs_up } from '../../steps/when'
import { user_exists_in_UsersTable } from '../../steps/then'

describe('When a user signs up', () => {
  it("The user's profile should be saved in DynamoDB", async () => {
    const { password, name, email } = a_random_user()

    const user = await a_user_signs_up(password, name, email)

    const ddbUser = await user_exists_in_UsersTable(user.username)
    expect(ddbUser).toMatchObject({
      id: user.username,
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