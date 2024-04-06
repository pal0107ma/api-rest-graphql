import Joi from 'joi';
import { request, response } from 'express';
import  internalErrorServer  from '../../helpers/internalErrorServer.js';
import  User  from '../../models/User.js';

const verifyUUIDToken = async (req = request, res = response, next) => {
  try {
    const { error, value: token } = Joi.string().validate(
      req.query.token || ""
    );

    if (error) return res.status(400).json(error);

    const user = await User.findOne({
      "tokens.token": token,
      "tokens.exp": {
        $gt: new Date().getTime(),
      },
    }).select("tokens");

    if (!user) return res.status(404).json({ msg: "token was not found" });

    req.data = {
      user,
      token,
    };

    next();
  } catch (error) {
    internalErrorServer(error, res);
  }
};

export default verifyUUIDToken;
