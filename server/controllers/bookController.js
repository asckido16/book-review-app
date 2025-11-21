const { Book, Review, User } = require("../models");
const { Op } = require("sequelize");

exports.getAllBooks = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = {};
    if (search) {
      whereClause = {
        [Op.or]: [
          { title: { [Op.iLike]: `%${search}%` } },
          { author: { [Op.iLike]: `%${search}%` } },
        ],
      };
    }

    const books = await Book.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Review,
          as: "reviews",
          attributes: ["id", "rating"], // Include id to ensure we get data
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["created_at", "DESC"]],
    });

    // Calculate average rating for each book
    const booksWithStats = books.rows.map((book) => {
      const reviews = book.reviews || [];
      const totalRating = reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      const averageRating =
        reviews.length > 0 ? totalRating / reviews.length : 0;

      return {
        ...book.toJSON(),
        averageRating: parseFloat(averageRating.toFixed(2)),
        reviewCount: reviews.length,
      };
    });

    res.json({
      books: booksWithStats,
      totalPages: Math.ceil(books.count / limit),
      currentPage: parseInt(page),
      totalBooks: books.count,
    });
  } catch (error) {
    console.error("Error in getAllBooks:", error);
    res.status(500).json({
      message: "Error fetching books",
      error: error.message,
    });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id, {
      include: [
        {
          model: Review,
          as: "reviews",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "username"],
            },
          ],
        },
      ],
    });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Calculate average rating for single book
    const reviews = book.reviews || [];
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    const bookWithStats = {
      ...book.toJSON(),
      averageRating: parseFloat(averageRating.toFixed(2)),
    };

    res.json(bookWithStats);
  } catch (error) {
    console.error("Error in getBookById:", error);
    res.status(500).json({
      message: "Error fetching book",
      error: error.message,
    });
  }
};

exports.createBook = async (req, res) => {
  try {
    const { title, author, genre } = req.body;
    const book = await Book.create({ title, author, genre });
    res.status(201).json(book);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating book", error: error.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const { title, author, genre } = req.body;
    const book = await Book.findByPk(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    await book.update({ title, author, genre });
    res.json(book);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating book", error: error.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    await book.destroy();
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting book", error: error.message });
  }
};
