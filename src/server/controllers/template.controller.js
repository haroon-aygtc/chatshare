import templateService from "../services/template.service.js";

class TemplateController {
  /**
   * Get all prompt templates with pagination
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getAllTemplates(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const businessContext = req.query.businessContext || null;

      const result = await templateService.getAllTemplates(
        page,
        limit,
        businessContext,
      );

      res.json(result);
    } catch (error) {
      console.error("Error getting prompt templates:", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  /**
   * Get prompt template by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getTemplateById(req, res) {
    try {
      const { id } = req.params;

      const template = await templateService.getTemplateById(id);

      res.json(template);
    } catch (error) {
      console.error("Error getting prompt template:", error);
      if (error.message === "Prompt template not found") {
        return res.status(404).json({ message: "Prompt template not found" });
      }
      res.status(500).json({ message: "Server error" });
    }
  }

  /**
   * Get prompt templates by business context
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getTemplatesByBusinessContext(req, res) {
    try {
      const { businessContext } = req.params;

      const templates =
        await templateService.getTemplatesByBusinessContext(businessContext);

      res.json({
        templates,
        count: templates.length,
      });
    } catch (error) {
      console.error(
        "Error getting prompt templates by business context:",
        error,
      );
      res.status(500).json({ message: "Server error" });
    }
  }

  /**
   * Get default prompt template for a business context
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getDefaultTemplate(req, res) {
    try {
      const { businessContext } = req.params;

      const template =
        await templateService.getDefaultTemplate(businessContext);

      if (!template) {
        return res.status(404).json({
          message: "No default prompt template found for this business context",
        });
      }

      res.json(template);
    } catch (error) {
      console.error("Error getting default prompt template:", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  /**
   * Create a new prompt template
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async createTemplate(req, res) {
    try {
      const {
        name,
        businessContext,
        template,
        description,
        isDefault = false,
        isActive = true,
      } = req.body;

      // Validate input
      if (!name || !businessContext || !template) {
        return res.status(400).json({
          message: "Name, business context, and template are required",
        });
      }

      // Create prompt template
      const promptTemplate = await templateService.createTemplate({
        name,
        businessContext,
        template,
        description,
        isDefault,
        isActive,
      });

      res.status(201).json({
        message: "Prompt template created successfully",
        template: promptTemplate,
      });
    } catch (error) {
      console.error("Error creating prompt template:", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  /**
   * Update a prompt template
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateTemplate(req, res) {
    try {
      const { id } = req.params;
      const {
        name,
        businessContext,
        template,
        description,
        isDefault,
        isActive,
      } = req.body;

      // Update prompt template
      const updatedTemplate = await templateService.updateTemplate(id, {
        name,
        businessContext,
        template,
        description,
        isDefault,
        isActive,
      });

      res.json({
        message: "Prompt template updated successfully",
        template: updatedTemplate,
      });
    } catch (error) {
      console.error("Error updating prompt template:", error);
      if (error.message === "Prompt template not found") {
        return res.status(404).json({ message: "Prompt template not found" });
      }
      res.status(500).json({ message: "Server error" });
    }
  }

  /**
   * Delete a prompt template
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async deleteTemplate(req, res) {
    try {
      const { id } = req.params;

      // Delete the prompt template
      const deleted = await templateService.deleteTemplate(id);

      if (!deleted) {
        return res.status(404).json({ message: "Prompt template not found" });
      }

      res.json({ message: "Prompt template deleted successfully" });
    } catch (error) {
      console.error("Error deleting prompt template:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
}

export default new TemplateController();
