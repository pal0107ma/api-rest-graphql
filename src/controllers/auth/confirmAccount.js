import Joi from 'joi'

// EXPRESS TYPES
import { response, request } from 'express'

// MODEL
import User from '../../models/User.js'

// HELPERS
import internalErrorServer from '../../helpers/internalErrorServer.js'

const confirmAccount = async (req = request, res = response) => {
  try {
    // GRAB DATA FROM QUERY PARAMS
    const { token = '' } = req.query

    // VALIDATE DATA
    const schema = Joi.string().trim()

    const { error } = schema.validate(token)

    if (error) return res.status(400).json({ msg: 'token is required' })

    // FIND USER BY TOKEN
    const user = await User.findOne({ 'tokens.token': token }).select(
      '-password'
    )

    if (!user) return res.status(404).json({ msg: 'token was not found' })

    user.accountConfirmed = true

    // DELETE TOKEN
    user.tokens.pull({ token })

    // SAVE CHANGES
    await user.save()

    // SEND USER INFO
    res.json(
      (() => {
        const { tokens, accountConfirmed, ...data } = user._doc
        return { msg: 'confirm account success', data }
      })()
    )
  } catch (error) {
    internalErrorServer(error, res)
  }
}

export default confirmAccount
