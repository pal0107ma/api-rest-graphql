// EXPRESS TYPES
import { response, request } from 'express';

// VALIDATION SCHEMA

// HELPERS
import  internalErrorServer  from '../../helpers/internalErrorServer.js';

const verify = async (req = request, res = response) => {
  try {
    let { user_id } = req.data;

    return res.json({ msg: "verify success", user_id });
  } catch (error) {
    internalErrorServer(error, res);
  }
};

export default verify;
