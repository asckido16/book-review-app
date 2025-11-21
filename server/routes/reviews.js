const express = require("express");
const {
  createReview,
  updateReview,
  deleteReview,
  getUserReviews,
} = require("../controllers/reviewController");
const { authenticate } = require("../middleware/auth");
const router = express.Router();

router.post("/", authenticate, createReview);
router.put("/:id", authenticate, updateReview);
router.delete("/:id", authenticate, deleteReview);
router.get("/my-reviews", authenticate, getUserReviews);

module.exports = router;
