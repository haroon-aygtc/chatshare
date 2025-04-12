const { pool } = require("../database/config");

class MessageModel {
  // Create a new message
  async create(messageData) {
    const {
      room_id,
      user_id,
      content,
      role,
      business_context = "general",
      timestamp = new Date(),
    } = messageData;

    const query = `
      INSERT INTO messages 
      (room_id, user_id, content, role, business_context, timestamp)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    try {
      const [result] = await pool.execute(query, [
        room_id,
        user_id,
        content,
        role,
        business_context,
        timestamp,
      ]);

      return {
        id: result.insertId,
        room_id,
        user_id,
        content,
        role,
        business_context,
        timestamp,
      };
    } catch (error) {
      throw error;
    }
  }

  // Get messages by room ID with pagination
  async getByRoomId(roomId, page = 1, limit = 50) {
    const offset = (page - 1) * limit;

    const query = `
      SELECT id, room_id, user_id, content, role, business_context, timestamp, created_at
      FROM messages
      WHERE room_id = ?
      ORDER BY timestamp ASC
      LIMIT ? OFFSET ?
    `;

    // Count total messages in this room
    const countQuery =
      "SELECT COUNT(*) as total FROM messages WHERE room_id = ?";

    try {
      const [rows] = await pool.execute(query, [roomId, limit, offset]);
      const [countResult] = await pool.execute(countQuery, [roomId]);
      const total = countResult[0].total;

      return {
        messages: rows,
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

  // Delete messages by room ID
  async deleteByRoomId(roomId) {
    const query = `
      DELETE FROM messages
      WHERE room_id = ?
    `;

    try {
      const [result] = await pool.execute(query, [roomId]);
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }

  // Get analytics data
  async getAnalytics() {
    // Total messages
    const totalMessagesQuery = "SELECT COUNT(*) as count FROM messages";

    // Messages by role
    const roleQuery = `
      SELECT role, COUNT(*) as count 
      FROM messages 
      GROUP BY role
    `;

    // Messages by business context
    const contextQuery = `
      SELECT business_context, COUNT(*) as count 
      FROM messages 
      GROUP BY business_context 
      ORDER BY count DESC
    `;

    // Messages by day (last 7 days)
    const messagesPerDayQuery = `
      SELECT DATE(timestamp) as date, COUNT(*) as count 
      FROM messages 
      WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 7 DAY) 
      GROUP BY DATE(timestamp) 
      ORDER BY date ASC
    `;

    try {
      const [totalMessages] = await pool.execute(totalMessagesQuery);
      const [roleResults] = await pool.execute(roleQuery);
      const [contextResults] = await pool.execute(contextQuery);
      const [dailyMessages] = await pool.execute(messagesPerDayQuery);

      // Convert role results to an object
      const messagesByRole = {};
      roleResults.forEach((item) => {
        messagesByRole[item.role] = item.count;
      });

      return {
        totalMessages: totalMessages[0].count,
        messagesByRole,
        messagesByBusinessContext: contextResults,
        messagesByDay: dailyMessages,
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new MessageModel();
