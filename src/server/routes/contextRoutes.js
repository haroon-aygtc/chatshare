const express = require("express");
const contextController = require("../controllers/contextController");
const { authenticateJWT, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @route GET /api/contexts
 * @desc Get all context rules with pagination
 * @access Protected (Admin)
 */
router.get(
  "/",
  authenticateJWT,
  isAdmin,
  contextController.getAllContextRules.bind(contextController),
);

/**
 * @route GET /api/contexts/business/:businessContext
 * @desc Get context rules by business context
 * @access Public
 */
router.get(
  "/business/:businessContext",
  contextController.getContextRulesByBusiness.bind(contextController),
);

/**
 * @route POST /api/contexts
 * @desc Create a new context rule
 * @access Protected (Admin)
 */
router.post(
  "/",
  authenticateJWT,
  isAdmin,
  contextController.createContextRule.bind(contextController),
);

/**
 * @route PUT /api/contexts/:id
 * @desc Update a context rule
 * @access Protected (Admin)
 */
router.put(
  "/:id",
  authenticateJWT,
  isAdmin,
  contextController.updateContextRule.bind(contextController),
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
  contextController.deleteContextRule.bind(contextController),
);

module.exports = router;
