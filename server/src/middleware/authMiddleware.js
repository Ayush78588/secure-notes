const jwt = require("jsonwebtoken");

// checks Authorization
function authRequired(req, res, next) {
  
  
  const hdr = req.headers.authorization || "";
  const parts = hdr.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ message: "missing or invalid token" });
  }
  const token = parts[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.userId = decoded.userId;
  
    
    next();
  } catch (err) {
    console.log(err.message,11);
    
    return res.status(401).json({ message: "token expired or invalid" });
  }
}

module.exports = { authRequired };
