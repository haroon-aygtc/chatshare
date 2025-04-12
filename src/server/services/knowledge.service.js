import { KnowledgeBase } from "../models/index.js";
import { Op } from "sequelize";

class KnowledgeService {
  /**
   * Create a new knowledge base entry
   * @param {Object} knowledgeData - Knowledge base data
   * @returns {Promise<Object>} - Created knowledge base entry
   */
  async createKnowledgeEntry(knowledgeData) {
    try {
      const entry = await KnowledgeBase.create(knowledgeData);
      return entry.toJSON();
    } catch (error) {
      console.error("Error creating knowledge base entry:", error);
      throw error;
    }
  }

  /**
   * Get all knowledge base entries with pagination
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @param {string} businessContext - Business context filter
   * @returns {Promise<Object>} - Knowledge base entries with pagination info
   */
  async getAllKnowledgeEntries(page = 1, limit = 10, businessContext = null) {
    try {
      const offset = (page - 1) * limit;

      const whereClause = {};
      if (businessContext) {
        whereClause.businessContext = businessContext;
      }

      const { count, rows } = await KnowledgeBase.findAndCountAll({
        where: whereClause,
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      });

      return {
        entries: rows,
        pagination: {
          total: count,
          page,
          limit,
          pages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      console.error("Error getting knowledge base entries:", error);
      throw error;
    }
  }

  /**
   * Get knowledge base entry by ID
   * @param {number} id - Knowledge base entry ID
   * @returns {Promise<Object>} - Knowledge base entry
   */
  async getKnowledgeEntryById(id) {
    try {
      const entry = await KnowledgeBase.findByPk(id);
      if (!entry) {
        throw new Error("Knowledge base entry not found");
      }
      return entry.toJSON();
    } catch (error) {
      console.error("Error getting knowledge base entry by ID:", error);
      throw error;
    }
  }

  /**
   * Update knowledge base entry
   * @param {number} id - Knowledge base entry ID
   * @param {Object} knowledgeData - Updated knowledge base data
   * @returns {Promise<Object>} - Updated knowledge base entry
   */
  async updateKnowledgeEntry(id, knowledgeData) {
    try {
      const entry = await KnowledgeBase.findByPk(id);
      if (!entry) {
        throw new Error("Knowledge base entry not found");
      }

      await entry.update(knowledgeData);
      return entry.toJSON();
    } catch (error) {
      console.error("Error updating knowledge base entry:", error);
      throw error;
    }
  }

  /**
   * Delete knowledge base entry
   * @param {number} id - Knowledge base entry ID
   * @returns {Promise<boolean>} - Success status
   */
  async deleteKnowledgeEntry(id) {
    try {
      const entry = await KnowledgeBase.findByPk(id);
      if (!entry) {
        throw new Error("Knowledge base entry not found");
      }

      await entry.destroy();
      return true;
    } catch (error) {
      console.error("Error deleting knowledge base entry:", error);
      throw error;
    }
  }

  /**
   * Search knowledge base for relevant entries
   * @param {string} query - Search query
   * @param {string} businessContext - Business context
   * @returns {Promise<Array>} - Matching knowledge base entries
   */
  async searchKnowledgeBase(query, businessContext = "general") {
    try {
      // Split query into keywords
      const keywords = query.toLowerCase().split(/\s+/);

      // Find entries that match the business context and contain any of the keywords
      const entries = await KnowledgeBase.findAll({
        where: {
          businessContext,
          isActive: true,
          [Op.or]: [
            // Search in title
            {
              title: {
                [Op.like]: `%${query}%`,
              },
            },
            // Search in content
            {
              content: {
                [Op.like]: `%${query}%`,
              },
            },
            // Search in keywords
            sequelize.literal(`JSON_CONTAINS(keywords, '"${query}"')`),
          ],
        },
        limit: 5,
      });

      return entries.map((entry) => entry.toJSON());
    } catch (error) {
      console.error("Error searching knowledge base:", error);
      throw error;
    }
  }
}

export default new KnowledgeService();
