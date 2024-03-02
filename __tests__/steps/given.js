import {
  AdminConfirmSignUpCommand,
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { Chance } from 'chance'

const chance = new Chance()

export const a_random_user = () => {
  const firstName = chance.first({ nationality: 'en' })
  const lastName = chance.first({ nationality: 'en' })
  const suffix = chance.string({ length: 4, pool: 'abcdefghijklmnopqrstuvwxyz' })
  const name = `${firstName} ${lastName} ${suffix}`
  const password = chance.string({ length: 8 })
  const email = `${firstName}-${lastName}-${suffix}@aws-appsync.com`

  return {
    name,
    password,
    email,
  }
}

export const an_authenticated_user = async () => {
  const { name, email, password } = a_random_user()

  const cognito = new CognitoIdentityProviderClient()

  const userPoolId = process.env.COGNITO_USER_POOL_ID
  const clientId = process.env.WEB_COGNITO_USER_POOL_CLIENT_ID

  const signUpCommand = new SignUpCommand({
    ClientId: clientId,
    Username: email,
    Password: password,
    UserAttributes: [
      { Name: 'name', Value: name }
    ]
  })

  const signUpResp = await cognito.send(signUpCommand)

  const username = signUpResp.UserSub
  console.log(`[${email}] - user has signed up [${username}]`)

  const confirmCommand = new AdminConfirmSignUpCommand({
    UserPoolId: userPoolId,
    Username: username,
  });

  await cognito.send(confirmCommand)

  console.log(`[${email}] - confirmed sign up`)

  const authCommand = new InitiateAuthCommand({
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: clientId,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password
    }
  })

  const auth = await cognito.send(authCommand)

  console.log(`[${email}] - signed in`)

  return {
    username,
    name,
    email,
    idToken: auth.AuthenticationResult.IdToken,
    accessToken: auth.AuthenticationResult.AccessToken
  }
}
