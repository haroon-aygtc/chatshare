import express from "express";
import authRoutes from "./auth.routes.js";
import chatRoutes from "./chat.routes.js";
import contextRoutes from "./context.routes.js";
import templateRoutes from "./template.routes.js";
import formatRoutes from "./format.routes.js";
import followupRoutes from "./followup.routes.js";
import adminRoutes from "./admin.routes.js";
import { authenticateJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes
router.use("/auth", authRoutes);
router.use("/chat", chatRoutes);
router.use("/contexts/business", contextRoutes); // Only the business context endpoint is public
router.use("/templates/default", templateRoutes); // Only the default template endpoint is public
router.use("/formats/default", formatRoutes); // Only the default format endpoint is public
router.use("/formats/format-response", formatRoutes); // Format response endpoint is public
router.use("/followups/business", followupRoutes); // Only the business context endpoint is public

// Protected routes
router.use("/contexts", authenticateJWT, contextRoutes);
router.use("/templates", authenticateJWT, templateRoutes);
router.use("/formats", authenticateJWT, formatRoutes);
router.use("/followups", authenticateJWT, followupRoutes);
router.use("/admin", authenticateJWT, adminRoutes);

export default router;
