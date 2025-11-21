import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Badge,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { reviewsAPI } from "../services/api";

function Dashboard({ user }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      fetchUserReviews();
    }
  }, [user]);

  const fetchUserReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewsAPI.getMyReviews();
      setReviews(response.data);
    } catch (error) {
      setError("Failed to fetch your reviews");
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await reviewsAPI.delete(reviewId);
        setReviews(reviews.filter((review) => review.id !== reviewId));
      } catch (error) {
        setError("Failed to delete review");
      }
    }
  };

  if (!user) {
    return (
      <Container>
        <Alert variant="warning">
          Please <Link to="/login">login</Link> to view your dashboard.
        </Alert>
      </Container>
    );
  }

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

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h1 className="mb-4">My Dashboard</h1>
          <Card className="shadow-sm">
            <Card.Body>
              <Row>
                <Col md={6}>
                  <h5 className="mb-3">Profile Information</h5>
                  <p>
                    <strong>Username:</strong> {user.username}
                  </p>
                  <p>
                    <strong>Role:</strong>
                    <Badge
                      bg={user.role === "admin" ? "success" : "primary"}
                      className="ms-2"
                    >
                      {user.role}
                    </Badge>
                  </p>
                </Col>
                <Col md={6}>
                  <h5 className="mb-3">Statistics</h5>
                  <p>
                    <strong>Total Reviews:</strong> {reviews.length}
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">My Reviews</h5>
              </div>

              {error && <Alert variant="danger">{error}</Alert>}

              {reviews.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-muted mb-3">
                    You haven't written any reviews yet.
                  </p>
                  <Link to="/books" className="btn btn-primary">
                    Browse Books
                  </Link>
                </div>
              ) : (
                <Table responsive hover>
                  <thead className="table-light">
                    <tr>
                      <th>Book</th>
                      <th>Author</th>
                      <th>Rating</th>
                      <th>Review</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.map((review) => (
                      <tr key={review.id}>
                        <td>
                          <Link
                            to={`/books/${review.book.id}`}
                            className="text-decoration-none"
                          >
                            {review.book.title}
                          </Link>
                        </td>
                        <td>{review.book.author}</td>
                        <td>
                          <span className="text-warning">
                            {"★".repeat(review.rating)}
                            {"☆".repeat(5 - review.rating)}
                          </span>
                        </td>
                        <td>
                          {review.review ? (
                            <small className="text-muted">
                              {review.review.substring(0, 50)}...
                            </small>
                          ) : (
                            <small className="text-muted fst-italic">
                              No comment
                            </small>
                          )}
                        </td>
                        <td>
                          <small className="text-muted">
                            {new Date(review.created_at).toLocaleDateString()}
                          </small>
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <Link
                              to={`/books/${review.book.id}`}
                              className="btn btn-outline-primary"
                            >
                              View
                            </Link>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDeleteReview(review.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
