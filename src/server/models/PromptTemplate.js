import { DataTypes } from "sequelize";
import { sequelize } from "../database/config.js";

const PromptTemplate = sequelize.define("PromptTemplate", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  template: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  businessContext: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  variables: {
    type: DataTypes.JSON, // Array of variable names used in the template
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

export default PromptTemplate;
