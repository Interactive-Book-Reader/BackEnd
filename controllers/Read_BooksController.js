const Read_Books = require("../models/Read_Books");

const getdetails = (req, res, next) => {
    Read_Books.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "user_id",
            foreignField: "_id",
            as: "user_details"
          }
        },
        {
          $lookup: {
            from: "books",
            localField: "book_id",
            foreignField: "_id",
            as: "book_details"
          }
        },
        {
          $unwind: "$user_details"
        },
        {
          $unwind: "$book_details"
        },
        {
          $project: {
            _id: 0, // Exclude _id field from the output
            user_details: {
              name: 1, // Include user details
              username: 1
            },
            book_details: {
              title: 1, // Include book details
              ISBN: 1,
              genre: 1,
              price: 1
            }
          }
        }
      ]).then((data) => {
        res.json({
          data: data,
        });
      });
};

const addbook=(req, res, next) => {
    const read_books = new Read_Books({
        user_id: req.body.user_id,
        book_id: req.body.book_id
    });
    read_books
        .save()
        .then((result) => {
            res.status(201).json({
                message: "Read_Book added successfully",
                result: result,
            });
        })
        .catch((err) => {
            res.status(500).json({
                message: "Read_Book added failed",
                error: err,
            });
        });
};



module.exports = {
    getdetails,
    addbook
};