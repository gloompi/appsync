const we_invoke_confirmUserSignup = async (username, name, email) => {
  const handler = require('../../functions/confirm-user-signup').handler

  const context = {}
  const event = {
    version: "1",
    region: "",
    userPoolId: "",
    userName: username,
    triggerSource: "PostConfirmation_ConfirmSignUp",
    request: {
      userAttributes: {
        sub: username,
        "cognito:email_alias": email,
        "cognito:user_status": "CONFIRMED",
        "email_verified": "false",
        name,
        email
      }
    },
    response: {}
  }

  await handler()
}

module.exports = {
  we_invoke_confirmUserSignup
}