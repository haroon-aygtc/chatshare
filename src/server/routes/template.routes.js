import express from "express";
import templateController from "../controllers/template.controller.js";
import { authenticateJWT, isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @route GET /api/templates
 * @desc Get all prompt templates with pagination
 * @access Protected (Admin)
 */
router.get("/", authenticateJWT, isAdmin, templateController.getAllTemplates);

/**
 * @route GET /api/templates/:id
 * @desc Get prompt template by ID
 * @access Protected (Admin)
 */
router.get(
  "/:id",
  authenticateJWT,
  isAdmin,
  templateController.getTemplateById,
);

/**
 * @route GET /api/templates/business/:businessContext
 * @desc Get prompt templates by business context
 * @access Protected (Admin)
 */
router.get(
  "/business/:businessContext",
  authenticateJWT,
  isAdmin,
  templateController.getTemplatesByBusinessContext,
);

/**
 * @route GET /api/templates/default/:businessContext
 * @desc Get default prompt template for a business context
 * @access Public
 */
router.get("/default/:businessContext", templateController.getDefaultTemplate);

/**
 * @route POST /api/templates
 * @desc Create a new prompt template
 * @access Protected (Admin)
 */
router.post("/", authenticateJWT, isAdmin, templateController.createTemplate);

/**
 * @route PUT /api/templates/:id
 * @desc Update a prompt template
 * @access Protected (Admin)
 */
router.put("/:id", authenticateJWT, isAdmin, templateController.updateTemplate);

/**
 * @route DELETE /api/templates/:id
 * @desc Delete a prompt template
 * @access Protected (Admin)
 */
router.delete(
  "/:id",
  authenticateJWT,
  isAdmin,
  templateController.deleteTemplate,
);

export default router;
