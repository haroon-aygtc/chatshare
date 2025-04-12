import express from "express";
import { authenticateJWT, isAdmin } from "../middleware/auth.middleware.js";
import contextController from "../controllers/context.controller.js";

const router = express.Router();

/**
 * @route GET /api/contexts
 * @desc Get all context rules with pagination
 * @access Protected (Admin)
 */
router.get("/", authenticateJWT, isAdmin, contextController.getAllContextRules);

/**
 * @route GET /api/contexts/business/:businessContext
 * @desc Get context rules by business context
 * @access Public
 */
router.get(
  "/business/:businessContext",
  contextController.getContextRulesByBusiness,
);

/**
 * @route POST /api/contexts
 * @desc Create a new context rule
 * @access Protected (Admin)
 */
router.post("/", authenticateJWT, isAdmin, contextController.createContextRule);

/**
 * @route PUT /api/contexts/:id
 * @desc Update a context rule
 * @access Protected (Admin)
 */
router.put(
  "/:id",
  authenticateJWT,
  isAdmin,
  contextController.updateContextRule,
);

/**
 * @route DELETE /api/contexts/:id
 * @desc Delete a context rule
 * @access Protected (Admin)
 */
router.delete(
  "/:id",
  authenticateJWT,
  isAdmin,
  contextController.deleteContextRule,
);

export default router;
