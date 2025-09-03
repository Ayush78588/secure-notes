const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { generateTokens } = require("../utils/token");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// simple transporter for OTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});

// start OTP
async function startOtp(req, res) {
  try {
    const { email } = req.body;
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: "please enter a valid email" });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = await bcrypt.genSalt(10);
    const codeHash = await bcrypt.hash(code, salt);

    let user = await User.findOne({ email });
    if (!user) user = await User.create({ email, provider: "email" });

    user.otp = {
      codeHash,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      attempts: 0
    };
    await user.save();

    await transporter.sendMail({
      from: process.env.OTP_EMAIL_FROM || process.env.SMTP_USER,
      to: email,
      subject: "Your OTP for Note App",
      text: `Your OTP is ${code}. It will expire in 10 minutes.`,
    });

    return res.json({ message: "otp sent if email exists" });
  } catch (err) {
    console.error("startOtp error", err);
    return res.status(500).json({ message: "server error" });
  }
}

// verify OTP
async function verifyOtp(req, res) {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "email and otp required" });

    const user = await User.findOne({ email });
    if (!user || !user.otp) return res.status(400).json({ message: "invalid email or otp" });

    if (new Date() > user.otp.expiresAt) {
      return res.status(400).json({ message: "otp expired" });
    }

    if (user.otp.attempts >= 5) {
      return res.status(429).json({ message: "too many attempts" });
    }

    const ok = await bcrypt.compare(otp, user.otp.codeHash);
    if (!ok) {
      user.otp.attempts += 1;
      await user.save();
      return res.status(400).json({ message: "wrong otp" });
    }

    user.otp = undefined;
    if (!user.name) user.name = email.split("@")[0];
    await user.save();

    const { accessToken } = generateTokens(user._id.toString());

    return res.json({
      accessToken,
      user: { id: user._id, email: user.email, name: user.name, provider: user.provider }
    });
  } catch (err) {
    console.error("verifyOtp error", err);
    return res.status(500).json({ message: "server error" });
  }
}

// logout
function logout(req, res) {
  res.clearCookie("accessToken");
  return res.json({ message: "logged out" });
}

// Google login (client-side token)
async function loginWithGoogle(req, res) {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    let user = await User.findOne({ email: payload.email });
    if (!user) {
      user = await User.create({
        name: payload.name,
        email: payload.email,
        googleId: payload.sub,
        provider: "google",
      });
    }

    const { accessToken } = generateTokens(user._id.toString());

    return res.json({ user, accessToken });
  } catch (err) {
    console.error("Google login error:", err);
    return res.status(400).json({ message: "Google login failed" });
  }
}

module.exports = { startOtp, verifyOtp, logout, loginWithGoogle };
