const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

// REDIS CLIENT
const redis = require("../../db/redis.client");

// EXPRESS TYPES
const { response, request } = require("express");
// MODEL
const { User } = require("../../models");
// VALIDATION SCHEMA

const schema = Joi.object({
  password: Joi.string().required().trim(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
});

// HELPERS
const { internalErrorServer } = require("../../helpers");

const signin = async (req = request, res = response) => {
  try {
    // GRAB DATA FROM BODY
    let { email = "", password = "" } = req.body;

    // VALIDATE DATA
    const { value, error } = schema.validate({
      email,
      password,
    });

    if (error) return res.status(400).json(error);

    // VERIFY IF DOES NOT EXIST ANY USER WITH SAME EMAIL
    const user = await User.findOne({ email });

    if (!user)
      return res
        .status(404)
        .json({ msg: "does not exist any user with that email" });

    // VERIFY IF ACCOUNT IS CONFIRMED
    if (!user.account_confirmed)
      return res.status(403).json({ msg: "your account is not confirmed" });

    // VALIDATE PASSWORD
    const validatePassword = bcrypt.compareSync(value.password, user.password);

    if (!validatePassword)
      return res.status(400).json({ msg: "password in not correct" });

    // GENERATE JSON WEB TOKEN

    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.JWT_KEY || "secret",
      { expiresIn: process.env.JWT_EXP || "1d" }
    );

    // PULL EXPIRED TOKENS
    user.tokens = user.tokens.filter(({ exp }) => exp > new Date().getTime());

    // PUSH TOKEN TO USER TOKENS
    user.tokens.push({ token, exp: jwt.decode(token).exp * 1000 });

    await user.save();

    // SAVE JWT IN REDIS COLLECTION
    await redis.set(`jwt:${token}`, token, {
      EX: process.env.JWT_REDIS_EXP
        ? Number(process.env.JWT_REDIS_EX)
        : 60 * 60 * 24,
      NX: true,
    });

    // SAVE USER IN REDIS COLLECTION
    await redis.hSet(
      `users:${user._id}`,
      (({ account_confirmed, password, tokens, ...user }) => user)(
        JSON.parse(JSON.stringify(user._doc))
      ),
      {
        EX: process.env.USER_REDIS_EXP
          ? Number(process.env.USER_REDIS_EXP)
          : 60 * 60 * 24,
        NX: true,
      }
    );

    // SEND TOKEN
    res.json({ msg: "signin success", token });
  } catch (error) {
    internalErrorServer(error, res);
  }
};

module.exports = signin;
