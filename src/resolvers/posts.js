import Post from '../models/Post.js'
import { GraphQLError } from 'graphql'
import Joi from 'joi'

async function posts (__, args) {
  const schema = Joi.object().keys({
    count: Joi.number().optional().empty(null).min(5).max(100),
    after: Joi.number().optional().empty(null),
    category: Joi.string()
      .valid('UNIVERSITY', 'AUTODIDACT', 'HIGH_SCHOOL')
      .optional()
      .empty(null),
    q: Joi.string().optional().empty('').trim()
  })

  const {
    error,
    value: { q = '', after = Date.now() / 1000, count = 20, category = '' }
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

  const $and = [{ createdAt: { $lt: after * 1000 } }]

  if (category) $and.push({ category })

  let posts

  if (q) {
    const regex = new RegExp(q, 'i')

    posts = await Post.find({
      $or: [
        { title: regex },
        { description: regex },
        { tags: { $in: [regex] } }
      ],
      $and
    })
      .limit(count + 1)
      .sort({ createdAt: -1 })
  }

  if (!posts) {
    posts = await Post.find({
      $and
    })
      .limit(count + 1)
      .sort({ createdAt: -1 })
  }

  const data = {
    cursors: {
      after: null
    }
  }

  if (posts.length === count + 1) {
    posts.pop()
    data.cursors.after = posts[count - 1].createdAt.getTime() / 1000
  }

  data.posts = JSON.parse(JSON.stringify(posts))
  return data
}

export default posts
