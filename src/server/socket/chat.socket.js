import { ChatSession } from "../models/index.js";
import messageService from "../services/message.service.js";
import aiService from "../services/ai.service.js";
import contextService from "../services/context.service.js";

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
        const { roomId, message, userId, businessContext } = data;

        // Save user message to database
        const savedMessage = await messageService.createMessage({
          content: message,
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

        // Emit user message to room
        io.to(roomId).emit("receive_message", savedMessage);

        // Get context rules for the business context
        const contextRules = await contextService.getContextRulesByBusiness(
          businessContext || "general",
        );

        // Process with AI and get response
        const aiResponse = await aiService.processMessage(
          message,
          contextRules,
        );

        // Save AI response to database
        const aiMessage = await messageService.createMessage({
          content: aiResponse,
          userId: "ai",
          roomId,
          role: "assistant",
          businessContext: businessContext || "general",
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

export default setupChatHandlers;
