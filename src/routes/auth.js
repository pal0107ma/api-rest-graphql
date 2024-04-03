const { Router } = require("express");
const {
  signup,
  signin,
  confirmAccount,
  verify,
  logout,
  profile,
  forgotPassword,
  confirmForgotPassword,
} = require("../controllers/auth");

const { verifyUUIDToken,verifyJWT } = require("../middlewares/auth");

const router = Router();

router.post("/signup", signup);

router.post("/signin", signin);

router.get("/confirm-account", confirmAccount);

router.get("/verify", verifyJWT, verify);

router.get("/profile", verifyJWT, profile);

router.delete("/logout", verifyJWT, logout);

router.post("/forgot-password", forgotPassword);

router.get("/verify-token", verifyUUIDToken, (req, res) =>
  res.json({ msg: "verify token success" })
);

router.post("/confirm-forgot-password", verifyUUIDToken, confirmForgotPassword);

module.exports = router;
