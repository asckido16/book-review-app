import Book from "../models/book.js";
import { Op } from "sequelize";

export const getBooks = async (req, res) => {
  try {
    const { search } = req.query;
    let whereClause = {};

    if (search) {
      whereClause = {
        [Op.or]: [
          { title: { [Op.iLike]: `%${search}%` } }, // Case-insensitive search for title
          { author: { [Op.iLike]: `%${search}%` } }, // Case-insensitive search for author
          { genre: { [Op.iLike]: `%${search}%` } }, // Case-insensitive search for genre
        ],
      };
    }

    const books = await Book.findAll({ where: whereClause });
    res.status(200).json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findByPk(id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.status(200).json(book);
  } catch (error) {
    console.error("Error fetching book:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createBook = async (req, res) => {
  try {
    const { title, author, genre } = req.body;
    const newBook = await Book.create({
      title,
      author,
      genre,
    });
    res.status(201).json(newBook);
  } catch (error) {
    console.error("Error creating book:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, genre } = req.body;
    const book = await Book.findByPk(id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    await book.update({ title, author, genre });
    res.status(200).json(book);
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findByPk(id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    await book.destroy();
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
