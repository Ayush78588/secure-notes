const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { generateTokens} = require("../utils/token");



// simple transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});

// start otp
async function startOtp(req, res) {
  try {
    const { email } = req.body;
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: "please enter a valid email" });
    }

    // generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // hash and save in db
    const salt = await bcrypt.genSalt(10);
    const codeHash = await bcrypt.hash(code, salt);

    let user = await User.findOne({ email });
    if (!user) user = await User.create({ email, provider: "email" });

    user.otp = {
      codeHash,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 min
      attempts: 0
    };
    await user.save();

    // send mail
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

// verify otp 
async function verifyOtp(req, res) {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "email and otp required" });

    const user = await User.findOne({ email });
    if (!user || !user.otp) return res.status(400).json({ message: "invalid email or otp" });

    if (new Date() > user.otp.expiresAt) {
      return res.status(400).json({ message: "otp expired" });
    }

    // simple attempt cap
    if (user.otp.attempts >= 5) {
      return res.status(429).json({ message: "too many attempts" });
    }

    const ok = await bcrypt.compare(otp, user.otp.codeHash);
    if (!ok) {
      user.otp.attempts += 1;
      await user.save();
      return res.status(400).json({ message: "wrong otp" });
    }

    // success 
    user.otp = undefined;
    if (!user.name) user.name = email.split("@")[0]; // placeholder name
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

module.exports = { startOtp, verifyOtp, logout };
