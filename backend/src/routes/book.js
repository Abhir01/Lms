const express = require("express");
const router = express.Router();
const { BookModel } = require("../models/book");

router.get("/", async (req, res, next) => {
  try {
    const books = await BookModel.find({});
    const updatedBooks = books.map((book) => ({
      ...book.toJSON(),
      availableQuantity: book.quantity - book.borrowedBy.length,
    }));
    return res.status(200).json({ books: updatedBooks });
  } catch (err) {
    next(err);
  }
});

router.get("/:bookIsbn", async (req, res, next) => {
  try {
    const book = await BookModel.findOne({ isbn: req.params.bookIsbn });
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    const updatedBook = {
      ...book.toJSON(),
      availableQuantity: book.quantity - book.borrowedBy.length,
    };
    return res.status(200).json({ book: updatedBook });
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const existingBook = await BookModel.findOne({ isbn: req.body.isbn });
    if (existingBook) {
      return res.status(400).json({ error: "Book with same ISBN already exists" });
    }
    const newBook = await BookModel.create(req.body);
    return res.status(200).json({ book: newBook });
  } catch (err) {
    next(err);
  }
});

router.patch("/:bookIsbn", async (req, res, next) => {
  try {
    const book = await BookModel.findOne({ isbn: req.params.bookIsbn });
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    const { _id, isbn, ...rest } = req.body;
    const updatedBook = await BookModel.findOneAndUpdate({ isbn: req.params.bookIsbn }, rest, { new: true });
    return res.status(200).json({ book: updatedBook });
  } catch (err) {
    next(err);
  }
});

router.delete("/:bookIsbn", async (req, res, next) => {
  try {
    const book = await BookModel.findOne({ isbn: req.params.bookIsbn });
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    await book.delete();
    return res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
