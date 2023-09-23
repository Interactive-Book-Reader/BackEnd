const Dictinary = require("../models/Dictinary");

/**
 * The `add` function checks if a word already exists in a dictionary and adds it if it doesn't.
 * @param req - The `req` parameter is an object that represents the HTTP request made by the client.
 * It contains information such as the request headers, request body, request method, request URL, etc.
 * @param res - The `res` parameter is the response object that is used to send a response back to the
 * client. It contains methods and properties that allow you to control the response, such as `json()`
 * to send a JSON response, `send()` to send a plain text response, and `status()` to
 * @param next - The `next` parameter is a callback function that is used to pass control to the next
 * middleware function in the request-response cycle. It is typically used when you want to pass
 * control to the next middleware function after the current middleware function has completed its
 * task.
 */
const add = (req, res, next) => {
  Dictinary.findOne({ word: req.body.word, user_id: req.body.user_id }).then(
    (data) => {
      if (data) {
        res.json({
          message: "Word is already exist.",
        });
      } else {
        let dictinary = new Dictinary({
          user_id: req.body.user_id,
          word: req.body.word,
          meaning: req.body.meaning,
          example: req.body.example,
        });
        dictinary
          .save()
          .then(() => {
            res.json({
              message: "Word is added successfully.",
            });
          })
          .catch((error) => {
            res.json({
              message: "An error is occured.",
            });
          });
      }
    }
  );
};

/**
 * The `update` function updates a word in a dictionary by finding the word with the given ID and
 * updating its word, meaning, and example fields with the values provided in the request body.
 * @param req - The `req` parameter represents the HTTP request object, which contains information
 * about the incoming request such as headers, parameters, body, etc.
 * @param res - The `res` parameter is the response object that is used to send a response back to the
 * client. It contains methods and properties that allow you to control the response, such as `json()`
 * to send a JSON response, `send()` to send a plain text response, and `status()` to
 * @param next - The `next` parameter is a callback function that is used to pass control to the next
 * middleware function in the request-response cycle. It is typically used when you want to pass
 * control to the next middleware function after completing some operations in the current middleware
 * function.
 */
const update = (req, res, next) => {
  Dictinary.findOneAndUpdate(
    { _id: req.body._id },
    {
      $set: {
        word: req.body.word,
        meaning: req.body.meaning,
        example: req.body.example,
      },
    }
  )
    .then(() => {
      res.json({
        message: "Word is updated successfully.",
      });
    })
    .catch((error) => {
      res.json({
        message: "An error is occured.",
      });
    });
};

/**
 * The `remove` function deletes a word from a dictionary by its ID and returns a success message or an
 * error message.
 * @param req - The `req` parameter represents the HTTP request object, which contains information
 * about the incoming request such as the request headers, request parameters, request body, etc.
 * @param res - The `res` parameter is the response object that is used to send a response back to the
 * client. It contains methods and properties that allow you to control the response, such as `json()`
 * to send a JSON response, `send()` to send a plain text response, and `status()` to
 * @param next - The `next` parameter is a function that is used to pass control to the next middleware
 * function in the request-response cycle. It is typically used when you want to pass control to the
 * next middleware function after completing some operations in the current middleware function.
 */
const remove = (req, res, next) => {
  Dictinary.findByIdAndDelete({ _id: req.body._id })
    .then(() => {
      res.json({
        message: "Word is deleted successfully.",
      });
    })
    .catch((error) => {
      res.json({
        message: "An error is occured.",
      });
    });
};

/**
 * The function `getAll` retrieves data from a dictionary collection based on the user ID provided in
 * the request body and sends the data as a JSON response, or sends an error message if an error
 * occurs.
 * @param req - The `req` parameter is the request object, which contains information about the
 * incoming HTTP request, such as the request headers, request body, and request parameters.
 * @param res - The `res` parameter is the response object that is used to send a response back to the
 * client. It contains methods and properties that allow you to control the response, such as `json()`
 * to send a JSON response, `send()` to send a plain text response, and `status()` to
 * @param next - The `next` parameter is a function that is used to pass control to the next middleware
 * function in the request-response cycle. It is typically used when you want to pass control to the
 * next middleware function after completing some operations in the current middleware function.
 */
const getAll = (req, res, next) => {
  Dictinary.find({ user_id: req.body.user_id })
    .then((data) => {
      res.json({
        data: data,
      });
    })
    .catch((error) => {
      res.json({
        message: "An error is occured.",
      });
    });
};

/**
 * The function `getOne` retrieves a document from a dictionary collection in a database based on the
 * provided `_id` and sends the data as a JSON response, or sends an error message if an error occurs.
 * @param req - The `req` parameter is the request object, which contains information about the
 * incoming HTTP request, such as the request headers, request body, and request parameters.
 * @param res - The `res` parameter is the response object that is used to send a response back to the
 * client. It has methods like `json()` to send a JSON response, `send()` to send a plain text
 * response, and `status()` to set the HTTP status code of the response.
 * @param next - The `next` parameter is a function that is used to pass control to the next middleware
 * function in the request-response cycle. It is typically used when you want to pass control to the
 * next middleware function after completing some operations in the current middleware function.
 */
const getOne = (req, res, next) => {
  Dictinary.findById({ _id: req.body._id })
    .then((data) => {
      res.json({
        data: data,
      });
    })
    .catch((error) => {
      res.json({
        message: "An error is occured.",
      });
    });
};

module.exports = {
  add,
  update,
  remove,
  getAll,
  getOne,
};
