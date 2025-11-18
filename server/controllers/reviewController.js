import { Review, User, Book } from "../models/index.js";

const getReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { book_id: req.params.bookId },
      include: [{ model: User, attributes: ["username"] }],
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createReview = async (req, res) => {
  try {
    const { rating, review } = req.body;
    const newReview = await Review.create({
      book_id: req.params.bookId,
      user_id: req.user.id,
      rating,
      review,
    });
    res.status(201).json(newReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateReview = async (req, res) => {
  try {
    const { rating, review } = req.body;
    const reviewRecord = await Review.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });
    if (!reviewRecord) {
      return res
        .status(404)
        .json({ message: "Review not found or not authorized" });
    }
    await reviewRecord.update({ rating, review });
    res.json(reviewRecord);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });
    if (!review) {
      return res
        .status(404)
        .json({ message: "Review not found or not authorized" });
    }
    await review.destroy();
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: User,
          attributes: ["username"],
        },
        {
          model: Book,
          attributes: ["id", "title", "author", "genre"],
        },
      ],
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
  getUserReviews,
};
