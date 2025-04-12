import { v4 as uuidv4 } from "uuid";
import { ChatSession } from "../models/index.js";
import messageService from "../services/message.service.js";
import aiService from "../services/ai.service.js";
import contextService from "../services/context.service.js";

/**
 * Create a new chat session
 */
export const createSession = async (req, res) => {
  try {
    const { userId, businessContext } = req.body;

    // Generate a unique room ID
    const roomId = uuidv4();

    // Create a new chat session
    const session = await ChatSession.create({
      roomId,
      userId: userId || "anonymous",
      businessContext: businessContext || "general",
      isActive: true,
      lastActivity: new Date(),
    });

    res.status(201).json({
      message: "Chat session created successfully",
      session: session.toJSON(),
    });
  } catch (error) {
    console.error("Error creating chat session:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get a chat session by room ID
 */
export const getSession = async (req, res) => {
  try {
    const { roomId } = req.params;

    // Find the chat session
    const session = await ChatSession.findOne({ where: { roomId } });
    if (!session) {
      return res.status(404).json({ message: "Chat session not found" });
    }

    res.json({
      session: session.toJSON(),
    });
  } catch (error) {
    console.error("Error getting chat session:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get messages for a chat session
 */
export const getMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;

    // Get messages for the room
    const result = await messageService.getMessagesByRoom(roomId, page, limit);

    res.json(result);
  } catch (error) {
    console.error("Error getting chat messages:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Send a message (REST API alternative to WebSocket)
 */
export const sendMessage = async (req, res) => {
  try {
    const { roomId, content, userId, businessContext } = req.body;

    if (!roomId || !content) {
      return res
        .status(400)
        .json({ message: "Room ID and content are required" });
    }

    // Create the user message
    const userMessage = await messageService.createMessage({
      content,
      userId: userId || "anonymous",
      roomId,
      role: "user",
      businessContext: businessContext || "general",
    });

    // Update the session's last activity
    await ChatSession.update(
      { lastActivity: new Date() },
      { where: { roomId } },
    );

    // Get context rules for the business context
    const contextRules = await contextService.getContextRulesByBusiness(
      businessContext || "general",
    );

    // Process with AI and get response
    const aiResponse = await aiService.processMessage(content, contextRules);

    // Save AI response to database
    const assistantMessage = await messageService.createMessage({
      content: aiResponse,
      userId: "ai",
      roomId,
      role: "assistant",
      businessContext: businessContext || "general",
    });

    res.status(201).json({
      message: "Message sent successfully",
      userMessage: userMessage,
      assistantMessage: assistantMessage,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Delete a chat session and its messages
 */
export const deleteSession = async (req, res) => {
  try {
    const { roomId } = req.params;

    // Delete the session
    const deleted = await ChatSession.destroy({ where: { roomId } });
    if (!deleted) {
      return res.status(404).json({ message: "Chat session not found" });
    }

    // Delete all messages for the session
    await messageService.deleteMessagesByRoom(roomId);

    res.json({ message: "Chat session deleted successfully" });
  } catch (error) {
    console.error("Error deleting chat session:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export default {
  createSession,
  getSession,
  getMessages,
  sendMessage,
  deleteSession,
};
