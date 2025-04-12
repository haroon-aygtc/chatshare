const contextRuleModel = require("../models/contextRuleModel");

class ContextController {
  /**
   * Get all context rules with pagination
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getAllContextRules(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const result = await contextRuleModel.getAll(page, limit);

      res.json(result);
    } catch (error) {
      console.error("Error getting context rules:", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  /**
   * Get context rules by business context
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getContextRulesByBusiness(req, res) {
    try {
      const { businessContext } = req.params;

      const contextRule =
        await contextRuleModel.findByBusinessContext(businessContext);

      if (!contextRule) {
        return res.status(404).json({ message: "Context rule not found" });
      }

      res.json(contextRule);
    } catch (error) {
      console.error("Error getting context rule by business:", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  /**
   * Create a new context rule
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async createContextRule(req, res) {
    try {
      const {
        name,
        business_context,
        allowed_topics = [],
        restricted_topics = [],
        ai_model = "gemini",
        prompt_template,
        is_active = true,
      } = req.body;

      // Validate input
      if (!name || !business_context || !prompt_template) {
        return res.status(400).json({
          message: "Name, business context, and prompt template are required",
        });
      }

      // Check if context rule with this business context already exists
      const existingRule =
        await contextRuleModel.findByBusinessContext(business_context);
      if (existingRule) {
        return res.status(400).json({
          message: "Context rule with this business context already exists",
        });
      }

      // Create context rule
      const contextRule = await contextRuleModel.create({
        name,
        business_context,
        allowed_topics,
        restricted_topics,
        ai_model,
        prompt_template,
        is_active,
      });

      res.status(201).json({
        message: "Context rule created successfully",
        contextRule,
      });
    } catch (error) {
      console.error("Error creating context rule:", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  /**
   * Update a context rule
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateContextRule(req, res) {
    try {
      const { id } = req.params;
      const {
        name,
        business_context,
        allowed_topics,
        restricted_topics,
        ai_model,
        prompt_template,
        is_active,
      } = req.body;

      // Check if context rule exists
      const existingRule = await contextRuleModel.findById(id);
      if (!existingRule) {
        return res.status(404).json({ message: "Context rule not found" });
      }

      // If business context is being changed, check if new one already exists
      if (
        business_context &&
        business_context !== existingRule.business_context
      ) {
        const duplicateRule =
          await contextRuleModel.findByBusinessContext(business_context);
        if (duplicateRule) {
          return res.status(400).json({
            message: "Context rule with this business context already exists",
          });
        }
      }

      // Update context rule
      await contextRuleModel.update(id, {
        name,
        business_context,
        allowed_topics,
        restricted_topics,
        ai_model,
        prompt_template,
        is_active,
      });

      // Get updated rule
      const updatedRule = await contextRuleModel.findById(id);

      res.json({
        message: "Context rule updated successfully",
        contextRule: updatedRule,
      });
    } catch (error) {
      console.error("Error updating context rule:", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  /**
   * Delete a context rule
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async deleteContextRule(req, res) {
    try {
      const { id } = req.params;

      // Delete the context rule
      const deleted = await contextRuleModel.delete(id);

      if (!deleted) {
        return res.status(404).json({ message: "Context rule not found" });
      }

      res.json({ message: "Context rule deleted successfully" });
    } catch (error) {
      console.error("Error deleting context rule:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
}

module.exports = new ContextController();
