const { v4: uuidv4 } = require("uuid");
const chatSessionModel = require("../models/chatSessionModel");
const messageModel = require("../models/messageModel");
const contextRuleModel = require("../models/contextRuleModel");
const aiService = require("../services/aiService");

class ChatController {
  /**
   * Create a new chat session
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async createSession(req, res) {
    try {
      const { user_id = "anonymous", business_context = "general" } = req.body;

      // Generate a unique room ID
      const room_id = uuidv4();

      // Create a new chat session
      const session = await chatSessionModel.create({
        room_id,
        user_id,
        business_context,
      });

      res.status(201).json({
        message: "Chat session created successfully",
        session,
      });
    } catch (error) {
      console.error("Error creating chat session:", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  /**
   * Get a chat session by room ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getSession(req, res) {
    try {
      const { roomId } = req.params;

      // Find the chat session
      const session = await chatSessionModel.findByRoomId(roomId);
      if (!session) {
        return res.status(404).json({ message: "Chat session not found" });
      }

      res.json({
        session,
      });
    } catch (error) {
      console.error("Error getting chat session:", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  /**
   * Get messages for a chat session
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getMessages(req, res) {
    try {
      const { roomId } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;

      // Get messages for the room
      const result = await messageModel.getByRoomId(roomId, page, limit);

      res.json(result);
    } catch (error) {
      console.error("Error getting chat messages:", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  /**
   * Send a message (REST API alternative to WebSocket)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async sendMessage(req, res) {
    try {
      const {
        room_id,
        content,
        user_id = "anonymous",
        business_context = "general",
      } = req.body;

      if (!room_id || !content) {
        return res
          .status(400)
          .json({ message: "Room ID and content are required" });
      }

      // Check if session exists
      const session = await chatSessionModel.findByRoomId(room_id);
      if (!session) {
        return res.status(404).json({ message: "Chat session not found" });
      }

      // Create the user message
      const userMessage = await messageModel.create({
        room_id,
        user_id,
        content,
        role: "user",
        business_context,
        timestamp: new Date(),
      });

      // Update the session's last activity
      await chatSessionModel.updateLastActivity(room_id);

      // Get context rules for the business context
      const contextRule =
        await contextRuleModel.findByBusinessContext(business_context);

      // Process with AI and get response
      const aiResponse = await aiService.processMessage(content, contextRule);

      // Save AI response to database
      const assistantMessage = await messageModel.create({
        room_id,
        user_id: "ai",
        content: aiResponse,
        role: "assistant",
        business_context,
        timestamp: new Date(),
      });

      res.status(201).json({
        message: "Message sent successfully",
        userMessage,
        assistantMessage,
      });
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  /**
   * Delete a chat session and its messages
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async deleteSession(req, res) {
    try {
      const { roomId } = req.params;

      // Delete the session
      const deleted = await chatSessionModel.delete(roomId);
      if (!deleted) {
        return res.status(404).json({ message: "Chat session not found" });
      }

      // Delete all messages for the session
      await messageModel.deleteByRoomId(roomId);

      res.json({ message: "Chat session deleted successfully" });
    } catch (error) {
      console.error("Error deleting chat session:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
}

module.exports = new ChatController();
