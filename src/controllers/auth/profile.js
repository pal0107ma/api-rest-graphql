import redis from '../../db/redis.client.js';

// EXPRESS TYPES
import { response, request } from 'express';

// MODEL
import  User  from '../../models/User.js';

// VALIDATION SCHEMA

// HELPERS
import  internalErrorServer  from '../../helpers/internalErrorServer.js';

const profile = async (req = request, res = response) => {
  try {
    let { user_id, user } = req.data;

    // FIND USER IN REDIS COLLECTION
    let redisUser = await redis.hGetAll(`users:${user_id}`);

    // IF USER IS NOT IN REDIS COLLECTION
    if (!redisUser?._id) {
      // IF USER WAS NOT DEFINED BEFORE
      if (!user) {
        user = await User.findById(user_id).select(
          "-account_confirmed -password"
        );

        // IF USER DIDN'T FOUND EITHER IN DB COLLECTION
        if (!user) return res.status(401).json({ msg: "invalid auth" });
      }

      redisUser = (({ tokens, ...user }) => user)(
        JSON.parse(JSON.stringify(user._doc))
      );

      // SAVE IN REDIS COLLECTION
      await redis.hSet(`users:${user_id}`, redisUser, {
        EX: process.env.USER_REDIS_EXP
          ? Number(process.env.USER_REDIS_EXP)
          : 60 * 60 * 24,
        NX: true,
      });
    }

    return res.json({ msg: "profile success", info: redisUser });
  } catch (error) {
    internalErrorServer(error, res);
  }
};

export default profile;