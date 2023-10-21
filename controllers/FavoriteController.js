const { response } = require("express");
const Favorite = require("../models/Favorite");
const mongoose = require("mongoose");

const getFavorite = (req, res, next) => {
  const specificUserId = mongoose.Types.ObjectId(req.body.user_id);
  console.log("Retrieving favorite details for user:", specificUserId);
  Favorite.aggregate([
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
          message: "Favorite details retrieved successfully!",
          Favorite: result,
        });
      } else {
        res.status(404).json({
          message: "No favorite details found for the specified user.",
        });
      }
    })
    .catch((err) => {
      console.error("Error in favorite retrieval:", err);
      res.status(500).json({
        message: "Favorite details retrieval failed!",
        error: err,
      });
    });
};

const addbook = (req, res, next) => {
  console.log("Adding Favorite");
  const favorite = new Favorite({
    user_id: req.body.user_id,
    book_id: req.body.book_id,
  });
  Favorite.findOne({ user_id: req.body.user_id, book_id: req.body.book_id })
    .then((result) => {
      if (result) {
        res.status(200).json({
          message: "Book already added to favorite",
        });
      } else {
        favorite
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
        message: "Favorite added failed",
        error: err,
      });
    });
};

const deletebook = (req, res, next) => {
  console.log("Deleting Favorite");
  const user_id = req.body.user_id;
  const book_id = req.body.book_id;
  Favorite.deleteOne({ user_id: user_id, book_id: book_id })
    .then((result) => {
      if (result) {
        res.status(200).json({
          message: "Book deleted from favorite",
        });
      } else {
        res.status(404).json({
          message: "Book not found in favorite",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Book deletion failed",
        error: err,
      });
    });
}

module.exports = {
  getFavorite,
  addbook,
  deletebook,
};
