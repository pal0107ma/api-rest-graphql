import client from '../../db/redis.client.js'
import User from '../../models/User.js'
import { GraphQLError } from 'graphql'
import idSchema from '../../schemas/idSchema.js'

async function deleteUserSkill (__, { id }, context) {
  const { error } = idSchema.validate(id)

  if (error) {
    throw new GraphQLError(error.message, {
      extensions: {
        code: 'BAD_USER_INPUT',
        details: error.details,
        http: { status: 400 }
      }
    })
  }

  let user = await User.findById(context.user._id)

  if (!user) {
    return null
  }

  user.skills.pull(id)

  await user.save()

  user = JSON.stringify(user)

  // UPDATE IN REDIS
  await client.del(`users:${context.user._id}`)

  await client.set(`users:${context.user._id}`, user, {
    EX: process.env.USER_REDIS_EXP
      ? Number(process.env.USER_REDIS_EXP)
      : 60 * 60 * 24,
    NX: true
  })

  // SEND USER DATA
  return JSON.parse(user)
}

export default deleteUserSkill
