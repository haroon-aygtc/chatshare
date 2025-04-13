import formatService from "../services/format.service.js";

class FormatController {
  /**
   * Get all response formats with pagination
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getAllFormats(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const businessContext = req.query.businessContext || null;

      const result = await formatService.getAllFormats(
        page,
        limit,
        businessContext,
      );

      res.json(result);
    } catch (error) {
      console.error("Error getting response formats:", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  /**
   * Get response format by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getFormatById(req, res) {
    try {
      const { id } = req.params;

      const format = await formatService.getFormatById(id);

      res.json(format);
    } catch (error) {
      console.error("Error getting response format:", error);
      if (error.message === "Response format not found") {
        return res.status(404).json({ message: "Response format not found" });
      }
      res.status(500).json({ message: "Server error" });
    }
  }

  /**
   * Get response formats by business context
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getFormatsByBusinessContext(req, res) {
    try {
      const { businessContext } = req.params;

      const formats =
        await formatService.getFormatsByBusinessContext(businessContext);

      res.json({
        formats,
        count: formats.length,
      });
    } catch (error) {
      console.error(
        "Error getting response formats by business context:",
        error,
      );
      res.status(500).json({ message: "Server error" });
    }
  }

  /**
   * Get default response format for a business context
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getDefaultFormat(req, res) {
    try {
      const { businessContext } = req.params;

      const format = await formatService.getDefaultFormat(businessContext);

      if (!format) {
        return res.status(404).json({
          message: "No default response format found for this business context",
        });
      }

      res.json(format);
    } catch (error) {
      console.error("Error getting default response format:", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  /**
   * Create a new response format
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async createFormat(req, res) {
    try {
      const {
        name,
        description,
        formatSchema,
        businessContext,
        isDefault = false,
        isActive = true,
      } = req.body;

      // Validate input
      if (!name || !formatSchema || !businessContext) {
        return res.status(400).json({
          message: "Name, format schema, and business context are required",
        });
      }

      // Create response format
      const format = await formatService.createFormat({
        name,
        description,
        formatSchema,
        businessContext,
        isDefault,
        isActive,
      });

      res.status(201).json({
        message: "Response format created successfully",
        format,
      });
    } catch (error) {
      console.error("Error creating response format:", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  /**
   * Update a response format
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateFormat(req, res) {
    try {
      const { id } = req.params;
      const {
        name,
        description,
        formatSchema,
        businessContext,
        isDefault,
        isActive,
      } = req.body;

      // Update response format
      const updatedFormat = await formatService.updateFormat(id, {
        name,
        description,
        formatSchema,
        businessContext,
        isDefault,
        isActive,
      });

      res.json({
        message: "Response format updated successfully",
        format: updatedFormat,
      });
    } catch (error) {
      console.error("Error updating response format:", error);
      if (error.message === "Response format not found") {
        return res.status(404).json({ message: "Response format not found" });
      }
      res.status(500).json({ message: "Server error" });
    }
  }

  /**
   * Delete a response format
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async deleteFormat(req, res) {
    try {
      const { id } = req.params;

      // Delete the response format
      const deleted = await formatService.deleteFormat(id);

      if (!deleted) {
        return res.status(404).json({ message: "Response format not found" });
      }

      res.json({ message: "Response format deleted successfully" });
    } catch (error) {
      console.error("Error deleting response format:", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  /**
   * Format a response using a specific format
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async formatResponse(req, res) {
    try {
      const { formatId, response, knowledgeSources, followUpQuestions } =
        req.body;

      if (!response) {
        return res.status(400).json({ message: "Response is required" });
      }

      let format = null;
      if (formatId) {
        format = await formatService.getFormatById(formatId);
      }

      const formattedResponse = formatService.formatResponse(
        response,
        format,
        knowledgeSources || [],
        followUpQuestions || [],
      );

      res.json(formattedResponse);
    } catch (error) {
      console.error("Error formatting response:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
}

export default new FormatController();
