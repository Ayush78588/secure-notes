const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ mongo connected");
  } catch (err) {
    console.error("❌ mongo error", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
