const express = require("express");
const router = express.Router();
const authController = require("../../controllers/auth.controller");
const authenticateMiddleware = require("../../controllers/authenticateMiddleware");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authenticateMiddleware, authController.logout);
router.get("/current", authenticateMiddleware, authController.getCurrentUser);

module.exports = router;
