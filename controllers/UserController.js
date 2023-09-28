const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * The `register` function checks if a user already exists in the database, and if not, it hashes the
 * password and saves the user's information.
 * @param req - The `req` parameter is an object that represents the HTTP request made by the client.
 * It contains information such as the request headers, request body, request method, and request URL.
 * @param res - The `res` parameter is the response object that is used to send a response back to the
 * client. It contains methods and properties that allow you to control the response, such as `json()`
 * to send a JSON response, `send()` to send a plain text response, and `status()` to
 * @param next - The `next` parameter is a callback function that is used to pass control to the next
 * middleware function in the request-response cycle. It is typically used when you want to pass
 * control to the next middleware function after the current middleware function has completed its
 * task.
 */
const register = (req, res, next) => {
  User.findOne({ username: req.body.username }).then((user) => {
    if (user) {
      res.json({
        message: "User already exists.",
      });
    } else {
      bcrypt.hash(req.body.password, 10, function (err, hashedPass) {
        if (err) {
          res.json({
            error: err,
          });
        }
        let user = new User({
          name: req.body.name,
          email: req.body.email,
          username: req.body.username,
          password: hashedPass,
          bio_data: req.body.bio_data,
          phonenumber: req.body.phonenumber,
          image_link: req.body.image_link,
        });
        user
          .save()
          .then(() => {
            res.json({
              message: "User is added successfully.",
            });
          })
          .catch((error) => {
            res.json({
              message: "An error is occured.",
            });
          });
      });
    }
  });
};

/**
 * The function updates user data in a database, including password hashing if a new password is
 * provided.
 * @param req - The `req` parameter represents the HTTP request object, which contains information
 * about the incoming request such as the request headers, request parameters, request body, etc.
 * @param res - The `res` parameter is the response object that is used to send a response back to the
 * client. It contains methods and properties that allow you to control the response, such as `json()`
 * to send a JSON response, `send()` to send a plain text response, and `status()` to
 * @param next - The `next` parameter is a callback function that is used to pass control to the next
 * middleware function in the request-response cycle. It is typically used when you want to pass
 * control to the next middleware function after the current middleware function has completed its
 * task.
 */
const update = (req, res, next) => {
  if (req.body.password !== undefined) {
    bcrypt.hash(req.body.password, 10, function (err, hashedPass) {
      if (err) {
        res.json({
          error: err,
        });
      }
      User.findOneAndUpdate(
        { _id: req.body.id },
        {
          $set: {
            name: req.body.name,
            email: req.body.email,
            username: req.body.username,
            bio_data: req.body.bio_data,
            password: hashedPass,
            phonenumber: req.body.phonenumber,
            image_link: req.body.image_link,
          },
        }
      )
        .then(() => {
          res.json({
            message: "User data is updated successfully.",
          });
        })
        .catch((error) => {
          res.json({
            message: "An error is occured.",
          });
        });
    });
  } else {
    User.findOneAndUpdate(
      { _id: req.body.id },
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          username: req.body.username,
          bio_data: req.body.bio_data,
          phonenumber: req.body.phonenumber,
          image_link: req.body.image_link,
        },
      }
    )
      .then(() => {
        res.json({
          message: "User data is updated successfully.",
        });
      })
      .catch((error) => {
        res.json({
          message: "An error is occured.",
        });
      });
  }
};

/**
 * The login function checks if a user exists and if the password matches, and returns a token if
 * successful.
 * @param req - The `req` parameter is the request object that contains information about the incoming
 * HTTP request, such as the request headers, request body, and request parameters.
 * @param res - The `res` parameter is the response object that is used to send the response back to
 * the client. It contains methods and properties that allow you to control the response, such as
 * `json()` to send a JSON response, `send()` to send a plain text response, and `status()` to
 * @param next - The `next` parameter is a callback function that is used to pass control to the next
 * middleware function in the request-response cycle. It is typically used when you want to pass
 * control to the next middleware function after the current middleware function has completed its
 * task.
 */
const login = (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;

  User.findOne({ $or: [{ username: username }] }).then((user) => {
    if (user) {
      bcrypt.compare(password, user.password, function (err, result) {
        if (err) {
          res.json({
            error: err,
          });
        }
        if (result) {
          let token = jwt.sign({ _id: user._id }, "verySecretValue", {
            expiresIn: "1h",
          });
          res.json({
            message: "Login successful.",
            token,
          });
        } else {
          res.json({
            message: "Password does not matched.",
          });
        }
      });
    } else {
      res.json({
        message: "No user found.",
      });
    }
  });
};

/**
 * The getUser function retrieves user data based on the provided ID and sends a response with the user
 * data or an error message.
 * @param req - The `req` parameter is the request object that contains information about the incoming
 * HTTP request, such as the request headers, request body, request method, and request URL. It is
 * provided by the Express.js framework.
 * @param res - The `res` parameter is the response object that is used to send the response back to
 * the client. It contains methods and properties that allow you to control the response, such as
 * `json()` method to send a JSON response, `send()` method to send a plain text response, `status()`
 * @param next - The `next` parameter is a function that is used to pass control to the next middleware
 * function in the request-response cycle. It is typically used when you want to pass control to the
 * next middleware function after completing some operations in the current middleware function.
 */
const getUser = (req, res, next) => {
  User.find({ _id: req.body.id })
    .then((user) => {
      res.json({
        message: "User data is fetched successfully.",
        user,
      });
    })
    .catch((error) => {
      res.json({
        message: "An error is occured.",
      });
    });
};

/**
 * The deleteUser function deletes a user from the database based on their username and returns a
 * success message if the deletion is successful, or an error message if an error occurs.
 * @param req - The `req` parameter is the request object that contains information about the incoming
 * HTTP request, such as the request headers, request parameters, request body, etc. In this case,
 * `req.body` is used to access the request body, which is expected to contain the username of the user
 * to be
 * @param res - The `res` parameter is the response object that is used to send a response back to the
 * client. It contains methods and properties that allow you to control the response, such as `json()`
 * to send a JSON response, `send()` to send a plain text response, and `status()` to
 * @param next - The `next` parameter is a function that is used to pass control to the next middleware
 * function in the request-response cycle. It is typically used when there is an error or when the
 * current middleware function has completed its task and wants to pass control to the next middleware
 * function.
 */
const deleteUser = (req, res, next) => {
  User.findOneAndDelete({ username: req.body.username })
    .then(() => {
      res.json({
        message: "User is deleted successfully.",
      });
    })
    .catch((error) => {
      res.json({
        message: "An error is occured.",
      });
    });
};

module.exports = {
  register,
  login,
  update,
  getUser,
  deleteUser,
};
