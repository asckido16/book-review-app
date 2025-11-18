import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getBook, getReviews, createReview } from "../services/api";
import { getToken } from "../services/auth";

const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBookAndReviews();
  }, [id]);

  const fetchBookAndReviews = async () => {
    try {
      const [bookResponse, reviewsResponse] = await Promise.all([
        getBook(id),
        getReviews(id),
      ]);
      setBook(bookResponse.data);
      setReviews(reviewsResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load book details");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!getToken()) {
      setError("Please login to submit a review");
      return;
    }
    try {
      await createReview(id, { rating: parseInt(rating), review: reviewText });
      setReviewText("");
      setRating(5);
      fetchBookAndReviews();
    } catch (error) {
      setError("Failed to submit review");
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div>
      <h1>{book.title}</h1>
      <p>Author: {book.author}</p>
      <p>Genre: {book.genre}</p>
      <p>Average Rating: {book.avgRating} / 5</p>

      <h3>Reviews</h3>
      {reviews.map((review) => (
        <div key={review.id} className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">{review.User.username}</h5>
            <p className="card-text">Rating: {review.rating} / 5</p>
            <p className="card-text">{review.review}</p>
          </div>
        </div>
      ))}

      {getToken() && (
        <div className="mt-4">
          <h3>Add Review</h3>
          <form onSubmit={handleSubmitReview}>
            <div className="mb-3">
              <label className="form-label">Rating</label>
              <select
                className="form-select"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Review</label>
              <textarea
                className="form-control"
                rows="3"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary">
              Submit Review
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default BookDetail;
