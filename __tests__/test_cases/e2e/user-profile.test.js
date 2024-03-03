import { Chance } from 'chance'
import { fileURLToPath } from 'url';
import path from 'path';

import { an_authenticated_user } from '../../steps/given'
import { a_user_calls_getMyProfile, a_user_calls_editMyProfile, a_user_calls_getImageUploadUrl } from '../../steps/when'
import { user_can_upload_image_to_url, user_can_download_image_from } from '../../steps/then'

const chance = Chance()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 

describe('Given an authenticated user', () => {
  let user, profile
  beforeAll(async () => {
    user = await an_authenticated_user()
  })

  it('The user can fetch his profile with getMyProfile', async () => {
    profile = await a_user_calls_getMyProfile(user)

    expect(profile).toMatchObject({
      id: user.username,
      name: user.name,
      imageUrl: null,
      backgroundImageUrl: null,
      bio: null,
      location: null,
      website: null,
      birthdate: null,
      createdAt: expect.stringMatching(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(?:\.\d+)?Z?/g),
      // tweets
      followersCount: 0,
      followingCount: 0,
      tweetsCount: 0,
      likesCount: 0,
    })

    const [firstName, lastName] = profile.name.split(' ')
    expect(profile.screenName).toContain(firstName)
    expect(profile.screenName).toContain(lastName)
  })

  it('The user can get an URL to upload new profile image', async () => {
    const uploadUrl = await a_user_calls_getImageUploadUrl(user, '.png', 'image/png')

    const bucketName = process.env.BUCKET_NAME
    const regex = new RegExp(`https://${bucketName}.s3-accelerate.amazonaws.com/${user.username}/.*\.png\?.*`)
    expect(uploadUrl).toMatch(regex)

    const filePath = path.join(__dirname, '../../data/logo.png')
    await user_can_upload_image_to_url(uploadUrl, filePath, 'image/png')

    const downloadUrl = uploadUrl.split('?')[0]
    await user_can_download_image_from(downloadUrl)
  })

  it('The user can edit his profile with editMyProfile', async () => {
    const newName = chance.first()
    const input = {
      name: newName
    }
    const newProfile = await a_user_calls_editMyProfile(user, input)

    expect(newProfile).toMatchObject({
      ...profile,
      name: newName
    })
  })
})