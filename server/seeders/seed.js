export default {
  async up(queryInterface, Sequelize) {
    const bcrypt = (await import("bcryptjs")).default;
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await queryInterface.bulkInsert("Users", [
      {
        username: adminUsername,
        password: hashedPassword,
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    const adminUsername = process.env.ADMIN_USERNAME;
    await queryInterface.bulkDelete("Users", { username: adminUsername });
  },
};
