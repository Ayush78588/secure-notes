const express = require("express");
const { startOtp, verifyOtp, logout, loginWithGoogle } = require("../controllers/authController");

const router = express.Router();

// OTP routes
router.post("/otp/start", startOtp);
router.post("/otp/verify", verifyOtp);

// logout
router.post("/logout", logout);

// Google login route (POST)
router.post("/google", loginWithGoogle);

module.exports = router;
