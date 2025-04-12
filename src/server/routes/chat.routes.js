import express from "express";
import { authenticateJWT } from "../middleware/auth.middleware.js";
import chatController from "../controllers/chat.controller.js";

const router = express.Router();

/**
 * @route POST /api/chat/session
 * @desc Create a new chat session
 * @access Public
 */
router.post("/session", chatController.createSession);

/**
 * @route GET /api/chat/session/:roomId
 * @desc Get a chat session by room ID
 * @access Public
 */
router.get("/session/:roomId", chatController.getSession);

/**
 * @route GET /api/chat/messages/:roomId
 * @desc Get messages for a chat session
 * @access Public
 */
router.get("/messages/:roomId", chatController.getMessages);

/**
 * @route POST /api/chat/message
 * @desc Send a message (REST API alternative to WebSocket)
 * @access Public
 */
router.post("/message", chatController.sendMessage);

/**
 * @route DELETE /api/chat/session/:roomId
 * @desc Delete a chat session and its messages
 * @access Protected
 */
router.delete(
  "/session/:roomId",
  authenticateJWT,
  chatController.deleteSession,
);

export default router;
