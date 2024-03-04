import {
  AdminConfirmSignUpCommand,
  CognitoIdentityProviderClient,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";

import { GraphQL } from '../lib/graphql'
import { handler as confirmUserSignUpHandler } from '../../functions/confirm-user-signup'
import { handler as getUploadUrlHandler } from '../../functions/get-upload-url'
import { handler as tweetHandler } from '../../functions/tweet'

export const we_invoke_confirmUserSignup = async (username, name, email) => {
  const context = {}
  const event = {
    "version": "1",
    "region": process.env.AWS_REGION,
    "userPoolId": process.env.COGNITO_USER_POOL_ID,
    "userName": username,
    "triggerSource": "PostConfirmation_ConfirmSignUp",
    "request": {
      "userAttributes": {
        "sub": username,
        "cognito:email_alias": email,
        "cognito:user_status": "CONFIRMED",
        "email_verified": "false",
        "name": name,
        "email": email
      }
    },
    "response": {}
  }

  await confirmUserSignUpHandler(event, context)
}

export const we_invoke_getImageUploadUrl = async (username, extension, contentType) => {
  const context = {}
  const event = {
    identity: {
      username
    },
    arguments: {
      extension,
      contentType
    }
  }

  return await getUploadUrlHandler(event, context)
}

export const we_invoke_tweet = async (username, text) => {
  const context = {}
  const event = {
    identity: {
      username
    },
    arguments: {
      text
    }
  }

  return await tweetHandler(event, context)
}

export const a_user_signs_up = async (password, name, email) => {
  const cognito = new CognitoIdentityProviderClient({});
  const userPoolId = process.env.COGNITO_USER_POOL_ID
  const clientId = process.env.WEB_COGNITO_USER_POOL_CLIENT_ID

  const signUpCommand = new SignUpCommand({
    ClientId: clientId,
    Username: email,
    Password: password,
    UserAttributes: [
      { Name: 'name', Value: name }
    ]
  });

  const signUpResp = await cognito.send(signUpCommand)

  const username = signUpResp.UserSub
  console.log(`[${email}] - user has signed up [${username}]`)

  const confirmCommand = new AdminConfirmSignUpCommand({
    UserPoolId: userPoolId,
    Username: username,
  });

  await cognito.send(confirmCommand)

  console.log(`[${email}] - confirmed sign up`)

  return {
    username,
    name,
    email
  }
}

export const a_user_calls_getMyProfile = async (user) => {
  const getMyProfile = `query getMyProfile {
    getMyProfile {
      name
      id
      createdAt
      bio
      backgroundImageUrl
      birthdate
      followersCount
      followingCount
      screenName
      location
      likesCount
      imageUrl
      tweetsCount
      website
    }
  }`

  const data = await GraphQL(process.env.API_URL, getMyProfile, {}, user.accessToken)
  const profile = data.getMyProfile

  console.log(`[${user.username}] - fetched profile`)

  return profile
}

export const a_user_calls_editMyProfile = async (user, input) => {
  const editMyProfile = `mutation editMyProfile($input: ProfileInput!) {
    editMyProfile(newProfile: $input) {
      name
      id
      createdAt
      bio
      backgroundImageUrl
      birthdate
      followersCount
      followingCount
      screenName
      location
      likesCount
      imageUrl
      tweetsCount
      website
    }
  }`
  const variables = {
    input
  }

  const data = await GraphQL(process.env.API_URL, editMyProfile, variables, user.accessToken)
  const profile = data.editMyProfile

  console.log(`[${user.username}] - edited profile`)

  return profile
}

export const a_user_calls_getImageUploadUrl = async (user, extension, contentType) => {
  const getImageUploadUrl = `query getImageUploadUrl($extension: String, $contentType: String) {
    getImageUploadUrl(extension: $extension, contentType: $contentType)
  }`
  const variables = {
    extension,
    contentType
  }

  const data = await GraphQL(process.env.API_URL, getImageUploadUrl, variables, user.accessToken)
  const url = data.getImageUploadUrl

  console.log(`[${user.username}] - got image upload url`)

  return url
}

export const a_user_calls_tweet = async (user, text) => {
  const tweet = `mutation tweet($text: String!) {
    tweet(text: $text) {
      id
      createdAt
      text
      replies
      likes
      retweets
    }
  }`
  const variables = {
    text
  }

  const data = await GraphQL(process.env.API_URL, tweet, variables, user.accessToken)
  const newTweet = data.tweet

  console.log(`[${user.username}] - posted new tweet`)

  return newTweet
}
