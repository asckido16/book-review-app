require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { sequelize } = require("./models");

const app = express();

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://book-review-app-steel.vercel.app/",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/books", require("./routes/books"));
app.use("/api/reviews", require("./routes/reviews"));

// Health check
app.get("/api", (req, res) => {
  res.json({ message: "Book Review API is running!" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// 404 handler - CORRECTED: Use a proper catch-all route
app.use((req, res, next) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
    method: req.method,
  });
});

const PORT = process.env.PORT || 5000;

// Database connection and server start
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected successfully");

    // Sync database (use { force: true } only in development to reset db)
    return sequelize.sync({ force: false });
  })
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`The Database is running on: http://localhost:${PORT}/api`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to database:", err);
  });

module.exports = app;
