const internalErrorServer = require("./internalErrorServer");
const mountRoutes = require("./mountRoutes");
const sendEmail = require("./sendEmail")
module.exports = {
  internalErrorServer,
  mountRoutes,
  sendEmail
};
