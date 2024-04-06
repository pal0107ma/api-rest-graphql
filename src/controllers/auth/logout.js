import redis from '../../db/redis.client.js';

// EXPRESS TYPES
import { response, request } from 'express';

// MODEL
import  User  from '../../models/User.js';

// VALIDATION SCHEMA

// HELPERS
import  internalErrorServer  from '../../helpers/internalErrorServer.js';

const logout = async (req = request, res = response) => {
  try {
    // VERIFY JWT
    let { user_id, token } = req.data;

    await redis.del(`jwt:${token}`);

    await redis.del(`users:${user_id}`);

    const user = await User.findById(user_id)
    .select("-account_confirmed -password");

    // IF USER WAS DELETED
    if (!user) return res.status(401).json({ msg: "invalid auth" });

    user.tokens.pull({ token });

    await user.save();

    res.json(
      (() => {
        const { tokens, ...info } = user._doc;
        return { msg: "logout success", info };
      })()
    );
  } catch (error) {
    internalErrorServer(error, res);
  }
};

export default logout;
