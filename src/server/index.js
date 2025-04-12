import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize } from "./database/config.js";
import authRoutes from "./routes/auth.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import contextRoutes from "./routes/context.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import { authenticateJWT } from "./middleware/auth.middleware.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  }),
);
app.use(express.json());

// Database connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection established successfully.");
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log("Database models synchronized.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/contexts", contextRoutes);
app.use("/api/admin", authenticateJWT, adminRoutes);

// Socket.io connection
io.on("connection", (socket) => {
  console.log("New client connected", socket.id);

  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  socket.on("send_message", async (data) => {
    try {
      const { roomId, message, userId, businessContext } = data;

      // Save message to database through the service
      const messageService = require("./services/message.service.js");
      const savedMessage = await messageService.createMessage({
        content: message,
        userId,
        roomId,
        role: "user",
        businessContext,
      });

      // Emit message to room
      io.to(roomId).emit("receive_message", savedMessage);

      // Process with AI and get response
      const aiService = require("./services/ai.service.js");
      const contextService = require("./services/context.service.js");

      // Get context rules for the business context
      const contextRules =
        await contextService.getContextRulesByBusiness(businessContext);

      // Get AI response
      const aiResponse = await aiService.processMessage(message, contextRules);

      // Save AI response to database
      const aiMessage = await messageService.createMessage({
        content: aiResponse,
        userId: "ai",
        roomId,
        role: "assistant",
        businessContext,
      });

      // Emit AI response to room
      io.to(roomId).emit("receive_message", aiMessage);
    } catch (error) {
      console.error("Error processing message:", error);
      socket.emit("error", { message: "Error processing your message" });
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
