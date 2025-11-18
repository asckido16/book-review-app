import { Book, Review, User } from "../models/index.js";
import { Op } from "sequelize";

const getBooks = async (req, res) => {
  try {
    const { search } = req.query;
    let where = {};
    if (search) {
      where = {
        [Op.or]: [
          { title: { [Op.iLike]: `%${search}%` } },
          { author: { [Op.iLike]: `%${search}%` } },
        ],
      };
    }
    const books = await Book.findAll({
      where,
      include: [
        {
          model: Review,
          attributes: ["rating"],
        },
      ],
    });

    const booksWithAvgRating = books.map((book) => {
      const ratings = book.Reviews.map((review) => review.rating);
      const avgRating =
        ratings.length > 0
          ? ratings.reduce((a, b) => a + b) / ratings.length
          : 0;
      return {
        ...book.toJSON(),
        avgRating: parseFloat(avgRating.toFixed(1)),
      };
    });

    res.json(booksWithAvgRating);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id, {
      include: [
        {
          model: Review,
          include: [{ model: User, attributes: ["username"] }],
        },
      ],
    });
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    const ratings = book.Reviews.map((review) => review.rating);
    const avgRating =
      ratings.length > 0 ? ratings.reduce((a, b) => a + b) / ratings.length : 0;
    res.json({
      ...book.toJSON(),
      avgRating: parseFloat(avgRating.toFixed(1)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createBook = async (req, res) => {
  try {
    const { title, author, genre } = req.body;
    const book = await Book.create({ title, author, genre });
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export default { getBooks, getBook, createBook };
