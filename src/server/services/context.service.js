import { ContextRule } from "../models/index.js";

/**
 * Create a new context rule
 * @param {Object} contextData - The context rule data
 * @returns {Promise<Object>} - The created context rule
 */
export const createContextRule = async (contextData) => {
  try {
    const contextRule = await ContextRule.create(contextData);
    return contextRule.toJSON();
  } catch (error) {
    console.error("Error creating context rule:", error);
    throw error;
  }
};

/**
 * Get context rules by business context
 * @param {string} businessContext - The business context
 * @returns {Promise<Object>} - The context rules
 */
export const getContextRulesByBusiness = async (businessContext) => {
  try {
    const contextRule = await ContextRule.findOne({
      where: {
        businessContext,
        isActive: true,
      },
    });

    return contextRule ? contextRule.toJSON() : null;
  } catch (error) {
    console.error("Error getting context rules by business:", error);
    throw error;
  }
};

/**
 * Update a context rule
 * @param {string} id - The context rule ID
 * @param {Object} contextData - The updated context rule data
 * @returns {Promise<Object>} - The updated context rule
 */
export const updateContextRule = async (id, contextData) => {
  try {
    const [updated] = await ContextRule.update(contextData, {
      where: { id },
    });

    if (updated) {
      const updatedContextRule = await ContextRule.findByPk(id);
      return updatedContextRule.toJSON();
    }

    throw new Error("Context rule not found");
  } catch (error) {
    console.error("Error updating context rule:", error);
    throw error;
  }
};

/**
 * Delete a context rule
 * @param {string} id - The context rule ID
 * @returns {Promise<boolean>} - Whether the context rule was deleted
 */
export const deleteContextRule = async (id) => {
  try {
    const deleted = await ContextRule.destroy({
      where: { id },
    });

    return !!deleted;
  } catch (error) {
    console.error("Error deleting context rule:", error);
    throw error;
  }
};

/**
 * Get all context rules with pagination
 * @param {number} page - The page number
 * @param {number} limit - The number of context rules per page
 * @returns {Promise<Object>} - The context rules and pagination info
 */
export const getAllContextRules = async (page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;

    const { count, rows } = await ContextRule.findAndCountAll({
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    return {
      contextRules: rows,
      totalContextRules: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    };
  } catch (error) {
    console.error("Error getting all context rules:", error);
    throw error;
  }
};

export default {
  createContextRule,
  getContextRulesByBusiness,
  updateContextRule,
  deleteContextRule,
  getAllContextRules,
};
