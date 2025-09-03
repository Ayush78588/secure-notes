const User = require("../models/User");
const { generateTokens, setRefreshCookie } = require("../utils/token");

async function googleCallback(req, res) {
  try {
    const profile = req.user; // from passport
    const googleId = profile.id;
    const email = profile.emails?.[0]?.value;
    const name = profile.displayName;
    const avatarUrl = profile.photos?.[0]?.value;

    if (!email) {
    
      return res.redirect(process.env.FRONTEND_URL + "/login?error=no_email_from_google");
    }

    let user = await User.findOne({ googleId });
    if (!user) {
      // maybe existing email
      user = await User.findOne({ email });
      if (user && !user.googleId) {
        user.googleId = googleId;
        user.provider = "google";
        user.avatarUrl = avatarUrl || user.avatarUrl;
        user.name = user.name || name;
        await user.save();
      } else if (!user) {
        user = await User.create({
          googleId,
          email,
          name,
          avatarUrl,
          provider: "google"
        });
      }
    }

    const { accessToken, refreshToken } = generateTokens(user._id.toString());
    setRefreshCookie(res, refreshToken);

    // redirect back to frontend
    return res.redirect(`${process.env.FRONTEND_URL}/?token=${accessToken}`);
  } catch (err) {
    console.error("googleCallback error", err);
    return res.redirect(process.env.FRONTEND_URL + "/login?error=google_failed");
  }
}

module.exports = { googleCallback };
