const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const User = require("../models/user.model");
require("dotenv").config();

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await User.findById(payload.userId);
      console.log("User found:", user);

      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    } catch (error) {
      console.error("JWT strategy error:", error);
      return done(error, false);
    }
  })
);

const authenticateMiddleware = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err || !user) {
      console.error("Authentication error:", err);
      return res.status(401).json({
        status: "error",
        code: 401,
        message: "Unauthorized",
        data: "Unauthorized",
      });
    }
    console.log("Authenticated user:", user);
    req.user = user;
    next();
  })(req, res, next);
};

module.exports = authenticateMiddleware;
