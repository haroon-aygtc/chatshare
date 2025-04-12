import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/config.js";
import KnowledgeBase from "./KnowledgeBase.js";

class FollowUpQuestion extends Model {}

FollowUpQuestion.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    question: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    businessContext: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "business_context",
    },
    responseType: {
      type: DataTypes.ENUM("predefined", "prompt", "knowledge_base"),
      allowNull: false,
      defaultValue: "prompt",
      field: "response_type",
    },
    predefinedResponse: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "predefined_response",
    },
    promptTemplate: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "prompt_template",
    },
    knowledgeBaseId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "knowledge_base_id",
      references: {
        model: KnowledgeBase,
        key: "id",
      },
    },
    position: {
      type: DataTypes.ENUM("start", "end", "custom"),
      allowNull: false,
      defaultValue: "end",
    },
    customMarker: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "custom_marker",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "is_active",
    },
  },
  {
    sequelize,
    modelName: "FollowUpQuestion",
    tableName: "follow_up_questions",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

// Define association with KnowledgeBase
FollowUpQuestion.belongsTo(KnowledgeBase, { foreignKey: "knowledge_base_id" });
KnowledgeBase.hasMany(FollowUpQuestion, { foreignKey: "knowledge_base_id" });

export default FollowUpQuestion;
