const { Router } = require("express");
const {
  signup,
  signin,
  confirmAccount,
  verify,
  logout,
  profile,
} = require("../controllers/auth");
const { verifyJWT } = require("../middlewares/auth");

const router = Router();

router.post("/signup", signup);

router.post("/signin", signin);

router.get("/confirm-account", confirmAccount);

router.get("/verify", verifyJWT, verify);

router.get("/profile", verifyJWT, profile);

router.delete("/logout", verifyJWT, logout);

module.exports = router;
