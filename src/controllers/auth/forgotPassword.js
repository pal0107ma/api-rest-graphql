const { request, response } = require("express");
const { v4: uuidv4 } = require("uuid");
const { internalErrorServer, sendEmail } = require("../../helpers");
const { emailSchema } = require("../../schemas");
const { User } = require("../../models");

const forgotPassword = async (req = request, res = response) => {
  try {
    const { error, value: email } = emailSchema.validate(req.body.email || "");

    if (error) return res.status(400).json(error);

    const user = await User.findOne({ email }).select("tokens");

    if (!user) return res.status(404).json({ msg: "user was not found" });

    const iat = new Date().getTime();

    const time = process.env.FORGOT_PASSWORD_TOKEN_EXP || 24 * 60 * 60 * 1000;

    const exp = time + iat;

    user.tokens.forEach(({ type, _id }) => {
      if (type === "FORGOT-PASS") user.tokens.pull(_id);
    });

    user.tokens.push({ token: uuidv4(), exp, iat, type: "FORGOT-PASS" });

    await user.save();

    // SEND CONFIRMATION EMAIL

    // await sendEmail({
    //   htmlParams: {
    //     HREF: `${process.env.FRONTEND_URL}/confirm-forgot-password?token=${user.tokens[0].token}`,
    //     TITLE: "COnfirm you forgot your password!",
    //     LINK_TEXT: "Click here!",
    //     TEXT: `We need you confirm you forgot your password let's press "Click here!"`,
    //   },
    //   to: email,
    //   host: req.hostname,
    //   subject: "Forgot password confirmation email",
    // });

    // SEND USER INFO
    
    res.status(201).json({ msg: "we've sent an email" });
  } catch (error) {
    internalErrorServer(error, res);
  }
};

module.exports = forgotPassword;
