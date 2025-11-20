import dotenv from "dotenv";

dotenv.config();

import express from "express";
import cors from "cors";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { sequelizeInstance as sequelize } from "./models/index.js";
import authRoutes from "./routes/auth.js";
import bookRoutes from "./routes/books.js";
import reviewRoutes from "./routes/reviews.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Swagger definition
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Book Review API",
    version: "1.0.0",
    description: "API For Managing Books Review",
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Development server",
    },
    {
      url:
        process.env.RAILWAY_STATIC_URL ||
        "https://your-railway-app.up.railway.app",
      description: "Production server",
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
      Book: {
        type: "object",
        properties: {
          id: {
            type: "integer",
          },
          title: {
            type: "string",
          },
          author: {
            type: "string",
          },
          genre: {
            type: "string",
          },
          createdAt: {
            type: "string",
            format: "date-time",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
          },
        },
      },
      Review: {
        type: "object",
        properties: {
          id: {
            type: "integer",
          },
          rating: {
            type: "integer",
            minimum: 1,
            maximum: 5,
          },
          comment: {
            type: "string",
          },
          bookId: {
            type: "integer",
          },
          userId: {
            type: "integer",
          },
          createdAt: {
            type: "string",
            format: "date-time",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
          },
        },
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

// Swagger UI route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// CORS configuration: allow configuring allowed origin and credential support via env vars.
// In production, set `CORS_ORIGIN` to your frontend origin (e.g. https://your-app.vercel.app)
// and `CORS_ALLOW_CREDENTIALS=true` if you need to send cookies/credentials.
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";
const CORS_ALLOW_CREDENTIALS = process.env.CORS_ALLOW_CREDENTIALS === "true";

const corsOptions = {
  origin: CORS_ORIGIN === "*" ? true : CORS_ORIGIN,
  credentials: CORS_ALLOW_CREDENTIALS,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/reviews", reviewRoutes);

sequelize
  .sync()
  .then(() => {
    console.log("Database connected");
    app.listen(PORT, () => {
      console.log(`Server running on address: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
