import express from "express";
import { isAdmin } from "../middleware/auth.middleware.js";
import { User, ChatSession, Message, PromptTemplate } from "../models/index.js";

const router = express.Router();

// Apply admin middleware to all routes
router.use(isAdmin);

/**
 * @route GET /api/admin/users
 * @desc Get all users with pagination
 * @access Admin
 */
router.get("/users", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await User.findAndCountAll({
      attributes: { exclude: ["password"] },
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    res.json({
      users: rows,
      totalUsers: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
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
    const offset = (page - 1) * limit;

    const { count, rows } = await ChatSession.findAndCountAll({
      order: [["lastActivity", "DESC"]],
      limit,
      offset,
    });

    res.json({
      sessions: rows,
      totalSessions: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error getting chat sessions:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route GET /api/admin/analytics/messages
 * @desc Get message analytics
 * @access Admin
 */
router.get("/analytics/messages", async (req, res) => {
  try {
    // Get total message count
    const totalMessages = await Message.count();

    // Get message count by role
    const userMessages = await Message.count({ where: { role: "user" } });
    const assistantMessages = await Message.count({
      where: { role: "assistant" },
    });

    // Get message count by business context
    const businessContexts = await Message.findAll({
      attributes: [
        "businessContext",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["businessContext"],
      raw: true,
    });

    // Get message count by day for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const messagesByDay = await Message.findAll({
      attributes: [
        [sequelize.fn("DATE", sequelize.col("createdAt")), "date"],
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      where: {
        createdAt: { [sequelize.Op.gte]: sevenDaysAgo },
      },
      group: [sequelize.fn("DATE", sequelize.col("createdAt"))],
      order: [[sequelize.fn("DATE", sequelize.col("createdAt")), "ASC"]],
      raw: true,
    });

    res.json({
      totalMessages,
      messagesByRole: {
        user: userMessages,
        assistant: assistantMessages,
      },
      messagesByBusinessContext: businessContexts,
      messagesByDay,
    });
  } catch (error) {
    console.error("Error getting message analytics:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route GET /api/admin/prompt-templates
 * @desc Get all prompt templates with pagination
 * @access Admin
 */
router.get("/prompt-templates", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await PromptTemplate.findAndCountAll({
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    res.json({
      promptTemplates: rows,
      totalPromptTemplates: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error getting prompt templates:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route POST /api/admin/prompt-templates
 * @desc Create a new prompt template
 * @access Admin
 */
router.post("/prompt-templates", async (req, res) => {
  try {
    const promptTemplate = await PromptTemplate.create(req.body);

    res.status(201).json({
      message: "Prompt template created successfully",
      promptTemplate,
    });
  } catch (error) {
    console.error("Error creating prompt template:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route PUT /api/admin/prompt-templates/:id
 * @desc Update a prompt template
 * @access Admin
 */
router.put("/prompt-templates/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [updated] = await PromptTemplate.update(req.body, {
      where: { id },
    });

    if (!updated) {
      return res.status(404).json({ message: "Prompt template not found" });
    }

    const promptTemplate = await PromptTemplate.findByPk(id);

    res.json({
      message: "Prompt template updated successfully",
      promptTemplate,
    });
  } catch (error) {
    console.error("Error updating prompt template:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route DELETE /api/admin/prompt-templates/:id
 * @desc Delete a prompt template
 * @access Admin
 */
router.delete("/prompt-templates/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await PromptTemplate.destroy({
      where: { id },
    });

    if (!deleted) {
      return res.status(404).json({ message: "Prompt template not found" });
    }

    res.json({ message: "Prompt template deleted successfully" });
  } catch (error) {
    console.error("Error deleting prompt template:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
