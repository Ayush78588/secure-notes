const express = require("express");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");


const app = express();

// connect to mongodb
connectDB();

// middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// simple health
app.get("/api/health", (req, res) => res.json({ ok: true }));

// passport google setup
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
  },
  (accessToken, refreshToken, profile, done) => {

    return done(null, profile);
  }
));
app.use(passport.initialize());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("server running on http://localhost:" + PORT);
});
