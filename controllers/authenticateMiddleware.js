const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
require("dotenv").config();

const authenticateMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    if (!token) {
      console.log("No token provided");
      return res.status(401).json({ message: "Not authorized" });
    }

    console.log("Token:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded:", decoded);

    const user = await User.findById(decoded.userId);
    console.log("User:", user);

    if (!user) {
      console.log("User not found");
      return res.status(401).json({ message: "Not authorized" });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ message: "Not authorized" });
  }
};

module.exports = authenticateMiddleware;
