const Publisher = require("../models/Publisher");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = (req, res, next) => {
  bcrypt.hash(req.body.password, 10, function (err, hashedPass) {
    if (err) {
      res.json({
        error: err,
      });
    }
    let publisher = new Publisher({
      name: req.body.name,
      email: req.body.email,
      phonenumber: req.body.phonenumber,
      username: req.body.username,
      password: hashedPass,
      bio_data: req.body.bio_data,
      year_stabilized: req.body.year_stabilized,
    });
    publisher
      .save()
      .then((publisher) => {
        res.json({
          message: "Publisher is added successfully.",
        });
      })
      .catch((error) => {
        res.json({
          message: "An error is occured.",
        });
      });
  });
};

const login = (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;

  Publisher.findOne({
    $or: [{ email: username }, { username: username }],
  }).then((publisher) => {
    if (publisher) {
      bcrypt.compare(password, publisher.password, function (err, result) {
        if (err) {
          res.json({
            error: err,
          });
        }
        if (result) {
          let token = jwt.sign({ name: publisher.name }, "verySecretValue", {
            expiresIn: "1h",
          });
          res.json({
            message: "Login Successful",
            token,
          });
        } else {
          res.json({
            message: "Password does not matched!",
          });
        }
      });
    } else {
      res.json({
        message: "No publisher found!",
      });
    }
  });
};

module.exports = {
  register,
  login,
};
