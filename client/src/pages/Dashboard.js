import React, { useState, useEffect } from "react";
import { getUserReviews, deleteReview } from "../services/api";

const Dashboard = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserReviews();
  }, []);

  const fetchUserReviews = async () => {
    try {
      const response = await getUserReviews();
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching user reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await deleteReview(reviewId);
        setReviews(reviews.filter((review) => review.id !== reviewId));
      } catch (error) {
        console.error("Error deleting review:", error);
        alert("Failed to delete review. Please try again.");
      }
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>
        Welcome to your dashboard! Here you can manage your reviews and see
        books you've reviewed.
      </p>
      <h2>Your Reviews</h2>
      {reviews.length === 0 ? (
        <p>You haven't reviewed any books yet.</p>
      ) : (
        <div className="row">
          {reviews.map((review) => (
            <div key={review.id} className="col-md-6 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{review.Book.title}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    by {review.Book.author}
                  </h6>
                  <p className="card-text">Genre: {review.Book.genre}</p>
                  <p className="card-text">Rating: {review.rating}/5</p>
                  <p className="card-text">{review.review}</p>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteReview(review.id)}
                  >
                    Delete Review
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
