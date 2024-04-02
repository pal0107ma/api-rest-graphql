const Joi = require("joi");
// EXPRESS TYPES
const { response, request } = require("express");
// MODEL
const { User } = require("../../models");

// HELPERS
const { internalErrorServer } = require("../../helpers");

const confirmAccount = async (req = request, res = response) => {
  try {
    // GRAB DATA FROM QUERY PARAMS
    let { token = "" } = req.query;

    // VALIDATE DATA
    const schema = Joi.string().trim();

    const { error } = schema.validate(token);

    if (error) return res.status(400).json({ msg: "token is required" });

    // FIND USER BY TOKEN
    const user = await User.findOne({ "tokens.token": token }).select(
      "-password"
    );

    if (!user) return res.status(404).json({ msg: "token was not found" });

    user.account_confirmed = true;

    // DELETE TOKEN
    user.tokens.pull({ token });

    // SAVE CHANGES
    await user.save();

    // SEND USER INFO
    res.json(
      (() => {
        const { tokens, account_confirmed, ...info } = user._doc;
        return { msg: "confirm account success", info };
      })()
    );
  } catch (error) {
    internalErrorServer(error, res);
  }
};

module.exports = confirmAccount;
