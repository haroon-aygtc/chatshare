import express from "express";
import authRoutes from "./auth.routes.js";
import chatRoutes from "./chat.routes.js";
import contextRoutes from "./context.routes.js";
import templateRoutes from "./template.routes.js";
import adminRoutes from "./admin.routes.js";
import { authenticateJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes
router.use("/auth", authRoutes);
router.use("/chat", chatRoutes);
router.use("/contexts/business", contextRoutes); // Only the business context endpoint is public
router.use("/templates/default", templateRoutes); // Only the default template endpoint is public

// Protected routes
router.use("/contexts", authenticateJWT, contextRoutes);
router.use("/templates", authenticateJWT, templateRoutes);
router.use("/admin", authenticateJWT, adminRoutes);

export default router;
