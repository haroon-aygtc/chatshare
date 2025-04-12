import { ResponseTemplate } from "../models/index.js";
import { Op } from "sequelize";

class TemplateService {
  /**
   * Create a new response template
   * @param {Object} templateData - Response template data
   * @returns {Promise<Object>} - Created response template
   */
  async createTemplate(templateData) {
    try {
      // If setting this template as default, unset any other default templates for this business context
      if (templateData.isDefault) {
        await ResponseTemplate.update(
          { isDefault: false },
          {
            where: {
              businessContext: templateData.businessContext,
              isDefault: true,
            },
          },
        );
      }

      const template = await ResponseTemplate.create(templateData);
      return template.toJSON();
    } catch (error) {
      console.error("Error creating response template:", error);
      throw error;
    }
  }

  /**
   * Get all response templates with pagination
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @param {string} businessContext - Business context filter
   * @returns {Promise<Object>} - Response templates with pagination info
   */
  async getAllTemplates(page = 1, limit = 10, businessContext = null) {
    try {
      const offset = (page - 1) * limit;

      const whereClause = {};
      if (businessContext) {
        whereClause.businessContext = businessContext;
      }

      const { count, rows } = await ResponseTemplate.findAndCountAll({
        where: whereClause,
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      });

      return {
        templates: rows.map((template) => template.toJSON()),
        pagination: {
          total: count,
          page,
          limit,
          pages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      console.error("Error getting response templates:", error);
      throw error;
    }
  }

  /**
   * Get response template by ID
   * @param {number} id - Response template ID
   * @returns {Promise<Object>} - Response template
   */
  async getTemplateById(id) {
    try {
      const template = await ResponseTemplate.findByPk(id);
      if (!template) {
        throw new Error("Response template not found");
      }
      return template.toJSON();
    } catch (error) {
      console.error("Error getting response template by ID:", error);
      throw error;
    }
  }

  /**
   * Get templates by business context
   * @param {string} businessContext - Business context
   * @returns {Promise<Array>} - Templates for the business context
   */
  async getTemplatesByBusinessContext(businessContext) {
    try {
      const templates = await ResponseTemplate.findAll({
        where: {
          businessContext,
          isActive: true,
        },
        order: [["createdAt", "DESC"]],
      });

      return templates.map((template) => template.toJSON());
    } catch (error) {
      console.error("Error getting templates by business context:", error);
      throw error;
    }
  }

  /**
   * Get default response template for a business context
   * @param {string} businessContext - Business context
   * @returns {Promise<Object>} - Default response template
   */
  async getDefaultTemplate(businessContext) {
    try {
      const template = await ResponseTemplate.findOne({
        where: {
          businessContext,
          isDefault: true,
          isActive: true,
        },
      });

      return template ? template.toJSON() : null;
    } catch (error) {
      console.error("Error getting default response template:", error);
      throw error;
    }
  }

  /**
   * Update response template
   * @param {number} id - Response template ID
   * @param {Object} templateData - Updated response template data
   * @returns {Promise<Object>} - Updated response template
   */
  async updateTemplate(id, templateData) {
    try {
      const template = await ResponseTemplate.findByPk(id);
      if (!template) {
        throw new Error("Response template not found");
      }

      // If setting this template as default, unset any other default templates for this business context
      if (templateData.isDefault) {
        await ResponseTemplate.update(
          { isDefault: false },
          {
            where: {
              businessContext:
                templateData.businessContext || template.businessContext,
              isDefault: true,
              id: { [Op.ne]: id },
            },
          },
        );
      }

      await template.update(templateData);
      return template.toJSON();
    } catch (error) {
      console.error("Error updating response template:", error);
      throw error;
    }
  }

  /**
   * Delete response template
   * @param {number} id - Response template ID
   * @returns {Promise<boolean>} - Success status
   */
  async deleteTemplate(id) {
    try {
      const template = await ResponseTemplate.findByPk(id);
      if (!template) {
        throw new Error("Response template not found");
      }

      await template.destroy();
      return true;
    } catch (error) {
      console.error("Error deleting response template:", error);
      throw error;
    }
  }

  /**
   * Validate template JSON structure
   * @param {string} templateJson - Template JSON string
   * @returns {Object} - Validation result
   */
  validateTemplateJson(templateJson) {
    try {
      const template = JSON.parse(templateJson);

      // Basic validation for standard template
      if (template.title && typeof template.title !== "string") {
        return { isValid: false, error: "Title must be a string" };
      }

      if (template.intro && typeof template.intro !== "string") {
        return { isValid: false, error: "Intro must be a string" };
      }

      if (template.content_blocks && !Array.isArray(template.content_blocks)) {
        return { isValid: false, error: "Content blocks must be an array" };
      }

      if (template.faq && !Array.isArray(template.faq)) {
        return { isValid: false, error: "FAQ must be an array" };
      }

      if (template.actions && !Array.isArray(template.actions)) {
        return { isValid: false, error: "Actions must be an array" };
      }

      if (template.disclaimer && typeof template.disclaimer !== "string") {
        return { isValid: false, error: "Disclaimer must be a string" };
      }

      return { isValid: true };
    } catch (error) {
      return { isValid: false, error: "Invalid JSON format" };
    }
  }
}

export default new TemplateService();
