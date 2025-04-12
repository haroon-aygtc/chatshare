import followupService from "../services/followup.service.js";

class FollowUpController {
  /**
   * Get all follow-up questions with pagination
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getAllFollowUps(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const businessContext = req.query.businessContext || null;

      const result = await followupService.getAllFollowUps(
        page,
        limit,
        businessContext,
      );

      res.json(result);
    } catch (error) {
      console.error("Error getting follow-up questions:", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  /**
   * Get follow-up question by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getFollowUpById(req, res) {
    try {
      const { id } = req.params;

      const followUp = await followupService.getFollowUpById(id);

      res.json(followUp);
    } catch (error) {
      console.error("Error getting follow-up question:", error);
      if (error.message === "Follow-up question not found") {
        return res
          .status(404)
          .json({ message: "Follow-up question not found" });
      }
      res.status(500).json({ message: "Server error" });
    }
  }

  /**
   * Get follow-up questions by business context
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getFollowUpsByBusinessContext(req, res) {
    try {
      const { businessContext } = req.params;

      const followUps =
        await followupService.getFollowUpsByBusinessContext(businessContext);

      res.json({
        followUps,
        count: followUps.length,
      });
    } catch (error) {
      console.error(
        "Error getting follow-up questions by business context:",
        error,
      );
      res.status(500).json({ message: "Server error" });
    }
  }

  /**
   * Create a new follow-up question
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async createFollowUp(req, res) {
    try {
      const {
        question,
        businessContext,
        responseType = "prompt",
        predefinedResponse,
        promptTemplate,
        knowledgeBaseId,
        position = "end",
        customMarker,
        isActive = true,
      } = req.body;

      // Validate input
      if (!question || !businessContext) {
        return res.status(400).json({
          message: "Question and business context are required",
        });
      }

      // Validate response type specific fields
      if (responseType === "predefined" && !predefinedResponse) {
        return res.status(400).json({
          message:
            'Predefined response is required for response type "predefined"',
        });
      }

      if (responseType === "prompt" && !promptTemplate) {
        return res.status(400).json({
          message: 'Prompt template is required for response type "prompt"',
        });
      }

      if (responseType === "knowledge_base" && !knowledgeBaseId) {
        return res.status(400).json({
          message:
            'Knowledge base ID is required for response type "knowledge_base"',
        });
      }

      // Validate position
      if (position === "custom" && !customMarker) {
        return res.status(400).json({
          message: 'Custom marker is required for position "custom"',
        });
      }

      // Create follow-up question
      const followUp = await followupService.createFollowUp({
        question,
        businessContext,
        responseType,
        predefinedResponse,
        promptTemplate,
        knowledgeBaseId,
        position,
        customMarker,
        isActive,
      });

      res.status(201).json({
        message: "Follow-up question created successfully",
        followUp,
      });
    } catch (error) {
      console.error("Error creating follow-up question:", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  /**
   * Update a follow-up question
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateFollowUp(req, res) {
    try {
      const { id } = req.params;
      const {
        question,
        businessContext,
        responseType,
        predefinedResponse,
        promptTemplate,
        knowledgeBaseId,
        position,
        customMarker,
        isActive,
      } = req.body;

      // Update follow-up question
      const updatedFollowUp = await followupService.updateFollowUp(id, {
        question,
        businessContext,
        responseType,
        predefinedResponse,
        promptTemplate,
        knowledgeBaseId,
        position,
        customMarker,
        isActive,
      });

      res.json({
        message: "Follow-up question updated successfully",
        followUp: updatedFollowUp,
      });
    } catch (error) {
      console.error("Error updating follow-up question:", error);
      if (error.message === "Follow-up question not found") {
        return res
          .status(404)
          .json({ message: "Follow-up question not found" });
      }
      res.status(500).json({ message: "Server error" });
    }
  }

  /**
   * Delete a follow-up question
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async deleteFollowUp(req, res) {
    try {
      const { id } = req.params;

      // Delete the follow-up question
      const deleted = await followupService.deleteFollowUp(id);

      if (!deleted) {
        return res
          .status(404)
          .json({ message: "Follow-up question not found" });
      }

      res.json({ message: "Follow-up question deleted successfully" });
    } catch (error) {
      console.error("Error deleting follow-up question:", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  /**
   * Process a follow-up question
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async processFollowUp(req, res) {
    try {
      const { id } = req.params;

      const response = await followupService.processFollowUp(id);

      res.json(response);
    } catch (error) {
      console.error("Error processing follow-up question:", error);
      if (error.message === "Follow-up question not found") {
        return res
          .status(404)
          .json({ message: "Follow-up question not found" });
      }
      res.status(500).json({ message: "Server error" });
    }
  }
}
