const express = require("express");
const passport = require("passport");
const { startOtp, verifyOtp, logout } = require("../controllers/authController");
const { googleCallback } = require("../controllers/googleController");

const router = express.Router();

// email + otp
router.post("/otp/start", startOtp);
router.post("/otp/verify", verifyOtp);

//  logout
router.post("/logout", logout);

// google
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  googleCallback
);

module.exports = router;
