import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/config.js";

class ResponseFormat extends Model {}

ResponseFormat.init(
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    formatSchema: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
      get() {
        const rawValue = this.getDataValue("formatSchema");
        return rawValue ? JSON.parse(rawValue) : {};
      },
      set(value) {
        this.setDataValue("formatSchema", JSON.stringify(value || {}));
      },
    },
    businessContext: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "general",
      field: "business_context",
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
    createdAt: {
      type: DataTypes.DATE,
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: "updated_at",
    },
  },
  {
    sequelize,
    modelName: "ResponseFormat",
    tableName: "response_formats",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

export default ResponseFormat;
