const { Review, Book, User } = require("../models");
const { Op } = require("sequelize");

exports.createReview = async (req, res) => {
  try {
    const { book_id, rating, review } = req.body;
    const user_id = req.user.id;

    // Check if user already reviewed this book
    const existingReview = await Review.findOne({
      where: { book_id, user_id },
    });

    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this book" });
    }

    const newReview = await Review.create({
      book_id,
      user_id,
      rating,
      review,
    });

    // Update book's average rating
    await updateBookAverageRating(book_id);

    const reviewWithUser = await Review.findByPk(newReview.id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username"],
        },
      ],
    });

    res.status(201).json(reviewWithUser);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating review", error: error.message });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const { rating, review } = req.body;
    const reviewRecord = await Review.findByPk(req.params.id);

    if (!reviewRecord) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (reviewRecord.user_id !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    await reviewRecord.update({ rating, review });
    await updateBookAverageRating(reviewRecord.book_id);

    const updatedReview = await Review.findByPk(reviewRecord.id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username"],
        },
      ],
    });

    res.json(updatedReview);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating review", error: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.user_id !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const book_id = review.book_id;
    await review.destroy();
    await updateBookAverageRating(book_id);

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting review", error: error.message });
  }
};

exports.getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: Book,
          as: "book",
        },
      ],
      order: [["created_at", "DESC"]],
    });

    res.json(reviews);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching reviews", error: error.message });
  }
};

// Helper function to update book's average rating
async function updateBookAverageRating(book_id) {
  const reviews = await Review.findAll({
    where: { book_id },
    attributes: [[sequelize.fn("AVG", sequelize.col("rating")), "avgRating"]],
  });

  const averageRating = parseFloat(reviews[0]?.dataValues.avgRating) || 0;

  await Book.update(
    { averageRating: averageRating.toFixed(2) },
    { where: { id: book_id } }
  );
}
