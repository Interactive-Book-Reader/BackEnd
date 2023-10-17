const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * The `loginAdmin` function is used to authenticate an admin user by checking their username and
 * password against the database and returning a JWT token if the credentials are valid.
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
const loginAdmin = async (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;

  Admin.findOne({
    $or: [{ username: username }],
  }).then((admin) => {
    if (admin) {
      bcrypt.compare(password, admin.password, function (err, result) {
        if (err) {
          res.json({
            error: err,
          });
        }
        if (result) {
          let token = jwt.sign({ _id: admin._id }, "verySecretValue", {
            expiresIn: "2h",
          });
          res.json({
            message: "Login Successful",
            token,
            // expireToken,
          });
        } else {
          res.json({
            message: "Password does not matched!",
          });
        }
      });
    } else {
      res.json({
        message: "No Admin found!",
      });
    }
  });
};

/**
 * The `addAdmin` function is an asynchronous function that adds a new admin to the database if the
 * admin does not already exist.
 * @param req - The `req` parameter is an object that represents the HTTP request made by the client.
 * It contains information such as the request headers, request body, request method, and request URL.
 * @param res - The `res` parameter is the response object that is used to send a response back to the
 * client. It contains methods and properties that allow you to control the response, such as `json()`
 * to send a JSON response, `send()` to send a plain text response, and `status()` to
 * @param next - The `next` parameter is a callback function that is used to pass control to the next
 * middleware function in the request-response cycle. It is typically used when you want to pass
 * control to the next middleware function after completing some operations in the current middleware
 * function.
 */
const addAdmin = async (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;
  let email = req.body.email;
  let name = req.body.name;
  let profile_image = req.body.profile_image;

  Admin.findOne({
    $or: [{ username: username }],
  }).then((admin) => {
    if (admin) {
      res.json({
        message: "Admin is already exist.",
      });
    } else {
      bcrypt.hash(password, 10, function (err, hash) {
        if (err) {
          res.json({
            error: err,
          });
        }
        let admin = new Admin({
          username: username,
          password: hash,
          email: email,
          name: name,
          profile_image: profile_image,
        });
        admin
          .save()
          .then(() => {
            res.json({
              message: "Admin is added successfully.",
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

const update = (req, res, next) => {
  if (req.body.password !== undefined) {
    bcrypt.hash(req.body.password, 10, function (err, hashedPass) {
      if (err) {
        return res.status(500).json({
          error: err,
        });
      }
      Admin.findOneAndUpdate(
        { _id: req.body._id },
        {
          $set: {
            name: req.body.name,
            email: req.body.email,
            phonenumber: req.body.phonenumber,
            username: req.body.username,
            bio_data: req.body.bio_data,
            password: hashedPass,
            profile_image: req.body.logo,
          },
        }
      )
        .then(() => {
          res.json({
            message: "Admin data is updated successfully.",
          });
        })
        .catch((error) => {
          res.status(500).json({
            message: "An error occurred.",
            error: error.message, // Include the error message for debugging
          });
        });
    });
  } else {
    Admin.findOneAndUpdate(
      { _id: req.body._id },
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          phonenumber: req.body.phonenumber,
          username: req.body.username,
          bio_data: req.body.bio_data,
          profile_image: req.body.logo,
        },
      }
    )
      .then(() => {
        console.log("update");
        res.json({
          message: "Admin data is updated successfully.",
        });
      })
      .catch((error) => {
        res.status(500).json({
          message: "An error occurred.",
          error: error.message, // Include the error message for debugging
        });
      });
  }
};


/**
 * The function `getAdmin` retrieves an admin object from the database based on the provided ID and
 * sends it as a JSON response.
 * @param req - The `req` parameter is an object that represents the HTTP request made by the client.
 * It contains information such as the request method, request headers, request body, request
 * parameters, etc. In this case, `req.body.id` is used to retrieve the `id` property from the request
 * body
 * @param res - The `res` parameter is the response object that is used to send the response back to
 * the client. It contains methods and properties that allow you to set the response status, headers,
 * and body. In this code snippet, the `res` object is used to send a JSON response with either a
 * @param next - The `next` parameter is a function that is used to pass control to the next middleware
 * function in the request-response cycle. It is typically used when there is an error or when the
 * current middleware function has completed its task and wants to pass control to the next middleware
 * function.
 */
const getAdmin = async (req, res, next) => {
  const admin = await Admin.findById(req.body.id);
  if (!admin) {
    res.status(500).json({ success: false });
  } else {
    res.status(200).json(admin);
  }
};

module.exports = {
  loginAdmin,
  addAdmin,
  getAdmin,
  update,
};
