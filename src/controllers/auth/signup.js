const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const Joi = require("joi");
// EXPRESS TYPES
const { response, request } = require("express");
// MODEL
const { User } = require("../../models");
// VALIDATION SCHEMA

const schema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),

  full_name: Joi.string().min(3).max(30).required(),

  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),

  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
});

// HELPERS
const { internalErrorServer } = require("../../helpers");

const signup = async (req = request, res = response) => {
  try {
    // GRAB DATA FROM BODY
    let { email = "", password = "", full_name = "", username = "" } = req.body;

    // VALIDATE DATA
    const { value, error } = schema.validate({
      email,
      password,
      username,
      full_name,
    });

    if (error) return res.status(400).json(error);

    // VERIFY IF DOES NOT EXIST ANY USER WITH SAME EMAIL OR USERNAME
    const doesExist = await User.findOne({ $or: [{ email }, { username }] });

    if (doesExist)
      return res.status(409).json({ msg: "email or username already exist" });

    // HASH PASSWORD BEFORE CREATE USER
    value.password = bcrypt.hashSync(value.password, 10);

    // CREATE USER
    const user = new User({
      ...value,
      tokens: [{ token: uuidv4() }],
    });

    await user.save();

    // SEND CONFIRMATION EMAIL

    // ***

    // SEND USER INFO
    res.status(201).json(
      (() => {
        const { password, tokens, account_confirmed, ...info } = user._doc;
        return { msg: "signup success", info };
      })()
    );
  } catch (error) {
    internalErrorServer(error, res);
  }
};

module.exports = signup;
