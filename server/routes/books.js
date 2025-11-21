const express = require("express");
const {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");
const { authenticate, isAdmin } = require("../middleware/auth");
const router = express.Router();

router.get("/", getAllBooks);
router.get("/:id", getBookById);
router.post("/", authenticate, isAdmin, createBook);
router.put("/:id", authenticate, isAdmin, updateBook);
router.delete("/:id", authenticate, isAdmin, deleteBook);

module.exports = router;
