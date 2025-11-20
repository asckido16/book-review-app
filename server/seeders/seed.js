export default {
  async up(queryInterface, Sequelize) {
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminUsername || !adminPassword) {
      throw new Error(
        "ADMIN_USERNAME and ADMIN_PASSWORD environment variables must be set for the seeder."
      );
    }

    // Load the models and find the User model
    const modelsModule = await import("../models/index.js");
    const User =
      modelsModule.User ||
      (modelsModule.default && modelsModule.default.User) ||
      modelsModule.default;
    if (!User) {
      throw new Error("Could not find User model in ../models/index.js");
    }

    // Safer create/update that triggers model hooks (create/save)
    const existing = await User.findOne({ where: { username: adminUsername } });
    if (!existing) {
      await User.create({
        username: adminUsername,
        password: adminPassword,
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      // eslint-disable-next-line no-console
      console.log(`Seed: created admin user '${adminUsername}'`);
    } else if (process.env.ADMIN_FORCE_UPDATE === "true") {
      existing.password = adminPassword;
      existing.role = "admin";
      await existing.save();
      // eslint-disable-next-line no-console
      console.log(`Seed: updated admin user '${adminUsername}'`);
    } else {
      // eslint-disable-next-line no-console
      console.log(
        `Seed: admin user '${adminUsername}' already exists; no changes made`
      );
    }
  },

  async down(queryInterface, Sequelize) {
    const adminUsername = process.env.ADMIN_USERNAME;
    if (!adminUsername) {
      throw new Error(
        "ADMIN_USERNAME environment variable must be set for the seeder down migration."
      );
    }

    const modelsModule = await import("../models/index.js");
    const User =
      modelsModule.User ||
      (modelsModule.default && modelsModule.default.User) ||
      modelsModule.default;
    if (!User) {
      throw new Error("Could not find User model in ../models/index.js");
    }

    await User.destroy({ where: { username: adminUsername } });
  },
};
