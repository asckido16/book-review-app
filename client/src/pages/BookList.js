import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  InputGroup,
  Spinner,
  Alert,
  Badge,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { booksAPI } from "../services/api";

function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchBooks();
  }, [currentPage, searchTerm]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 12,
        search: searchTerm || undefined,
      };

      const response = await booksAPI.getAll(params);
      setBooks(response.data.books);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      setError("Failed to fetch books");
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const StarRating = ({ rating }) => {
    return (
      <div className="text-warning">
        {"★".repeat(Math.round(rating))}
        {"☆".repeat(5 - Math.round(rating))}
        <small className="text-muted ms-2">({rating?.toFixed(1) || 0})</small>
      </div>
    );
  };

  if (loading && books.length === 0) {
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
          <h1 className="mb-4">Book Collection</h1>
          <InputGroup className="mb-3" style={{ maxWidth: "400px" }}>
            <Form.Control
              type="text"
              placeholder="Search books by title or author..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </InputGroup>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        {books.map((book) => (
          <Col key={book.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
            <Card
              className="h-100 shadow-sm hover-shadow"
              style={{ transition: "transform 0.2s" }}
            >
              <Card.Body className="d-flex flex-column">
                <Card.Title className="h6">{book.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted small">
                  by {book.author}
                </Card.Subtitle>
                <Badge bg="secondary" className="mb-2 align-self-start">
                  {book.genre}
                </Badge>
                <StarRating rating={book.averageRating} />
                <Card.Text className="text-muted small mt-auto">
                  {book.reviews?.length || 0} reviews
                </Card.Text>
              </Card.Body>
              <Card.Footer className="bg-transparent border-top-0">
                <Link
                  to={`/books/${book.id}`}
                  className="btn btn-primary btn-sm w-100"
                >
                  View Details
                </Link>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      {books.length === 0 && !loading && (
        <Row>
          <Col className="text-center py-5">
            <p className="text-muted">
              No books found. {searchTerm && "Try a different search term."}
            </p>
          </Col>
        </Row>
      )}

      {totalPages > 1 && (
        <Row className="mt-4">
          <Col className="text-center">
            <div className="btn-group">
              <button
                className="btn btn-outline-primary"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>
              <button className="btn btn-outline-primary disabled">
                Page {currentPage} of {totalPages}
              </button>
              <button
                className="btn btn-outline-primary"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default BookList;
