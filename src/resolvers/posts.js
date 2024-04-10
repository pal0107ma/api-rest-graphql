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

  if (q) {
    const regex = new RegExp(q, 'i')

    const posts = await Post.find({
      $or: [
        { title: regex },
        { description: regex },
        { tags: { $in: [regex] } }
      ],
      $and
    })
      .limit(count)
      .sort({ createdAt: -1 })

    return JSON.parse(JSON.stringify(posts))
  }

  const posts = await Post.find({
    $and
  })
    .limit(count)
    .sort({ createdAt: -1 })

  return JSON.parse(JSON.stringify(posts))
}

export default posts
