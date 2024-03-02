import {
  AdminConfirmSignUpCommand,
  CognitoIdentityProviderClient,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";

import { handler } from '../../functions/confirm-user-signup'

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

  await handler(event, context)
}


