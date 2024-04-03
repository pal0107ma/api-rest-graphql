const signup = require("./signup");
const signin = require("./signin");
const confirmAccount = require("./confirmAccount");
const logout = require("./logout");
const verify = require("./verify");
const profile = require("./profile");
const forgotPassword = require("./forgotPassword");
const confirmForgotPassword = require("./confirmForgotPassword");

module.exports = {
  signup,
  signin,
  confirmAccount,
  verify,
  logout,
  profile,
  forgotPassword,
  confirmForgotPassword,
};
