const jwt = require("jsonwebtoken");


function generateTokens(userId) {
  const accessToken = jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: "1d" });
  return { accessToken };
}



module.exports = { generateTokens };
