import User from "./User.js";
import Message from "./Message.js";
import ContextRule from "./ContextRule.js";
import PromptTemplate from "./PromptTemplate.js";
import ChatSession from "./ChatSession.js";

// Define relationships
User.hasMany(Message, { foreignKey: "userId" });
Message.belongsTo(User, { foreignKey: "userId" });

ChatSession.hasMany(Message, { foreignKey: "roomId", sourceKey: "roomId" });
Message.belongsTo(ChatSession, { foreignKey: "roomId", targetKey: "roomId" });

User.hasMany(ChatSession, { foreignKey: "userId" });
ChatSession.belongsTo(User, { foreignKey: "userId" });

export { User, Message, ContextRule, PromptTemplate, ChatSession };
