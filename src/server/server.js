const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const compression = require("compression");
const path = require("path");
require("dotenv").config();

const routes = require("./routes");
const setupChatHandlers = require("./socket/chatSocket");
const { testConnection } = require("./database/config");

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  }),
);

// Parse cookies, JSON and URL-encoded data
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Compress responses
app.use(compression());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "../../public")));

// API routes
app.use("/api", routes);

// Serve the embed script
app.get("/embed/chat-loader.js", (req, res) => {
  res.sendFile(path.join(__dirname, "../embed/chat-loader.js"));
});

// Serve the embed demo page
app.get("/embed/demo", (req, res) => {
  res.sendFile(path.join(__dirname, "../embed/embed.html"));
});

// Catch-all route to serve the React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/index.html"));
});

// Socket.IO setup
setupChatHandlers(io);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  // Test database connection
  await testConnection();
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});

module.exports = server;
