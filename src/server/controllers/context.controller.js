import contextService from "../services/context.service.js";

/**
 * Get all context rules with pagination
 */
export const getAllContextRules = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await contextService.getAllContextRules(page, limit);

    res.json(result);
  } catch (error) {
    console.error("Error getting context rules:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get context rules by business context
 */
export const getContextRulesByBusiness = async (req, res) => {
  try {
    const { businessContext } = req.params;

    const contextRule =
      await contextService.getContextRulesByBusiness(businessContext);

    if (!contextRule) {
      return res.status(404).json({ message: "Context rule not found" });
    }

    res.json(contextRule);
  } catch (error) {
    console.error("Error getting context rule by business:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Create a new context rule
 */
export const createContextRule = async (req, res) => {
  try {
    const contextRule = await contextService.createContextRule(req.body);

    res.status(201).json({
      message: "Context rule created successfully",
      contextRule,
    });
  } catch (error) {
    console.error("Error creating context rule:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Update a context rule
 */
export const updateContextRule = async (req, res) => {
  try {
    const { id } = req.params;

    const contextRule = await contextService.updateContextRule(id, req.body);

    res.json({
      message: "Context rule updated successfully",
      contextRule,
    });
  } catch (error) {
    console.error("Error updating context rule:", error);
    if (error.message === "Context rule not found") {
      return res.status(404).json({ message: "Context rule not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Delete a context rule
 */
export const deleteContextRule = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await contextService.deleteContextRule(id);

    if (!deleted) {
      return res.status(404).json({ message: "Context rule not found" });
    }

    res.json({ message: "Context rule deleted successfully" });
  } catch (error) {
    console.error("Error deleting context rule:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export default {
  getAllContextRules,
  getContextRulesByBusiness,
  createContextRule,
  updateContextRule,
  deleteContextRule,
};
