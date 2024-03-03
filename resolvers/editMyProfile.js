import { util } from '@aws-appsync/utils';

export function request(ctx) {
  return {
    operation : "UpdateItem",
    key: util.dynamodb.toMapValues({ id: ctx.identity.username }),
    update: {
      expression : "set #name = :name, imageUrl = :imageUrl, backgroundImageUrl = :backgroundImageUrl, bio = :bio, #location = :location, website = :website, birthdate = :birthdate",
      expressionNames : {
        "#name" : "name",
        "#location" : "location"
      },
      expressionValues : util.dynamodb.toMapValues({
        ":name" : ctx.arguments.newProfile.name,
        ":imageUrl" : ctx.arguments.newProfile.imageUrl,
        ":backgroundImageUrl" : ctx.arguments.newProfile.backgroundImageUrl,
        ":bio" : ctx.arguments.newProfile.bio,
        ":location" : ctx.arguments.newProfile.location,
        ":website" : ctx.arguments.newProfile.website,
        ":birthdate" : ctx.arguments.newProfile.birthdate
      })
    },
    condition: {
      expression : "attribute_exists(id)",
    },
  };
}

export function response(ctx) {
  return ctx.result
}