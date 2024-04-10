import { response, request } from 'express'
import client from '../../db/redis.client.js'

// EXPRESS TYPES

// MODEL
import User from '../../models/User.js'

// VALIDATION SCHEMA

// HELPERS
import internalErrorServer from '../../helpers/internalErrorServer.js'

const logout = async (req = request, res = response) => {
  try {
    // VERIFY JWT
    const { userId, token } = req.context

    await client.del(`jwt:${token}`)

    await client.del(`users:${userId}`)

    const user = await User.findById(userId)
      .select('-accountConfirmed -password')

    // IF USER WAS DELETED
    if (!user) return res.status(401).json({ msg: 'invalid auth' })

    user.tokens.pull({ token })

    await user.save()

    res.json(
      (() => {
        const { tokens, ...data } = user._doc
        return { msg: 'logout success', data }
      })()
    )
  } catch (error) {
    internalErrorServer(error, res)
  }
}

export default logout
