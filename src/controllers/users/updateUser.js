const { request, response } = require("express");

const { internalErrorServer } = require("../../helpers");

const updateUser = (req = request, res = response) => {
  try {
  } catch (error) {
    internalErrorServer(error, res);
  }
};

module.exports = updateUser;
