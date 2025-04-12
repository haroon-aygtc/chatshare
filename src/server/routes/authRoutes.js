const express = require("express");
const authController = require("../controllers/authController");
const { authenticateJWT } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post("/register", authController.register.bind(authController));

/**
 * @route POST /api/auth/login
 * @desc Login a user
 * @access Public
 */
router.post("/login", authController.login.bind(authController));

/**
 * @route POST /api/auth/logout
 * @desc Logout a user
 * @access Public
 */
router.post("/logout", authController.logout.bind(authController));

/**
 * @route GET /api/auth/me
 * @desc Get current user
 * @access Private
 */
router.get(
  "/me",
  authenticateJWT,
  authController.getCurrentUser.bind(authController),
);

module.exports = router;
