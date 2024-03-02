import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb'

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

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
