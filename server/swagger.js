const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Book Review API",
      version: "1.0.0",
      description: "A comprehensive REST API for book reviews and ratings",
      contact: {
        name: "API Support",
        email: "support@bookreview.com",
      },
    },
    servers: [
      {
        url: "https://book-review-app-production-31b8.up.railway.app",
        description: "Production server",
      },
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          required: ["username", "password"],
          properties: {
            id: {
              type: "integer",
              description: "User ID",
            },
            username: {
              type: "string",
              description: "Username",
            },
            password: {
              type: "string",
              description: "Password",
            },
            role: {
              type: "string",
              enum: ["user", "admin"],
              description: "User role",
            },
          },
        },
        Book: {
          type: "object",
          required: ["title", "author", "genre"],
          properties: {
            id: {
              type: "integer",
              description: "Book ID",
            },
            title: {
              type: "string",
              description: "Book title",
            },
            author: {
              type: "string",
              description: "Book author",
            },
            genre: {
              type: "string",
              description: "Book genre",
            },
            averageRating: {
              type: "number",
              format: "float",
              description: "Average rating",
            },
          },
        },
        Review: {
          type: "object",
          required: ["book_id", "user_id", "rating"],
          properties: {
            id: {
              type: "integer",
              description: "Review ID",
            },
            book_id: {
              type: "integer",
              description: "Book ID",
            },
            user_id: {
              type: "integer",
              description: "User ID",
            },
            rating: {
              type: "integer",
              minimum: 1,
              maximum: 5,
              description: "Rating (1-5 stars)",
            },
            review: {
              type: "string",
              description: "Review text",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Error message",
            },
            error: {
              type: "string",
              description: "Error details",
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js"], // Path to the API routes
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
