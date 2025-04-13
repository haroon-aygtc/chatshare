import express from "express";
import formatController from "../controllers/format.controller.js";
import { authenticateJWT, isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @route GET /api/formats
 * @desc Get all response formats with pagination
 * @access Protected (Admin)
 */
router.get("/", authenticateJWT, isAdmin, formatController.getAllFormats);

/**
 * @route GET /api/formats/:id
 * @desc Get response format by ID
 * @access Protected (Admin)
 */
router.get("/:id", authenticateJWT, isAdmin, formatController.getFormatById);

/**
 * @route GET /api/formats/business/:businessContext
 * @desc Get response formats by business context
 * @access Protected (Admin)
 */
router.get(
  "/business/:businessContext",
  authenticateJWT,
  isAdmin,
  formatController.getFormatsByBusinessContext,
);

/**
 * @route GET /api/formats/default/:businessContext
 * @desc Get default response format for a business context
 * @access Public
 */
router.get("/default/:businessContext", formatController.getDefaultFormat);

/**
 * @route POST /api/formats
 * @desc Create a new response format
 * @access Protected (Admin)
 */
router.post("/", authenticateJWT, isAdmin, formatController.createFormat);

/**
 * @route PUT /api/formats/:id
 * @desc Update a response format
 * @access Protected (Admin)
 */
router.put("/:id", authenticateJWT, isAdmin, formatController.updateFormat);

/**
 * @route DELETE /api/formats/:id
 * @desc Delete a response format
 * @access Protected (Admin)
 */
router.delete("/:id", authenticateJWT, isAdmin, formatController.deleteFormat);

/**
 * @route POST /api/formats/format-response
 * @desc Format a response using a specific format
 * @access Public
 */
router.post("/format-response", formatController.formatResponse);

export default router;
