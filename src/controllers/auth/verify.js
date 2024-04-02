// EXPRESS TYPES
const { response, request } = require("express");
// VALIDATION SCHEMA

// HELPERS
const { internalErrorServer } = require("../../helpers");

const verify = async (req = request, res = response) => {
  try {
    let { user_id } = req.data;

    return res.json({ msg: "verify success", user_id });
  } catch (error) {
    internalErrorServer(error, res);
  }
};

module.exports = verify;
