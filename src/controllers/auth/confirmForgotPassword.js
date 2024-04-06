import { request, response } from "express";
import bcrypt from "bcrypt";
import internalErrorServer from "../../helpers/internalErrorServer.js";
import passwordSchema from "../../schemas/passwordSchema.js";

const confirmForgotPassword = async (req = request, res = response) => {
  try {
    const { user, token } = req.data;

    const { error, value: password } = passwordSchema.validate(
      req.body.password || ""
    );

    if (error) return res.status(400).json(error);

    user.tokens.pull({ token });

    user.password = bcrypt.hashSync(password, 10);

    await user.save();

    res.json({ msg: "confirm forgot password success" });
  } catch (error) {
    internalErrorServer(error, res);
  }
};

export default confirmForgotPassword;
