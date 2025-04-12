const { pool } = require("../database/config");

class ContextRuleModel {
  // Create a new context rule
  async create(ruleData) {
    const {
      name,
      business_context,
      allowed_topics = [],
      restricted_topics = [],
      ai_model = "gemini",
      prompt_template,
      is_active = true,
    } = ruleData;

    const query = `
      INSERT INTO context_rules 
      (name, business_context, allowed_topics, restricted_topics, ai_model, prompt_template, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    try {
      // Convert arrays to JSON strings
      const allowedTopicsJson = JSON.stringify(allowed_topics);
      const restrictedTopicsJson = JSON.stringify(restricted_topics);

      const [result] = await pool.execute(query, [
        name,
        business_context,
        allowedTopicsJson,
        restrictedTopicsJson,
        ai_model,
        prompt_template,
        is_active,
      ]);

      return {
        id: result.insertId,
        name,
        business_context,
        allowed_topics,
        restricted_topics,
        ai_model,
        prompt_template,
        is_active,
      };
    } catch (error) {
      throw error;
    }
  }

  // Find context rule by ID
  async findById(id) {
    const query = `
      SELECT id, name, business_context, allowed_topics, restricted_topics, 
             ai_model, prompt_template, is_active, created_at, updated_at
      FROM context_rules
      WHERE id = ?
    `;

    try {
      const [rows] = await pool.execute(query, [id]);

      if (!rows[0]) return null;

      // Parse JSON strings to arrays
      const rule = rows[0];
      rule.allowed_topics = JSON.parse(rule.allowed_topics);
      rule.restricted_topics = JSON.parse(rule.restricted_topics);

      return rule;
    } catch (error) {
      throw error;
    }
  }

  // Find context rule by business context
  async findByBusinessContext(businessContext) {
    const query = `
      SELECT id, name, business_context, allowed_topics, restricted_topics, 
             ai_model, prompt_template, is_active, created_at, updated_at
      FROM context_rules
      WHERE business_context = ? AND is_active = TRUE
    `;

    try {
      const [rows] = await pool.execute(query, [businessContext]);

      if (!rows[0]) return null;

      // Parse JSON strings to arrays
      const rule = rows[0];
      rule.allowed_topics = JSON.parse(rule.allowed_topics);
      rule.restricted_topics = JSON.parse(rule.restricted_topics);

      return rule;
    } catch (error) {
      throw error;
    }
  }

  // Update context rule
  async update(id, ruleData) {
    const {
      name,
      business_context,
      allowed_topics,
      restricted_topics,
      ai_model,
      prompt_template,
      is_active,
    } = ruleData;

    // Build query dynamically based on provided fields
    let query = "UPDATE context_rules SET ";
    const params = [];
    const updates = [];

    if (name) {
      updates.push("name = ?");
      params.push(name);
    }

    if (business_context) {
      updates.push("business_context = ?");
      params.push(business_context);
    }

    if (allowed_topics) {
      updates.push("allowed_topics = ?");
      params.push(JSON.stringify(allowed_topics));
    }

    if (restricted_topics) {
      updates.push("restricted_topics = ?");
      params.push(JSON.stringify(restricted_topics));
    }

    if (ai_model) {
      updates.push("ai_model = ?");
      params.push(ai_model);
    }

    if (prompt_template) {
      updates.push("prompt_template = ?");
      params.push(prompt_template);
    }

    if (is_active !== undefined) {
      updates.push("is_active = ?");
      params.push(is_active);
    }

    // If no fields to update, return
    if (updates.length === 0) {
      return { id };
    }

    query += updates.join(", ") + " WHERE id = ?";
    params.push(id);

    try {
      await pool.execute(query, params);
      return { id };
    } catch (error) {
      throw error;
    }
  }

  // Get all context rules with pagination
  async getAll(page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const query = `
      SELECT id, name, business_context, allowed_topics, restricted_topics, 
             ai_model, prompt_template, is_active, created_at, updated_at
      FROM context_rules
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;

    // Count total rules
    const countQuery = "SELECT COUNT(*) as total FROM context_rules";

    try {
      const [rows] = await pool.execute(query, [limit, offset]);
      const [countResult] = await pool.execute(countQuery);
      const total = countResult[0].total;

      // Parse JSON strings to arrays for each rule
      const rules = rows.map((rule) => ({
        ...rule,
        allowed_topics: JSON.parse(rule.allowed_topics),
        restricted_topics: JSON.parse(rule.restricted_topics),
      }));

      return {
        contextRules: rules,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  // Delete context rule
  async delete(id) {
    const query = `
      DELETE FROM context_rules
      WHERE id = ?
    `;

    try {
      const [result] = await pool.execute(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ContextRuleModel();
