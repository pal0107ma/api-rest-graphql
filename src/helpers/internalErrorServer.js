const { response } = require("express");

const internalErrorServer = (error, res = response) => {
  res.status(500).json(error);

  console.log(error);
};

module.exports = internalErrorServer;
