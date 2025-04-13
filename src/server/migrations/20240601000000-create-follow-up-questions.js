"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("follow_up_questions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      question: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      business_context: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "general",
      },
      is_multi_select: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      position: {
        type: Sequelize.ENUM("top", "bottom"),
        allowNull: false,
        defaultValue: "bottom",
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("follow_up_questions");
  },
};
