import express from "express";
import followupController from "../controllers/followup.controller.js";
import { authenticateJWT, isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @route GET /api/followups
 * @desc Get all follow-up questions with pagination
 * @access Protected (Admin)
 */
router.get("/", authenticateJWT, isAdmin, followupController.getAllFollowUps);

/**
 * @route GET /api/followups/:id
 * @desc Get follow-up question by ID
 * @access Protected (Admin)
 */
router.get(
  "/:id",
  authenticateJWT,
  isAdmin,
  followupController.getFollowUpById,
);

/**
 * @route GET /api/followups/business/:businessContext
 * @desc Get follow-up questions by business context
 * @access Public
 */
router.get(
  "/business/:businessContext",
  followupController.getFollowUpsByBusinessContext,
);

/**
 * @route POST /api/followups
 * @desc Create a new follow-up question
 * @access Protected (Admin)
 */
router.post("/", authenticateJWT, isAdmin, followupController.createFollowUp);

/**
 * @route PUT /api/followups/:id
 * @desc Update a follow-up question
 * @access Protected (Admin)
 */
router.put("/:id", authenticateJWT, isAdmin, followupController.updateFollowUp);

/**
 * @route DELETE /api/followups/:id
 * @desc Delete a follow-up question
 * @access Protected (Admin)
 */
router.delete(
  "/:id",
  authenticateJWT,
  isAdmin,
  followupController.deleteFollowUp,
);

export default router;
