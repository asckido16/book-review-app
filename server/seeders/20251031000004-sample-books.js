module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "books",
      [
        {
          title: "To Kill a Mockingbird",
          author: "Harper Lee",
          genre: "Fiction",
          created_at: new Date(),
          updated_at: new Date(),
        },

        {
          title: "Pride and Prejudice",
          author: "Jane Austen",
          genre: "Romance",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: "The Great Gatsby",
          author: "F. Scott Fitzgerald",
          genre: "Classic",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: "Harry Potter and the Philosopher's Stone",
          author: "J.K. Rowling",
          genre: "Fantasy",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("books", null, {});
  },
};
