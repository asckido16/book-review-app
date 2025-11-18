export default {
  async up(queryInterface, Sequelize) {
    const bcrypt = (await import("bcryptjs")).default;
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await queryInterface.bulkInsert("Users", [
      {
        username: "admin",
        password: hashedPassword,
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", { username: "admin" });
  },
};
