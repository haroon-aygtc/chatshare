import { DataTypes } from "sequelize";
import { sequelize } from "../database/config.js";

const ContextRule = sequelize.define("ContextRule", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  businessContext: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  allowedTopics: {
    type: DataTypes.JSON, // Array of allowed topics
    allowNull: true,
  },
  restrictedTopics: {
    type: DataTypes.JSON, // Array of restricted topics
    allowNull: true,
  },
  aiModel: {
    type: DataTypes.ENUM("gemini", "huggingface", "grok"),
    defaultValue: "gemini",
  },
  promptTemplate: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

export default ContextRule;
