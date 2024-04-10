import Post from '../models/Post.js'
import { GraphQLError } from 'graphql'
import Joi from 'joi'
import idSchema from '../schemas/idSchema.js'
import client from '../db/redis.client.js'

async function updatePost (__, args, { user }) {
  const schema = Joi.object().keys({
    id: idSchema,
    title: Joi.string().min(10).max(250).optional().empty(null),
    description: Joi.string().min(10).optional().empty(null),
    tags: Joi.array().items(Joi.string().min(3).max(30)).optional().empty(null),
    category: Joi.string()
      .valid('UNIVERSITY', 'HIGH_SCHOOL', 'AUTODIDACT')
      .optional()
      .empty(null)
  })

  const {
    error,
    value: { id, ...update }
  } = schema.validate(args)

  if (error) {
    throw new GraphQLError(error.message, {
      extensions: {
        code: 'BAD_USER_INPUT',
        details: error.details,
        http: { status: 400 }
      }
    })
  }

  let post = await Post.findOneAndUpdate({ _id: id, userId: user._id }, update)

  if (!post) return null

  post = JSON.stringify({ ...post._doc, ...update })

  await client.del(`posts:${id}`)

  await client.set(`posts:${id}`, post, {
    EX: process.env.POST_REDIS_EXP
      ? Number(process.env.POST_REDIS_EXP)
      : 60 * 60 * 24,
    NX: true
  })

  return JSON.parse(post)
}

export default updatePost
