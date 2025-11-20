export default {
  async up(queryInterface, Sequelize) {
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // Load the models and use the User model to perform an idempotent insert
    const modelsModule = await import("../models/index.js");
    const User = modelsModule.User || modelsModule.default.User;

    // Let the User model hooks hash the password; pass plaintext here
    await User.findOrCreate({
      where: { username: adminUsername },
      defaults: {
        password: adminPassword,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    const adminUsername = process.env.ADMIN_USERNAME;
    const modelsModule = await import("../models/index.js");
    const User = modelsModule.User || modelsModule.default.User;
    await User.destroy({ where: { username: adminUsername } });
  },
};
