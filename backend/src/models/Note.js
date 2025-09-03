const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true, maxlength: 120 },
  body: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("Note", noteSchema);
