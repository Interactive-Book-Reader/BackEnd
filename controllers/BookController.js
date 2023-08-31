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
  let bookID = req.body.ISBN;
  Book.findOne({ "ISBN": bookID })
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
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    summary: req.body.summary,
    price: req.body.price,
    pdf: req.body.pdf,
    coverpage: req.body.coverpage,
    ISBN: req.body.ISBN,
    publisher_id: req.body.publisher_id,
  });

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
  let bookID = req.body.ISBN;

  let updateData = {
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    summary: req.body.summary,
    price: req.body.price,
    pdf: req.body.pdf,
    coverpage: req.body.coverpage,
  };

  Book.findOneAndUpdate({ "ISBN":bookID }, { $set: updateData })
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
  let bookID = req.body.ISBN;
  Book.findOneAndRemove({"ISBN":bookID})
    .then(() => {
      res.json({
        message: "Book is deleted successfully!",
      });
    })
    .catch((error) => {
      res.json({
        message: "An error occured",
      });
    });
};

const findPriceRangeBook = (req, res, next) => {
  let starting_Price = req.body.starting_Price;
  let ending_Price = req.body.ending_Price;

  const query = {
    price: {
      $gte: starting_Price,
      $lte: ending_Price,
    },
  };
  Book.find(query)
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

module.exports = {
  index,
  show,
  store,
  update,
  destroy,
  findPriceRangeBook,
};
