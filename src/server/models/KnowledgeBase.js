import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/config.js";

class KnowledgeBase extends Model {}

KnowledgeBase.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },
    contentType: {
      type: DataTypes.ENUM("markdown", "html", "text"),
      allowNull: false,
      defaultValue: "markdown",
      field: "content_type",
    },
    tags: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue("tags");
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue("tags", JSON.stringify(value || []));
      },
    },
    keywords: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue("keywords");
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue("keywords", JSON.stringify(value || []));
      },
    },
    businessContext: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "general",
      field: "business_context",
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
    modelName: "KnowledgeBase",
    tableName: "knowledge_base",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

export default KnowledgeBase;
