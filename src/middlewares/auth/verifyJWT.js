const redis = require("../../db/redis.client");
const jwt = require("jsonwebtoken");

// EXPRESS TYPES
const { response, request } = require("express");
// MODEL
const { User } = require("../../models");
// VALIDATION SCHEMA

// HELPERS
const { internalErrorServer } = require("../../helpers");

const verifyJWT = async (req = request, res = response, next) => {
  try {
    if (
      !req?.headers?.authorization ||
      !req?.headers?.authorization.startsWith("Bearer")
    )
      return res.status(401).json({ msg: "invalid auth" });

    // GRAB TOKEN FROM HEADERS
    const [, token] = req.headers.authorization.split(" ");

    // VERIFY JWT
    const {
      _id: user_id,
      exp: token_exp,
      iat: token_iat,
    } = jwt.verify(token, process.env.JWT_KEY || "secret");

    // ===============================
    // TOKEN IS VALID >>>
    // ===============================

    // VERIFY IF TOKEN WAS NOT DELETED FROM REDIS COLLECTION
    const redisToken = await redis.get(`jwt:${token}`);

    // INITIALIZE USER VARIABLE
    let user;

    // IF TOKEN WAS DELETED FROM REDIS COLLECTION
    if (!redisToken) {
      // FIND USER BY TOKEN
      user = await User.findOne({ "tokens.token": token }).select(
        "-account_confirmed -password"
      );

      // IF USER LOGGED OUT OR USER WAS DELETED
      if (!user) return res.status(401).json({ msg: "invalid auth" });

      // SAVE JWT IN REDIS COLLECTION
      await redis.set(`jwt:${token}`, token, {
        EX: process.env.JWT_REDIS_EXP
          ? Number(process.env.JWT_REDIS_EX)
          : 60 * 60 * 24,
        NX: true,
      });
    }

    req.data = {
      user_id,
      user,
      token,
      token_exp,
      token_iat,
    };

    next();
  } catch (error) {
    if (
      error?.message === "jwt expired" ||
      error?.message === "invalid token" ||
      error?.message === "jwt malformed" ||
      error?.message === "invalid signature"
    )
      return res.status(401).json({ msg: "invalid auth" });

    internalErrorServer(error, res);
  }
};

module.exports = verifyJWT;
