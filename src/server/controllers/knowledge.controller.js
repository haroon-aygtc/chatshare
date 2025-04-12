import knowledgeService from "../services/knowledge.service.js";

class KnowledgeController {
  /**
   * Get all knowledge base entries with pagination
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getAllKnowledgeEntries(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const businessContext = req.query.businessContext || null;

      const result = await knowledgeService.getAllKnowledgeEntries(
        page,
        limit,
        businessContext,
      );

      res.json(result);
    } catch (error) {
      console.error("Error getting knowledge base entries:", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  /**
   * Get knowledge base entry by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getKnowledgeEntryById(req, res) {
    try {
      const { id } = req.params;

      const entry = await knowledgeService.getKnowledgeEntryById(id);

      res.json(entry);
    } catch (error) {
      console.error("Error getting knowledge base entry:", error);
      if (error.message === "Knowledge base entry not found") {
        return res
          .status(404)
          .json({ message: "Knowledge base entry not found" });
      }
      res.status(500).json({ message: "Server error" });
    }
  }

  /**
   * Create a new knowledge base entry
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async createKnowledgeEntry(req, res) {
    try {
      const {
        title,
        content,
        contentType = "markdown",
        tags = [],
        keywords = [],
        businessContext = "general",
        isActive = true,
      } = req.body;

      // Validate input
      if (!title || !content) {
        return res.status(400).json({
          message: "Title and content are required",
        });
      }

      // Create knowledge base entry
      const entry = await knowledgeService.createKnowledgeEntry({
        title,
        content,
        contentType,
        tags,
        keywords,
        businessContext,
        isActive,
      });

      res.status(201).json({
        message: "Knowledge base entry created successfully",
        entry,
      });
    } catch (error) {
      console.error("Error creating knowledge base entry:", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  /**
   * Update a knowledge base entry
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateKnowledgeEntry(req, res) {
    try {
      const { id } = req.params;
      const {
        title,
        content,
        contentType,
        tags,
        keywords,
        businessContext,
        isActive,
      } = req.body;

      // Update knowledge base entry
      const updatedEntry = await knowledgeService.updateKnowledgeEntry(id, {
        title,
        content,
        contentType,
        tags,
        keywords,
        businessContext,
        isActive,
      });

      res.json({
        message: "Knowledge base entry updated successfully",
        entry: updatedEntry,
      });
    } catch (error) {
      console.error("Error updating knowledge base entry:", error);
      if (error.message === "Knowledge base entry not found") {
        return res
          .status(404)
          .json({ message: "Knowledge base entry not found" });
      }
      res.status(500).json({ message: "Server error" });
    }
  }

  /**
   * Delete a knowledge base entry
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async deleteKnowledgeEntry(req, res) {
    try {
      const { id } = req.params;

      // Delete the knowledge base entry
      const deleted = await knowledgeService.deleteKnowledgeEntry(id);

      if (!deleted) {
        return res
          .status(404)
          .json({ message: "Knowledge base entry not found" });
      }

      res.json({ message: "Knowledge base entry deleted successfully" });
    } catch (error) {
      console.error("Error deleting knowledge base entry:", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  /**
   * Search knowledge base
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async searchKnowledgeBase(req, res) {
    try {
      const { query, businessContext = "general" } = req.query;

      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }

      const entries = await knowledgeService.searchKnowledgeBase(
        query,
        businessContext,
      );

      res.json({
        entries,
        count: entries.length,
      });
    } catch (error) {
      console.error("Error searching knowledge base:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
}

export default new KnowledgeController();
