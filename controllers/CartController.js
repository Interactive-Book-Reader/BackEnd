const { response } = require("express");
const Cart = require("../models/Cart");
const mongoose = require("mongoose");

const getCart = (req, res, next) => {
  const specificUserId = mongoose.Types.ObjectId(req.body.user_id);
  console.log("Retrieving cart details for user:", specificUserId);
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
      $match: {
        user_id: specificUserId,
      },
    },
    {
      $unwind: "$user_details",
    },
    {
      $unwind: "$book_details",
    },
    {
      $project: {
        _id: 0,
        user_details: {
          name: 1,
          username: 1,
          image_link: 1,
        },
        book_details: {
          _id: 1,
          title: 1,
          author: 1,
          ISBN: 1,
          genre: 1,
          price: 1,
          coverpage: 1,
          pdf: 1,
        },
      },
    },
  ])
    .then((result) => {
      if (result && result.length > 0) {
        res.status(200).json({
          message: "Cart details retrieved successfully!",
          Cart: result,
        });
      } else {
        res.status(404).json({
          message: "No cart details found for the specified user.",
        });
      }
    })
    .catch((err) => {
      console.error("Error in cart retrieval:", err);
      res.status(500).json({
        message: "Cart details retrieval failed!",
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
  Cart.findOne({ user_id: req.body.user_id, book_id: req.body.book_id })
    .then((result) => {
      if (result) {
        res.status(200).json({
          message: "Book already added to cart",
        });
      } else {
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
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Cart added failed",
        error: err,
      });
    });
};

const deletebook = (req, res, next) => {
  console.log("Deleting Cart");
  Cart.deleteOne({ user_id: req.body.user_id, book_id: req.body.book_id })
    .then((result) => {
      if (result.deletedCount > 0) {
        res.status(200).json({
          message: "Book removed from cart successfully!",
        });
      } else {
        res.status(404).json({
          message: "No cart details found for the specified user.",
        });
      }
    })
    .catch((err) => {
      console.error("Error in cart deletion:", err);
      res.status(500).json({
        message: "Cart deletion failed!",
        error: err,
      });
    });
};

const getBooksForUser = (req, res, next) => {
  const specificUserId = mongoose.Types.ObjectId(req.body.user_id);
  console.log("Retrieving cart details for user:", specificUserId);
  Cart.find({ user_id: specificUserId })
    .then((result) => {
      if (result && result.length > 0) {
        res.status(200).json({
          message: "Cart details retrieved successfully!",
          Cart: result,
        });
      } else {
        res.status(404).json({
          message: "No cart details found for the specified user.",
        });
      }
    })
    .catch((err) => {
      console.error("Error in cart retrieval:", err);
      res.status(500).json({
        message: "Cart details retrieval failed!",
        error: err,
      });
    });
};

const checkBookForUser = (req, res, next) => {
  const specificUserId = mongoose.Types.ObjectId(req.body.user_id);
  const specificBookId = mongoose.Types.ObjectId(req.body.book_id);
  console.log("Retrieving cart details for user:", specificUserId);
  Cart.find({ user_id: specificUserId, book_id: specificBookId })
    .then((result) => {
      if (result && result.length > 0) {
        res.status(200).json({
          message: "Book already added to Cart!",
        });
      } else {
        res.status(404).json({
          message: "No cart details found for the specified user.",
        });
      }
    })
    .catch((err) => {
      console.error("Error in cart retrieval:", err);
      res.status(500).json({
        message: "Cart details retrieval failed!",
        error: err,
      });
    });
};

module.exports = {
  getCart,
  addbook,
  deletebook,
  getBooksForUser,
  checkBookForUser,
};
