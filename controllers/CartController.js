const { response } = require("express");
const Cart = require("../models/Cart");

const getCart = (req, res, next) => {
  Cart.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "user_id",
        foreignField: "_id",
        as: "user_details",
      },
    },
    {
      $lookup: {
        from: "books",
        localField: "book_id",
        foreignField: "_id",
        as: "book_details",
      },
    },
    {
      $unwind: "$user_details", // Unwind the user_details array
    },
    {
      $unwind: "$book_details", // Unwind the book_details array
    },
    {
      $project: {
        _id: 0, // Exclude the _id field from the output
        user_details: {
          name: 1, // Include user details you need
          username: 1,
          image_link: 1,
        },
        book_details: {
          title: 1, // Include book details you need
          ISBN: 1,
          genre: 1,
          price: 1,
        },
      },
    },
  ])
    .then((result) => {
      res.status(200).json({
        message: "Cart details retrieved successfully!",
        Cart: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Cart details retrieved failed!",
        error: err,
      });
    });
};

const addbook = (req, res, next) => {
  console.log("Adding Cart");
  const cart = new Cart({
    user_id: req.body.user_id,
    book_id: req.body.book_id,
  });
  cart
    .save()
    .then((result) => {
      res.status(201).json({
        message: "book is added successfully.",
        result: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Cart added failed",
        error: err,
      });
    });
};

module.exports = {
  getCart,
  addbook,
};
