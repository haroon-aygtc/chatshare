import { Message } from "../models/index.js";

/**
 * Create a new message
 * @param {Object} messageData - The message data
 * @returns {Promise<Object>} - The created message
 */
export const createMessage = async (messageData) => {
  try {
    const message = await Message.create(messageData);
    return message.toJSON();
  } catch (error) {
    console.error("Error creating message:", error);
    throw error;
  }
};

/**
 * Get messages by room ID with pagination
 * @param {string} roomId - The room ID
 * @param {number} page - The page number
 * @param {number} limit - The number of messages per page
 * @returns {Promise<Object>} - The messages and pagination info
 */
export const getMessagesByRoom = async (roomId, page = 1, limit = 50) => {
  try {
    const offset = (page - 1) * limit;

    const { count, rows } = await Message.findAndCountAll({
      where: { roomId },
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    return {
      messages: rows,
      totalMessages: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    };
  } catch (error) {
    console.error("Error getting messages by room:", error);
    throw error;
  }
};

/**
 * Delete messages by room ID
 * @param {string} roomId - The room ID
 * @returns {Promise<number>} - The number of deleted messages
 */
export const deleteMessagesByRoom = async (roomId) => {
  try {
    const deletedCount = await Message.destroy({
      where: { roomId },
    });

    return deletedCount;
  } catch (error) {
    console.error("Error deleting messages by room:", error);
    throw error;
  }
};

export default {
  createMessage,
  getMessagesByRoom,
  deleteMessagesByRoom,
};
