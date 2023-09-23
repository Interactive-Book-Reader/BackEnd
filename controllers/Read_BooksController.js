const Read_Books = require("../models/Read_Books");

/**
 * The function `getdetails` retrieves details of books and users from two collections and filters the
 * results based on the publisher ID provided in the request body.
 * @param req - The req parameter is the request object, which contains information about the incoming
 * HTTP request such as headers, query parameters, and request body. It is used to access the
 * publisher_id from the request body in this code snippet.
 * @param res - The `res` parameter is the response object that is used to send a response back to the
 * client. It contains methods and properties that allow you to control the response, such as
 * `res.json()` which is used to send a JSON response.
 * @param next - The `next` parameter is a callback function that is used to pass control to the next
 * middleware function in the request-response cycle. It is typically used when you want to pass
 * control to the next middleware function after your current middleware function has completed its
 * task.
 */
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
              price: 1,
              publisher_id: 1
            }
          }
        }
      ]).then((data) => {
        const result =[];
        {data.map((item) => {
            if (item.book_details.publisher_id === req.body.publisher_id){
                result.push(item);
            }
        }
        )}
        res.json({
            data: result,
          });
      });
};

/**
 * The addbook function saves a new Read_Books object with user_id and book_id properties to the
 * database and returns a success or error message.
 * @param req - The `req` parameter is the request object that contains information about the incoming
 * HTTP request, such as the request headers, request body, and request parameters.
 * @param res - The `res` parameter is the response object that is used to send the response back to
 * the client. It contains methods and properties that allow you to control the response, such as
 * setting the status code, sending JSON data, or redirecting the client to another URL.
 * @param next - The `next` parameter is a callback function that is used to pass control to the next
 * middleware function in the request-response cycle. It is typically used when you want to pass
 * control to the next middleware function after completing some operations in the current middleware
 * function.
 */
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