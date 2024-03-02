import { Chance } from 'chance'
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const chance = new Chance()
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const { USERS_TABLE } = process.env

export const handler = async (event) => {
  if (event.triggerSource === 'PostConfirmation_ConfirmSignUp') {
    const name = event.request.userAttributes['name']
    const suffix = chance.string({ length: 8, casing: 'upper', alpha: true, numeric: true })
    const screenName = `${name.replace(/[^a-zA-Z0-9]/g, "")}${suffix}`
    const user = {
      id: event.userName,
      createdAt: new Date().toJSON(),
      followersCount: 0,
      followingCount: 0,
      tweetsCount: 0,
      likesCount: 0,
      name,
      screenName,
    }

    const command = new PutCommand({
      TableName: USERS_TABLE,
      Item: user,
      ConditionExpression: 'attribute_not_exists(id)'
    });

    await docClient.send(command);

    return event
  } else {
    return event
  }
};
