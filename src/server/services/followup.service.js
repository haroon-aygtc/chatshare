import { FollowUpQuestion, KnowledgeBase } from "../models/index.js";

class FollowUpService {
  /**
   * Create a new follow-up question
   * @param {Object} followUpData - Follow-up question data
   * @returns {Promise<Object>} - Created follow-up question
   */
  async createFollowUp(followUpData) {
    try {
      const followUp = await FollowUpQuestion.create(followUpData);
      return followUp.toJSON();
    } catch (error) {
      console.error("Error creating follow-up question:", error);
      throw error;
    }
  }

  /**
   * Get all follow-up questions with pagination
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @param {string} businessContext - Business context filter
   * @returns {Promise<Object>} - Follow-up questions with pagination info
   */
  async getAllFollowUps(page = 1, limit = 10, businessContext = null) {
    try {
      const offset = (page - 1) * limit;

      const whereClause = {};
      if (businessContext) {
        whereClause.businessContext = businessContext;
      }

      const { count, rows } = await FollowUpQuestion.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: KnowledgeBase,
            attributes: ["id", "title"],
            required: false,
          },
        ],
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      });

      return {
        followUps: rows,
        pagination: {
          total: count,
          page,
          limit,
          pages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      console.error("Error getting follow-up questions:", error);
      throw error;
    }
  }

  /**
   * Get follow-up question by ID
   * @param {number} id - Follow-up question ID
   * @returns {Promise<Object>} - Follow-up question
   */
  async getFollowUpById(id) {
    try {
      const followUp = await FollowUpQuestion.findByPk(id, {
        include: [
          {
            model: KnowledgeBase,
            attributes: ["id", "title"],
            required: false,
          },
        ],
      });

      if (!followUp) {
        throw new Error("Follow-up question not found");
      }

      return followUp.toJSON();
    } catch (error) {
      console.error("Error getting follow-up question by ID:", error);
      throw error;
    }
  }

  /**
   * Get follow-up questions by business context
   * @param {string} businessContext - Business context
   * @returns {Promise<Array>} - Follow-up questions
   */
  async getFollowUpsByBusinessContext(businessContext) {
    try {
      const followUps = await FollowUpQuestion.findAll({
        where: {
          businessContext,
          isActive: true,
        },
        include: [
          {
            model: KnowledgeBase,
            attributes: ["id", "title"],
            required: false,
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      return followUps.map((followUp) => followUp.toJSON());
    } catch (error) {
      console.error(
        "Error getting follow-up questions by business context:",
        error,
      );
      throw error;
    }
  }

  /**
   * Update follow-up question
   * @param {number} id - Follow-up question ID
   * @param {Object} followUpData - Updated follow-up question data
   * @returns {Promise<Object>} - Updated follow-up question
   */
  async updateFollowUp(id, followUpData) {
    try {
      const followUp = await FollowUpQuestion.findByPk(id);
      if (!followUp) {
        throw new Error("Follow-up question not found");
      }

      await followUp.update(followUpData);

      // Fetch the updated follow-up with associations
      const updatedFollowUp = await FollowUpQuestion.findByPk(id, {
        include: [
          {
            model: KnowledgeBase,
            attributes: ["id", "title"],
            required: false,
          },
        ],
      });

      return updatedFollowUp.toJSON();
    } catch (error) {
      console.error("Error updating follow-up question:", error);
      throw error;
    }
  }

  /**
   * Delete follow-up question
   * @param {number} id - Follow-up question ID
   * @returns {Promise<boolean>} - Success status
   */
  async deleteFollowUp(id) {
    try {
      const followUp = await FollowUpQuestion.findByPk(id);
      if (!followUp) {
        throw new Error("Follow-up question not found");
      }

      await followUp.destroy();
      return true;
    } catch (error) {
      console.error("Error deleting follow-up question:", error);
      throw error;
    }
  }

  /**
   * Process follow-up question response
   * @param {number} id - Follow-up question ID
   * @returns {Promise<Object>} - Response data
   */
  async processFollowUp(id) {
    try {
      const followUp = await this.getFollowUpById(id);

      if (!followUp) {
        throw new Error("Follow-up question not found");
      }

      let response;

      switch (followUp.responseType) {
        case "predefined":
          response = {
            content: followUp.predefinedResponse,
            metadata: {
              source: "predefined",
              followUpId: followUp.id,
            },
          };
          break;

        case "knowledge_base":
          if (!followUp.knowledgeBaseId) {
            throw new Error(
              "Knowledge base ID not specified for this follow-up",
            );
          }

          const knowledgeEntry = await KnowledgeBase.findByPk(
            followUp.knowledgeBaseId,
          );

          if (!knowledgeEntry) {
            throw new Error("Knowledge base entry not found");
          }

          response = {
            content: knowledgeEntry.content,
            metadata: {
              source: "knowledge_base",
              followUpId: followUp.id,
              knowledgeBaseId: knowledgeEntry.id,
              title: knowledgeEntry.title,
            },
          };
          break;

        case "prompt":
          // This would typically call the AI service with the prompt template
          // For now, return the prompt template as a placeholder
          response = {
            content:
              "This would be processed by the AI using the prompt: " +
              followUp.promptTemplate,
            metadata: {
              source: "prompt",
              followUpId: followUp.id,
            },
          };
          break;

        default:
          throw new Error(`Unknown response type: ${followUp.responseType}`);
      }

      return response;
    } catch (error) {
      console.error("Error processing follow-up question:", error);
      throw error;
    }
  }
}

export default new FollowUpService();
