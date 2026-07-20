const mongoose = require('mongoose');

// Entry blueprint
const bookSchema = new mongoose.Schema(
  {
    userId: {
      type: String, // User who created the entry
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
    },
    genre: {
      type: String,
    },
    ratings: [
      {
        userId: { type: String, required: true }, // User who rated it
        grade: { type: Number, required: true },
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
    },
    imageUrl: {
      type: String, // Book cover image path
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Book', bookSchema);
