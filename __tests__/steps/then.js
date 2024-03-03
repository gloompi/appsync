import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb'
import fs from 'fs'
import axios from 'axios'

const client = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(client)

export const user_exists_in_UsersTable = async (id) => {
  const command = new GetCommand({
    TableName: process.env.USERS_TABLE,
    Key: {
      id,
    },
  })
  console.log(`looking for user [${id}] in table [${process.env.USERS_TABLE}]`)

  const response = await docClient.send(command)

  expect(response.Item).toBeTruthy()

  return response.Item
}

export const user_can_upload_image_to_url = async (url, filepath, contentType) => {
  const data = fs.readFileSync(filepath)
  await axios({
    method: 'put',
    url,
    headers: {
      'Content-Type': contentType
    },
    data
  })
}

export const user_can_download_image_from = async (url) => {
  const resp = await axios(url)

  console.log('downloaded image from', url)

  return resp.data
}
