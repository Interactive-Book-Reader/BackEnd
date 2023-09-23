const { response } = require("express");
const Book = require("../models/Book");

/**
 * The function retrieves all books from the database and sends a JSON response with the books or an
 * error message.
 * @param req - The `req` parameter represents the HTTP request object, which contains information
 * about the incoming request such as the request headers, request parameters, request body, etc.
 * @param res - The `res` parameter is the response object that is used to send a response back to the
 * client. It contains methods and properties that allow you to control the response, such as `json()`
 * which is used to send a JSON response.
 * @param next - The `next` parameter is a function that is used to pass control to the next middleware
 * function in the request-response cycle. It is typically used when you want to pass control to the
 * next middleware function or route handler after completing some operations in the current middleware
 * function.
 */
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

/**
 * The function "show" retrieves a book from the database based on the provided ID and sends the
 * response as JSON.
 * @param req - The `req` parameter is the request object, which contains information about the
 * incoming HTTP request, such as the request headers, request body, and request parameters.
 * @param res - The `res` parameter is the response object that is used to send a response back to the
 * client. It contains methods and properties that allow you to control the response, such as `json()`
 * which is used to send a JSON response, and `send()` which is used to send a plain text
 * @param next - The `next` parameter is a function that is used to pass control to the next middleware
 * function in the request-response cycle. It is typically used when you want to pass control to the
 * next middleware function after completing some operations in the current middleware function.
 */
const show = (req, res, next) => {
  let id = req.body.id;
  Book.findOne({ _id: id })
    .then((response) => {
      res.json(response);
    })
    .catch((error) => [
      res.json({
        message: "An error Occured!",
      }),
    ]);
};

/**
 * The function `store` is used to save a new book to a database and return a success message or an
 * error message.
 * @param req - The `req` parameter is an object that represents the HTTP request made by the client.
 * It contains information such as the request headers, request body, request method, request URL, and
 * other relevant information.
 * @param res - The `res` parameter is the response object that is used to send a response back to the
 * client. It contains methods and properties that allow you to control the response, such as
 * `res.json()` to send a JSON response, `res.send()` to send a plain text response, and `res
 * @param next - The `next` parameter is a function that is used to pass control to the next middleware
 * function in the request-response cycle. It is typically used when you want to pass control to the
 * next middleware function after completing some operations in the current middleware function.
 */
const store = (req, res, next) => {
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

/**
 * The function updates a book record in a database with the provided data.
 * @param req - The `req` parameter is an object that represents the HTTP request made by the client.
 * It contains information such as the request headers, request body, request method, request URL, and
 * other relevant information.
 * @param res - The `res` parameter is the response object that is used to send a response back to the
 * client. It contains methods and properties that allow you to control the response, such as
 * `res.json()` to send a JSON response, `res.send()` to send a plain text response, and `res
 * @param next - The `next` parameter is a callback function that is used to pass control to the next
 * middleware function in the request-response cycle. It is typically used when you want to pass
 * control to the next middleware function after completing some operations in the current middleware
 * function.
 */
const update = (req, res, next) => {
  console.log(req.body.coverpage);
  let id = req.body.id;

  let updateData = {
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    summary: req.body.summary,
    price: req.body.price,
    pdf: req.body.pdf,
    coverpage: req.body.coverpage,
  };

  Book.findOneAndUpdate({ _id: id }, { $set: updateData })
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

/**
 * The `destroy` function deletes a book from the database based on the provided ID.
 * @param req - The `req` parameter represents the HTTP request object, which contains information
 * about the incoming request such as the request headers, request parameters, request body, etc.
 * @param res - The `res` parameter is the response object that is used to send a response back to the
 * client. It contains methods and properties that allow you to control the response, such as `json()`
 * to send a JSON response, `send()` to send a plain text response, and `status()` to
 * @param next - The `next` parameter is a function that is used to pass control to the next middleware
 * function in the request-response cycle. It is typically used when you want to pass control to the
 * next middleware function after completing some operations in the current middleware function.
 */
const destroy = (req, res, next) => {
  let id = req.body.id;
  Book.findOneAndRemove({ _id: id })
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

/**
 * The function `findPriceRangeBook` takes in a request object and response object, retrieves the
 * starting and ending price from the request body, and queries the database to find books within the
 * specified price range, returning the response or an error message.
 * @param req - The `req` parameter is the request object, which contains information about the
 * incoming HTTP request, such as the request headers, request body, and request parameters. In this
 * case, it is used to access the starting price and ending price values from the request body.
 * @param res - The `res` parameter is the response object that is used to send a response back to the
 * client. It contains methods and properties that allow you to control the response, such as
 * `res.json()` to send a JSON response, `res.send()` to send a plain text response, and `res
 * @param next - The `next` parameter is a callback function that is used to pass control to the next
 * middleware function in the request-response cycle. It is typically used when you want to pass
 * control to the next middleware function after completing some operations in the current middleware
 * function.
 */
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

/**
 * The function `findBookByPublisher` takes a publisher ID as input and returns a JSON response
 * containing books with the matching publisher ID.
 * @param req - The `req` parameter is the request object that contains information about the incoming
 * request, such as the request headers, request body, request parameters, etc. It is typically
 * provided by the web framework or server handling the request.
 * @param res - The `res` parameter is the response object that is used to send a response back to the
 * client. It is an instance of the Express `Response` object and has methods like `json()` to send a
 * JSON response, `send()` to send a plain text response, and `status()` to
 * @param next - The `next` parameter is a function that is used to pass control to the next middleware
 * function in the request-response cycle. It is typically used when you want to pass control to the
 * next middleware function after completing some operations in the current middleware function.
 */
const findBookByPublisher = (req, res, next) => {
  let publisher_id = req.body.publisher_id;
  Book.find({ publisher_id: publisher_id })
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

/**
 * The function `findBookByGenre` takes a genre as input, searches for books with that genre in the
 * database, and returns the response or an error message.
 * @param req - The `req` parameter is the request object that contains information about the incoming
 * request, such as the request headers, request body, and request parameters.
 * @param res - The `res` parameter is the response object that is used to send a response back to the
 * client. It is an instance of the `http.ServerResponse` class in Node.js.
 * @param next - The `next` parameter is a function that is used to pass control to the next middleware
 * function in the request-response cycle. It is typically used when you want to pass control to the
 * next middleware function after completing some operations in the current middleware function.
 */
const findBookByGenre = (req, res, next) => {
  let genre = req.body.genre;
  Book.find({ genre: genre })
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

/**
 * The function `getAutherList` retrieves a list of distinct authors from a collection of books and
 * sends the response as JSON.
 * @param req - The `req` parameter is the request object, which contains information about the
 * incoming HTTP request, such as the request headers, request body, and request parameters.
 * @param res - The `res` parameter is the response object that is used to send a response back to the
 * client. It is an instance of the `http.ServerResponse` class in Node.js.
 * @param next - The `next` parameter is a function that is used to pass control to the next middleware
 * function in the request-response cycle. It is typically used when you want to pass control to the
 * next middleware function after completing some operations in the current middleware function.
 */
const getAutherList = (req, res, next) => {
  Book.distinct("author")
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
  findBookByPublisher,
  findBookByGenre,
  getAutherList,
};
