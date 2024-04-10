import client from '../db/redis.client.js'
import Post from '../models/Post.js'
import { GraphQLError } from 'graphql'
import Joi from 'joi'

async function createPost (__, { title = '', description = '', tags = [], category = '' }, context) {
  const schema = Joi.object().keys({
    title: Joi.string().min(10).max(250),
    description: Joi.string().min(10),
    tags: Joi.array().items(Joi.string().min(3).max(30)),
    category: Joi.string().valid('UNIVERSITY', 'HIGH_SCHOOL', 'AUTODIDACT')
  })

  const { error, value } = schema.validate({ title, description, tags, category })

  if (error) {
    throw new GraphQLError(error.message, {
      extensions: {
        code: 'BAD_USER_INPUT',
        details: error.details,
        http: { status: 400 }
      }
    })
  }

  let post = new Post({ ...value, userId: context.user._id })

  await post.save()

  post = JSON.stringify(post)

  return JSON.parse(post)
}

export default createPost
