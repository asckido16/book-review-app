import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
  Badge,
} from "react-bootstrap";
import { booksAPI, reviewsAPI } from "../services/api";

function BookDetail({ user }) {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    review: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [userReview, setUserReview] = useState(null);

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      setLoading(true);
      const response = await booksAPI.getById(id);
      setBook(response.data);

      if (user) {
        const userReview = response.data.reviews?.find(
          (review) => review.user.id === user.id
        );
        setUserReview(userReview);
        if (userReview) {
          setReviewForm({
            rating: userReview.rating,
            review: userReview.review || "",
          });
        }
      }
    } catch (error) {
      setError("Failed to fetch book details");
      console.error("Error fetching book:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("Please login to submit a review");
      return;
    }

    setSubmitting(true);
    try {
      if (userReview) {
        await reviewsAPI.update(userReview.id, {
          rating: reviewForm.rating,
          review: reviewForm.review,
        });
      } else {
        await reviewsAPI.create({
          book_id: parseInt(id),
          rating: reviewForm.rating,
          review: reviewForm.review,
        });
      }

      fetchBook();
      setError("");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!userReview) return;

    try {
      await reviewsAPI.delete(userReview.id);
      setUserReview(null);
      setReviewForm({ rating: 5, review: "" });
      fetchBook();
    } catch (error) {
      setError("Failed to delete review");
    }
  };

  const StarInput = ({ rating, onRatingChange }) => {
    return (
      <div className="fs-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`cursor-pointer ${
              star <= rating ? "text-warning" : "text-secondary"
            }`}
            onClick={() => onRatingChange(star)}
            style={{ cursor: "pointer" }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "50vh" }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (!book) {
    return (
      <Container>
        <Alert variant="danger">Book not found</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="justify-content-center">
        <Col lg={10}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h1 className="h2 mb-2">{book.title}</h1>
                  <h4 className="text-muted mb-3">by {book.author}</h4>
                  <Badge bg="primary" className="fs-6 mb-3">
                    {book.genre}
                  </Badge>

                  <div className="mb-2">
                    <strong>Average Rating: </strong>
                    <span className="text-warning">
                      {"★".repeat(Math.round(book.averageRating))}
                      {"☆".repeat(5 - Math.round(book.averageRating))}
                    </span>
                    <span className="ms-2">
                      ({book.averageRating?.toFixed(1) || 0})
                    </span>
                  </div>

                  <div>
                    <strong>Total Reviews: </strong>
                    {book.reviews?.length || 0}
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Review Form */}
          {user && (
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <h5 className="mb-3">
                  {userReview ? "Edit Your Review" : "Write a Review"}
                </h5>
                <Form onSubmit={handleReviewSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Rating</Form.Label>
                    <div>
                      <StarInput
                        rating={reviewForm.rating}
                        onRatingChange={(rating) =>
                          setReviewForm({ ...reviewForm, rating })
                        }
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Review (Optional)
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={reviewForm.review}
                      onChange={(e) =>
                        setReviewForm({ ...reviewForm, review: e.target.value })
                      }
                      placeholder="Share your thoughts about this book..."
                    />
                  </Form.Group>

                  <div className="d-flex gap-2">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={submitting}
                    >
                      {submitting
                        ? "Submitting..."
                        : userReview
                        ? "Update Review"
                        : "Submit Review"}
                    </Button>

                    {userReview && (
                      <Button
                        variant="outline-danger"
                        onClick={handleDeleteReview}
                        disabled={submitting}
                      >
                        Delete Review
                      </Button>
                    )}
                  </div>
                </Form>
              </Card.Body>
            </Card>
          )}

          {/* Reviews List */}
          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="mb-4">Reviews ({book.reviews?.length || 0})</h5>

              {book.reviews?.length === 0 ? (
                <p className="text-muted text-center py-3">
                  No reviews yet. Be the first to review!
                </p>
              ) : (
                book.reviews?.map((review) => (
                  <Card
                    key={review.id}
                    className={`mb-3 border-start ${
                      review.user.id === user?.id
                        ? "border-success border-start-3"
                        : "border-primary border-start-3"
                    }`}
                  >
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h6 className="mb-1 fw-bold">
                            {review.user.username}
                          </h6>
                          <div className="text-warning mb-2">
                            {"★".repeat(review.rating)}
                            {"☆".repeat(5 - review.rating)}
                          </div>
                        </div>
                        <small className="text-muted">
                          {new Date(review.created_at).toLocaleDateString()}
                        </small>
                      </div>

                      {review.review && (
                        <p className="mb-0 text-dark">{review.review}</p>
                      )}
                    </Card.Body>
                  </Card>
                ))
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      )}
    </Container>
  );
}

export default BookDetail;
