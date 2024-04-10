import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'
import Joi from 'joi'

// EXPRESS TYPES
import { response, request } from 'express'

// MODEL
import User from '../../models/User.js'

// HELPERS
import internalErrorServer from '../../helpers/internalErrorServer.js'

const signup = async (req = request, res = response) => {
  // VALIDATION SCHEMA
  const schema = Joi.object({
    username: Joi.string().alphanum().min(3).max(15)
      .required(),

    firstName: Joi.string()
      .min(3)
      .max(30)
      .regex(/^[A-Z]+$/i),

    lastName: Joi.string()
      .min(3)
      .max(30)
      .regex(/^[A-Z]+$/i),

    password: Joi.string().pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/),

    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] }
    }),

    role: Joi.string().valid('STUDENT', 'TEACHER')
  })

  try {
    // GRAB DATA FROM BODY
    const {
      email = '',
      password = '',
      firstName = '',
      username = '',
      lastName = '',
      role = ''
    } = req.body

    // VALIDATE DATA
    const { value, error } = schema.validate({
      email,
      password,
      username,
      role,
      lastName,
      firstName
    })

    if (error) return res.status(400).json(error)

    // VERIFY IF DOES NOT EXIST ANY USER WITH SAME EMAIL OR USERNAME
    const doesExist = await User.findOne({ $or: [{ email }, { username }] })

    if (doesExist) { return res.status(409).json({ msg: 'email or username already exist' }) }

    // HASH PASSWORD BEFORE CREATE USER
    value.password = bcrypt.hashSync(value.password, 10)

    // CREATE USER
    const user = new User({
      ...value,
      tokens: [{ token: uuidv4() }]
    })

    await user.save()

    // SEND CONFIRMATION EMAIL

    // await sendEmail({
    //   htmlParams: {
    //     HREF: `${
    //       process.env.FRONTEND_URL || "http://localhost:3000/api/auth"
    //     }/confirm-account?token=${user.tokens[0].token}`,
    //     TITLE: "Welcome!",
    //     LINK_TEXT: "Click here!",
    //     TEXT: `We need you confirm your account let's press "Click here!"`,
    //   },
    //   to: email,
    //   host: req.hostname,
    //   subject: "Confirm account email",
    // });

    // SEND USER INFO
    res.status(201).json(
      (() => {
        const {
          password, tokens, accountConfirmed, ...data
        } = user._doc
        return { msg: 'signup success', data }
      })()
    )
  } catch (error) {
    internalErrorServer(error, res)
  }
}

export default signup
