const { response } = require("express");
const Book = require("../models/Book");

const index = (req, res, next) => {
  Book.find()
    .then((response) => {
      res.json({
        response,
      });
    })
    .catch((error) => {
      res.json({
        message: "An error Occured!",
      });
    });
};

const show = (req, res, next) => {
  let bookID = req.body.bookID;
  Book.findById(bookID)
    .then((response) => {
      res.json([response]);
    })
    .catch((error) => [
      res.json({
        message: "An error Occured!",
      }),
    ]);
};

const store = (req, res, next) => {
  console.log(req.body);
  let book = new Book({
    title: req.body.Title,
    author: req.body.author,
    genre: req.body.genre,
    summary: req.body.summary,
    price: req.body.price,
  });
  if (req.file) {
    book.pdf = req.file.path;
  }
  book
    .save()
    .then((response) => [
      res.json({
        message: "Book is successfuly added",
      }),
    ])
    .catch((error) => {
      res.json({
        message: "An error occured",
      });
    });
};

const update = (req, res, next) => {
  let bookID = req.body.bookID;

  let updateData = {
    title: req.body.Title,
    author: req.body.author,
    genre: req.body.genre,
    summary: req.body.summary,
    price: req.body.price,
  };

  Book.findByIdAndUpdate(bookID, { $set: updateData })
    .then(() => {
      res.json({
        message: "Book is updated successfully",
      });
    })
    .catch((error) => {
      res.json({
        message: "An error Occured",
      });
    });
};

const destroy = (req, res, next) => {
  let bookID = req.body.bookID;
  Book.findOneAndRemove(bookID)
    .then(() => {
      req.json({
        message: "Book is deleted successfully!",
      });
    })
    .catch((error) => {
      req.json({
        message: "An error occured",
      });
    });
};

module.exports = {
  index,
  show,
  store,
  update,
  destroy,
};
