const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "users",
      [
        {
          username: process.env.ADMIN_USERNAME || "admin",
          password: await bcrypt.hash(
            process.env.ADMIN_PASSWORD || "admin123",
            10
          ),
          role: "admin",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      "users",
      {
        username: process.env.ADMIN_USERNAME || "admin",
      },
      {}
    );
  },
};
