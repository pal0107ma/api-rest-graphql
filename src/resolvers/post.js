import client from '../db/redis.client.js'
import Post from '../models/Post.js'
import { GraphQLError } from 'graphql'
import idSchema from '../schemas/idSchema.js'

async function post (__, { id }) {
  // VALIDATE ID ARGUMENT
  const { error } = idSchema.validate(id || '')

  if (error) {
    throw new GraphQLError(error.message, {
      extensions: {
        code: 'BAD_USER_INPUT',
        details: error.details,
        http: { status: 400 }
      }
    })
  }

  let post = await client.get(`posts:${id}`)

  if (post) return JSON.parse(post)

  post = await Post.findById(id)

  if (!post) return null

  post = JSON.stringify(post)

  await client.set(`posts:${id}`, post, {
    EX: process.env.POST_REDIS_EXP
      ? Number(process.env.POST_REDIS_EXP)
      : 60 * 60 * 24,
    NX: true
  })

  return JSON.parse(post)
}

export default post
