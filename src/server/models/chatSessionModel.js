const { pool } = require("../database/config");

class ChatSessionModel {
  // Create a new chat session
  async create(sessionData) {
    const { room_id, user_id, business_context = "general" } = sessionData;

    const query = `
      INSERT INTO chat_sessions 
      (room_id, user_id, business_context, last_activity)
      VALUES (?, ?, ?, NOW())
    `;

    try {
      const [result] = await pool.execute(query, [
        room_id,
        user_id,
        business_context,
      ]);

      return {
        id: result.insertId,
        room_id,
        user_id,
        business_context,
        is_active: true,
        last_activity: new Date(),
      };
    } catch (error) {
      throw error;
    }
  }

  // Find session by room ID
  async findByRoomId(roomId) {
    const query = `
      SELECT id, room_id, user_id, business_context, is_active, 
             last_activity, created_at, updated_at
      FROM chat_sessions
      WHERE room_id = ?
    `;

    try {
      const [rows] = await pool.execute(query, [roomId]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Update session's last activity
  async updateLastActivity(roomId) {
    const query = `
      UPDATE chat_sessions
      SET last_activity = NOW()
      WHERE room_id = ?
    `;

    try {
      await pool.execute(query, [roomId]);
      return { room_id: roomId };
    } catch (error) {
      throw error;
    }
  }

  // Update session status (active/inactive)
  async updateStatus(roomId, isActive) {
    const query = `
      UPDATE chat_sessions
      SET is_active = ?
      WHERE room_id = ?
    `;

    try {
      await pool.execute(query, [isActive, roomId]);
      return { room_id: roomId, is_active: isActive };
    } catch (error) {
      throw error;
    }
  }

  // Get all sessions with pagination
  async getAll(page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const query = `
      SELECT id, room_id, user_id, business_context, is_active, 
             last_activity, created_at, updated_at
      FROM chat_sessions
      ORDER BY last_activity DESC
      LIMIT ? OFFSET ?
    `;

    // Count total sessions
    const countQuery = "SELECT COUNT(*) as total FROM chat_sessions";

    try {
      const [rows] = await pool.execute(query, [limit, offset]);
      const [countResult] = await pool.execute(countQuery);
      const total = countResult[0].total;

      return {
        sessions: rows,
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

  // Get sessions by user ID
  async getByUserId(userId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const query = `
      SELECT id, room_id, user_id, business_context, is_active, 
             last_activity, created_at, updated_at
      FROM chat_sessions
      WHERE user_id = ?
      ORDER BY last_activity DESC
      LIMIT ? OFFSET ?
    `;

    // Count total sessions for this user
    const countQuery =
      "SELECT COUNT(*) as total FROM chat_sessions WHERE user_id = ?";

    try {
      const [rows] = await pool.execute(query, [userId, limit, offset]);
      const [countResult] = await pool.execute(countQuery, [userId]);
      const total = countResult[0].total;

      return {
        sessions: rows,
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

  // Delete session
  async delete(roomId) {
    const query = `
      DELETE FROM chat_sessions
      WHERE room_id = ?
    `;

    try {
      const [result] = await pool.execute(query, [roomId]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get analytics data
  async getAnalytics() {
    // Total active sessions
    const activeSessionsQuery =
      "SELECT COUNT(*) as count FROM chat_sessions WHERE is_active = TRUE";

    // Sessions by business context
    const contextQuery = `
      SELECT business_context, COUNT(*) as count 
      FROM chat_sessions 
      GROUP BY business_context 
      ORDER BY count DESC
    `;

    // Sessions by day (last 7 days)
    const sessionsPerDayQuery = `
      SELECT DATE(created_at) as date, COUNT(*) as count 
      FROM chat_sessions 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) 
      GROUP BY DATE(created_at) 
      ORDER BY date ASC
    `;

    try {
      const [activeSessions] = await pool.execute(activeSessionsQuery);
      const [contextResults] = await pool.execute(contextQuery);
      const [dailySessions] = await pool.execute(sessionsPerDayQuery);

      return {
        activeSessions: activeSessions[0].count,
        sessionsByContext: contextResults,
        sessionsByDay: dailySessions,
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ChatSessionModel();
