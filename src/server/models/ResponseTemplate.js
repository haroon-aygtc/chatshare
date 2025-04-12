import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/config.js";

class ResponseTemplate extends Model {}

ResponseTemplate.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    template: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },
    businessContext: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "business_context",
    },
    templateType: {
      type: DataTypes.ENUM("standard", "faq", "action", "disclaimer"),
      allowNull: false,
      defaultValue: "standard",
      field: "template_type",
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "is_default",
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
    modelName: "ResponseTemplate",
    tableName: "response_templates",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

export default ResponseTemplate;
