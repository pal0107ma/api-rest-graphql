import client from '../db/redis.client.js'
import User from '../models/User.js'
import { GraphQLError } from 'graphql'
import Joi from 'joi'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'

async function updateUser (__, args, context) {
  const schema = Joi.object({
    username: Joi.string().alphanum().min(3).max(15).optional().empty(null).trim(),

    firstName: Joi.string()
      .min(3)
      .max(30)
      .regex(/^[A-Z]+$/i).optional().empty(null),

    lastName: Joi.string()
      .min(3)
      .max(30)
      .regex(/^[A-Z]+$/i).optional().empty(null),

    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] }
    }).optional().empty(null),

    role: Joi.string().valid('STUDENT', 'TEACHER').optional().empty(null),

    security: Joi.string().when('email', {
      is: Joi.any().valid(null),
      then: Joi.optional().empty(null),
      otherwise: Joi.required()
    }).when('password', {
      is: Joi.any().valid(null),
      then: Joi.optional().empty(null),
      otherwise: Joi.required()
    }),

    password: Joi.string().pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/).optional().empty(null)
  })

  const { error, value: { email, username, security, password, ...update } } = schema.validate(args)

  if (error) {
    throw new GraphQLError(error.message, {
      extensions: {
        code: 'BAD_USER_INPUT',
        details: error.details,
        http: { status: 400 }
      }
    })
  }

  // VERIFY IF EMAIL ALREADY IN USE
  if (email && email !== context.user.email) {
    const user = await User.findOne({ email })

    if (user) {
      throw new GraphQLError('email already in use', {
        extensions: {
          code: 'BAD_USER_INPUT',
          http: { status: 409 }
        }
      })
    }
  }

  // VERIFY IF USERNAME ALREADY IN USE
  if (username && username !== context.user.username) {
    const user = await User.findOne({ username })

    if (user) {
      throw new GraphQLError('username already in use', {
        extensions: {
          code: 'BAD_USER_INPUT',
          http: { status: 409 }
        }
      })
    }
    // NOT PROBLEM
    update.username = username
  }

  // FIND USER AND UPDATE
  let user = await User.findByIdAndUpdate(context.user._id, update)

  // IF DOES NOT EXIST
  if (!user) return null

  // IF EMAIL WAS UPDATED
  if ((email && email !== context.user.email) || password) {
    // VALIDATE SECURITY
    const validPass = bcrypt.compareSync(security, user.password)

    if (!validPass) {
      throw new GraphQLError('password in not correct', {
        extensions: {
          code: 'BAD_USER_INPUT',
          http: { status: 400 }
        }
      })
    }

    // CHANGE EMAIL
    if (email) {
      user.email = email

      user.accountConfirmed = false

      user.tokens.forEach(async ({ token }) => {
        await client.del(`jwt:${token}`)
      })

      user.tokens = [{ token: uuidv4() }]

      // SEND EMAIL

      /*

      *****

      */
    }

    // CHANGE PASSWORD
    if (password) {
      user.password = bcrypt.hashSync(password, 10)
    }

    await user.save()
  }

  user = JSON.stringify({ ...(({ tokens, ...user }) => user)(user._doc), ...update })

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

export default updateUser
