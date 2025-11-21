import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { booksAPI } from "../services/api";

function AddBook({ user }) {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await booksAPI.create(formData);
      setSuccess("Book added successfully!");
      setFormData({ title: "", author: "", genre: "" });

      // Redirect to books list after 2 seconds
      setTimeout(() => {
        navigate("/books");
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to add book");
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <Container>
        <Alert variant="danger">
          Access denied. Admin privileges required to add books.
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="mt-4">
            <Card.Body>
              <h2 className="text-center mb-4">Add New Book</h2>

              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Book Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Enter book title"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Author</Form.Label>
                  <Form.Control
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    required
                    placeholder="Enter author name"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Genre</Form.Label>
                  <Form.Control
                    type="text"
                    name="genre"
                    value={formData.genre}
                    onChange={handleChange}
                    required
                    placeholder="Enter genre (e.g., Fiction, Science, Romance)"
                  />
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={loading}
                    size="lg"
                  >
                    {loading ? "Adding Book..." : "Add Book"}
                  </Button>

                  <Button
                    variant="outline-secondary"
                    onClick={() => navigate("/books")}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default AddBook;
