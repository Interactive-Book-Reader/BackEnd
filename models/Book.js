const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/* The code is defining a Mongoose schema for a book. */
const bookSchema = new Schema(
  {
    title: {
      type: String,
    },
    author: {
      type: String,
    },
    genre: {
      type: String,
    },
    summary: {
      type: String,
    },
    price: {
      type: Number,
    },
    pdf: {
      type: String,
    },
    coverpage:{
      type: String,
    },
    ISBN:{
      type: String,
    },
    publisher_id:{
      type: String,
    },
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);
module.exports = Book;
