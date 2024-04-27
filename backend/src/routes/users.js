const express = require("express");
const router = express.Router();
const { BookModel } = require("../models/book");
const { UserModel } = require("../models/user");

const omitPassword = (user) => {
  const { password, ...rest } = user;
  return rest;
};

router.get("/", async (req, res, next) => {
  try {
    const users = await UserModel.find({});
    const sanitizedUsers = users.map((user) => omitPassword(user.toJSON()));
    return res.status(200).json({ users: sanitizedUsers });
  } catch (err) {
    next(err);
  }
});

router.post("/borrow", async (req, res, next) => {
  try {
    const book = await BookModel.findOne({ isbn: req.body.isbn });
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    if (book.borrowedBy.length === book.quantity) {
      return res.status(400).json({ error: "Book is not available" });
    }
    const user = await UserModel.findById(req.body.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (book.borrowedBy.includes(user.id)) {
      return res.status(400).json({ error: "You've already borrowed this book" });
    }
    await book.updateOne({ $push: { borrowedBy: user.id } });
    const updatedBook = await BookModel.findById(book.id);
    return res.status(200).json({
      book: {
        ...updatedBook.toJSON(),
        availableQuantity: updatedBook.quantity - updatedBook.borrowedBy.length,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.post("/return", async (req, res, next) => {
  try {
    const book = await BookModel.findOne({ isbn: req.body.isbn });
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    const user = await UserModel.findById(req.body.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!book.borrowedBy.includes(user.id)) {
      return res.status(400).json({ error: "You need to borrow this book first!" });
    }
    await book.updateOne({ $pull: { borrowedBy: user.id } });
    const updatedBook = await BookModel.findById(book.id);
    return res.status(200).json({
      book: {
        ...updatedBook.toJSON(),
        availableQuantity: updatedBook.quantity - updatedBook.borrowedBy.length,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.get("/borrowed-books", async (req, res, next) => {
  try {
    const borrowedBooks = await BookModel.find({ borrowedBy: req.session.userId });
    return res.status(200).json({ books: borrowedBooks });
  } catch (err) {
    next(err);
  }
});

router.get("/profile", async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.session.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json({ user: omitPassword(user.toJSON()) });
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const user = await UserModel.findOne({ username: req.body.username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (user.password !== req.body.password) {
      return res.status(400).json({ error: "Invalid password" });
    }
    req.session.userId = user.id;
    return res.status(200).json({ user: omitPassword(user.toJSON()) });
  } catch (err) {
    next(err);
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  return res.status(200).json({ success: true });
});

module.exports = router;
