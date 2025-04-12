import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// MySQL connection configuration
export const sequelize = new Sequelize(
  process.env.DB_NAME || "chat_system",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
);

// Test database connection
export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");
    return true;
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    return false;
  }
};

// Initialize models and create tables if they don't exist
export const initializeDatabase = async () => {
  try {
    await sequelize.sync({ alter: process.env.NODE_ENV === "development" });
    console.log("Database synchronized successfully.");
    return true;
  } catch (error) {
    console.error("Error synchronizing database:", error);
    return false;
  }
};
