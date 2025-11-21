const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if admin user already exists
    const existingAdmin = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE username = ?",
      {
        replacements: ["admin"],
        type: queryInterface.sequelize.QueryTypes.SELECT,
      }
    );

    // Only create admin if it doesn't exist
    if (existingAdmin.length === 0) {
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
      console.log("Admin user created successfully");
    } else {
      console.log("Admin user already exists, skipping creation");
    }
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
