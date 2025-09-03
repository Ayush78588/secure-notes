const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  codeHash: String,
  expiresAt: Date,
  attempts: { type: Number, default: 0 }
}, { _id: false });

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: String,
  provider: { type: String, enum: ["email", "google"], default: "email" },
  googleId: String,
  avatarUrl: String,
  otp: otpSchema
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
