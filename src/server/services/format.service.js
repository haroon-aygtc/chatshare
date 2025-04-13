import { ResponseFormat } from "../models/index.js";
import { Op } from "sequelize";

class FormatService {
  /**
   * Create a new response format
   * @param {Object} formatData - Response format data
   * @returns {Promise<Object>} - Created response format
   */
  async createFormat(formatData) {
    try {
      // If setting this format as default, unset any other default formats for this business context
      if (formatData.isDefault) {
        await ResponseFormat.update(
          { isDefault: false },
          {
            where: {
              businessContext: formatData.businessContext,
              isDefault: true,
            },
          },
        );
      }

      const format = await ResponseFormat.create(formatData);
      return format.toJSON();
    } catch (error) {
      console.error("Error creating response format:", error);
      throw error;
    }
  }

  /**
   * Get all response formats with pagination
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @param {string} businessContext - Business context filter
   * @returns {Promise<Object>} - Response formats with pagination info
   */
  async getAllFormats(page = 1, limit = 10, businessContext = null) {
    try {
      const offset = (page - 1) * limit;

      const whereClause = {};
      if (businessContext) {
        whereClause.businessContext = businessContext;
      }

      const { count, rows } = await ResponseFormat.findAndCountAll({
        where: whereClause,
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      });

      return {
        formats: rows.map((format) => format.toJSON()),
        pagination: {
          total: count,
          page,
          limit,
          pages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      console.error("Error getting response formats:", error);
      throw error;
    }
  }

  /**
   * Get response format by ID
   * @param {number} id - Response format ID
   * @returns {Promise<Object>} - Response format
   */
  async getFormatById(id) {
    try {
      const format = await ResponseFormat.findByPk(id);
      if (!format) {
        throw new Error("Response format not found");
      }
      return format.toJSON();
    } catch (error) {
      console.error("Error getting response format by ID:", error);
      throw error;
    }
  }

  /**
   * Get formats by business context
   * @param {string} businessContext - Business context
   * @returns {Promise<Array>} - Formats for the business context
   */
  async getFormatsByBusinessContext(businessContext) {
    try {
      const formats = await ResponseFormat.findAll({
        where: {
          businessContext,
          isActive: true,
        },
        order: [["createdAt", "DESC"]],
      });

      return formats.map((format) => format.toJSON());
    } catch (error) {
      console.error("Error getting formats by business context:", error);
      throw error;
    }
  }

  /**
   * Get default response format for a business context
   * @param {string} businessContext - Business context
   * @returns {Promise<Object>} - Default response format
   */
  async getDefaultFormat(businessContext) {
    try {
      const format = await ResponseFormat.findOne({
        where: {
          businessContext,
          isDefault: true,
          isActive: true,
        },
      });

      return format ? format.toJSON() : null;
    } catch (error) {
      console.error("Error getting default response format:", error);
      throw error;
    }
  }

  /**
   * Update response format
   * @param {number} id - Response format ID
   * @param {Object} formatData - Updated response format data
   * @returns {Promise<Object>} - Updated response format
   */
  async updateFormat(id, formatData) {
    try {
      const format = await ResponseFormat.findByPk(id);
      if (!format) {
        throw new Error("Response format not found");
      }

      // If setting this format as default, unset any other default formats for this business context
      if (formatData.isDefault) {
        await ResponseFormat.update(
          { isDefault: false },
          {
            where: {
              businessContext:
                formatData.businessContext || format.businessContext,
              isDefault: true,
              id: { [Op.ne]: id },
            },
          },
        );
      }

      await format.update(formatData);
      return format.toJSON();
    } catch (error) {
      console.error("Error updating response format:", error);
      throw error;
    }
  }

  /**
   * Delete response format
   * @param {number} id - Response format ID
   * @returns {Promise<boolean>} - Success status
   */
  async deleteFormat(id) {
    try {
      const format = await ResponseFormat.findByPk(id);
      if (!format) {
        throw new Error("Response format not found");
      }

      await format.destroy();
      return true;
    } catch (error) {
      console.error("Error deleting response format:", error);
      throw error;
    }
  }

  /**
   * Format an AI response according to a response format
   * @param {string} aiResponse - Raw AI response text
   * @param {Object} format - Response format object
   * @param {Array} knowledgeSources - Knowledge sources used in the response
   * @param {Array} followUpQuestions - Follow-up questions to include
   * @returns {Object} - Formatted response
   */
  formatResponse(
    aiResponse,
    format,
    knowledgeSources = [],
    followUpQuestions = [],
  ) {
    try {
      if (!format || !format.formatSchema) {
        // Return a basic format if no format is provided
        return {
          content: aiResponse,
          sources: knowledgeSources.map((source) => ({
            title: source.title,
            id: source.id,
          })),
          followUpQuestions: followUpQuestions,
        };
      }

      const schema = format.formatSchema;
      const formatted = {
        ...schema,
        content: aiResponse,
      };

      // Add title if specified in schema
      if (schema.title) {
        formatted.title = schema.title;
      }

      // Add intro if specified in schema
      if (schema.intro) {
        formatted.intro = schema.intro;
      }

      // Add sources if available
      if (knowledgeSources && knowledgeSources.length > 0) {
        formatted.sources = knowledgeSources.map((source) => ({
          title: source.title,
          id: source.id,
        }));
      }

      // Add follow-up questions if available
      if (followUpQuestions && followUpQuestions.length > 0) {
        formatted.followUpQuestions = followUpQuestions;
      }

      // Add disclaimer if specified in schema
      if (schema.disclaimer) {
        formatted.disclaimer = schema.disclaimer;
      }

      return formatted;
    } catch (error) {
      console.error("Error formatting response:", error);
      // Return the raw response if formatting fails
      return {
        content: aiResponse,
        sources: knowledgeSources.map((source) => ({
          title: source.title,
          id: source.id,
        })),
        followUpQuestions: followUpQuestions,
      };
    }
  }
}

export default new FormatService();
