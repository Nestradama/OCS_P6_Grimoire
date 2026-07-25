const Book = require('../models/Book');

// GET /api/books — return all books
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// GET /api/books/bestrating — return top 3 books by averageRating
exports.getBestRated = async (req, res) => {
  try {
    const books = await Book.find()
      .sort({ averageRating: -1 }) // descending: highest first
      .limit(3);
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// GET /api/books/:id — return a single book
exports.getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    return res.status(200).json(book);
  } catch (err) {
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

// POST /api/books — create a book (Temp JSON Only)
exports.createBook = async (req, res) => {
  try {
    // takes userId from auth middleware
    const bookData = { ...req.body, userId: req.auth.userId };

    // eslint-disable-next-line no-underscore-dangle
    delete bookData._id;

    const book = new Book(bookData);
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// PUT /api/books/:id — update a book
exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.userId !== req.auth.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );

    return res.status(200).json(updatedBook);
  } catch (err) {
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

// DELETE /api/books/:id — delete a book
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.userId !== req.auth.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Book.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: 'Book deleted' });
  } catch (err) {
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

// POST /api/books/:id/rating — rate a book
exports.rateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // The frontend sends: { userId: "WhateverValue", rating: 3 }
    const { rating } = req.body;
    const { userId } = req.auth;

    const alreadyRated = book.ratings.find(
      (r) => r.userId === userId,
    );

    if (alreadyRated) {
      alreadyRated.grade = rating;
    } else {
      book.ratings.push({ userId, grade: rating });
    }

    const total = book.ratings.reduce((sum, r) => sum + r.grade, 0);
    book.averageRating = Math.round(total / book.ratings.length);

    await book.save();

    return res.status(200).json(book);
  } catch (err) {
    return res.status(500).json({ message: 'Something went wrong' });
  }
};
