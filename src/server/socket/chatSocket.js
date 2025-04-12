const chatSessionModel = require("../models/chatSessionModel");
const messageModel = require("../models/messageModel");
const contextRuleModel = require("../models/contextRuleModel");
const aiService = require("../services/aiService");

/**
 * Set up socket.io event handlers for chat functionality
 * @param {Object} io - Socket.io server instance
 */
const setupChatHandlers = (io) => {
  io.on("connection", (socket) => {
    console.log("New client connected", socket.id);

    // Handle joining a chat room
    socket.on("join_room", (roomId) => {
      socket.join(roomId);
      console.log(`User joined room: ${roomId}`);
    });

    // Handle sending a message
    socket.on("send_message", async (data) => {
      try {
        const {
          roomId,
          message,
          userId = "anonymous",
          businessContext = "general",
        } = data;

        // Check if session exists
        const session = await chatSessionModel.findByRoomId(roomId);
        if (!session) {
          socket.emit("error", { message: "Chat session not found" });
          return;
        }

        // Save user message to database
        const savedMessage = await messageModel.create({
          room_id: roomId,
          user_id: userId,
          content: message,
          role: "user",
          business_context: businessContext,
          timestamp: new Date(),
        });

        // Update the session's last activity
        await chatSessionModel.updateLastActivity(roomId);

        // Emit user message to room
        io.to(roomId).emit("receive_message", savedMessage);

        // Get context rules for the business context
        const contextRule =
          await contextRuleModel.findByBusinessContext(businessContext);

        // Process with AI and get response
        const aiResponse = await aiService.processMessage(message, contextRule);

        // Save AI response to database
        const aiMessage = await messageModel.create({
          room_id: roomId,
          user_id: "ai",
          content: aiResponse,
          role: "assistant",
          business_context: businessContext,
          timestamp: new Date(),
        });

        // Emit AI response to room
        io.to(roomId).emit("receive_message", aiMessage);
      } catch (error) {
        console.error("Error processing message:", error);
        socket.emit("error", { message: "Error processing your message" });
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("Client disconnected", socket.id);
    });
  });
};

module.exports = setupChatHandlers;
