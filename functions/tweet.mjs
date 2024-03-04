import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, TransactWriteCommand } from "@aws-sdk/lib-dynamodb";
import { ulid } from "ulid";

import { TweetTypes } from '../lib/constants.mjs'

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const { USERS_TABLE, TWEETS_TABLE, TIMELINES_TABLE } =
  process.env;

export const handler = async (event) => {
  const { text } = event.arguments
  const { username } = event.identity
  const id = ulid()
  const timestamp = new Date().toJSON()

  const newTweet = {
    __typename: TweetTypes.TWEET,
    id,
    text,
    creator: username,
    createdAt: timestamp,
    replies: 0,
    likes: 0,
    retweets: 0
  }

  const command = new TransactWriteCommand({
    TransactItems: [
      {
        Put: {
          TableName: TWEETS_TABLE,
          Item: newTweet,
        },
      },
      {
        Put: {
          TableName: TIMELINES_TABLE,
          Item: {
            userId: username,
            tweetId: id,
            timestamp,
          },
        },
      },
      {
        Update: {
          TableName: USERS_TABLE,
          Key: {
            id: username,
          },
          UpdateExpression: "ADD tweetsCount :one",
          ExpressionAttributeValues: {
            ":one": 1,
          },
          ConditionExpression: "attribute_exists(id)",
        },
      },
    ],
  })

  await docClient.send(command)

  return newTweet
};
