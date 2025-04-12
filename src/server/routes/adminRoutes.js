const express = require("express");
const userModel = require("../models/userModel");
const chatSessionModel = require("../models/chatSessionModel");
const messageModel = require("../models/messageModel");
const { authenticateJWT, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// Apply admin middleware to all routes
router.use(authenticateJWT, isAdmin);

/**
 * @route GET /api/admin/users
 * @desc Get all users with pagination
 * @access Admin
 */
router.get("/users", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    const result = await userModel.getAll(page, limit, search);

    res.json(result);
  } catch (error) {
    console.error("Error getting users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route GET /api/admin/sessions
 * @desc Get all chat sessions with pagination
 * @access Admin
 */
router.get("/sessions", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await chatSessionModel.getAll(page, limit);

    res.json(result);
  } catch (error) {
    console.error("Error getting sessions:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route GET /api/admin/analytics
 * @desc Get analytics data
 * @access Admin
 */
router.get("/analytics", async (req, res) => {
  try {
    const messageAnalytics = await messageModel.getAnalytics();
    const sessionAnalytics = await chatSessionModel.getAnalytics();

    res.json({
      messages: messageAnalytics,
      sessions: sessionAnalytics,
    });
  } catch (error) {
    console.error("Error getting analytics:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route PUT /api/admin/users/:id
 * @desc Update a user
 * @access Admin
 */
router.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password, role, is_active } = req.body;

    // Check if user exists
    const existingUser = await userModel.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user
    await userModel.update(id, { username, email, password, role, is_active });

    // Get updated user
    const updatedUser = await userModel.findById(id);

    res.json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route DELETE /api/admin/users/:id
 * @desc Delete a user
 * @access Admin
 */
router.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Delete the user
    const deleted = await userModel.delete(id);

    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
