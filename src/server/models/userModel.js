const { pool } = require("../database/config");
const bcrypt = require("bcrypt");

class UserModel {
  // Create a new user
  async create(userData) {
    const { username, email, password, role = "user" } = userData;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const query = `
      INSERT INTO users (username, email, password, role)
      VALUES (?, ?, ?, ?)
    `;

    try {
      const [result] = await pool.execute(query, [
        username,
        email,
        hashedPassword,
        role,
      ]);
      return { id: result.insertId, username, email, role };
    } catch (error) {
      throw error;
    }
  }

  // Find user by ID
  async findById(id) {
    const query = `
      SELECT id, username, email, role, is_active, last_login, created_at, updated_at
      FROM users
      WHERE id = ?
    `;

    try {
      const [rows] = await pool.execute(query, [id]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Find user by email
  async findByEmail(email) {
    const query = `
      SELECT id, username, email, password, role, is_active, last_login, created_at, updated_at
      FROM users
      WHERE email = ?
    `;

    try {
      const [rows] = await pool.execute(query, [email]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Find user by username
  async findByUsername(username) {
    const query = `
      SELECT id, username, email, password, role, is_active, last_login, created_at, updated_at
      FROM users
      WHERE username = ?
    `;

    try {
      const [rows] = await pool.execute(query, [username]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Update user
  async update(id, userData) {
    const { username, email, password, role, is_active } = userData;
    let hashedPassword = password;

    // If password is provided, hash it
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    // Build query dynamically based on provided fields
    let query = "UPDATE users SET ";
    const params = [];
    const updates = [];

    if (username) {
      updates.push("username = ?");
      params.push(username);
    }

    if (email) {
      updates.push("email = ?");
      params.push(email);
    }

    if (password) {
      updates.push("password = ?");
      params.push(hashedPassword);
    }

    if (role) {
      updates.push("role = ?");
      params.push(role);
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

  // Update last login
  async updateLastLogin(id) {
    const query = `
      UPDATE users
      SET last_login = NOW()
      WHERE id = ?
    `;

    try {
      await pool.execute(query, [id]);
      return { id };
    } catch (error) {
      throw error;
    }
  }

  // Get all users with pagination
  async getAll(page = 1, limit = 10, search = "") {
    const offset = (page - 1) * limit;

    let query = `
      SELECT id, username, email, role, is_active, last_login, created_at, updated_at
      FROM users
    `;

    const params = [];

    // Add search condition if provided
    if (search) {
      query += " WHERE username LIKE ? OR email LIKE ?";
      params.push(`%${search}%`, `%${search}%`);
    }

    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    // Count total users
    let countQuery = "SELECT COUNT(*) as total FROM users";
    if (search) {
      countQuery += " WHERE username LIKE ? OR email LIKE ?";
    }

    try {
      const [rows] = await pool.execute(query, params);

      // Get total count
      const countParams = search ? [`%${search}%`, `%${search}%`] : [];
      const [countResult] = await pool.execute(countQuery, countParams);
      const total = countResult[0].total;

      return {
        users: rows,
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

  // Delete user
  async delete(id) {
    const query = `
      DELETE FROM users
      WHERE id = ?
    `;

    try {
      const [result] = await pool.execute(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Compare password
  async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
}

module.exports = new UserModel();
