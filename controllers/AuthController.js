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
      .then(() => {
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

const update = (req, res, next) => {
  if (req.body.password !== undefined) {
    bcrypt.hash(req.body.password, 10, function (err, hashedPass) {
      if (err) {
        res.json({
          error: err,
        });
      }
      Publisher.findOneAndUpdate(
        { _id: req.body._id},
        {
          $set: {
            name: req.body.name,
            email: req.body.email,
            phonenumber: req.body.phonenumber,
            username: req.body.username,
            bio_data: req.body.bio_data,
            password: hashedPass,
            year_stabilized: req.body.year_stabilized,
            logo: req.body.logo,
          },
        }
      )
        .then(() => {
          res.json({
            message: "Publisher data is updated successfully.",
          });
        })
        .catch((error) => {
          res.json({
            message: "An error is occured.",
          });
        });
    });
  } else {
    Publisher.findOneAndUpdate(
      { username: req.body.username },
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          phonenumber: req.body.phonenumber,
          username: req.body.username,
          bio_data: req.body.bio_data,
          year_stabilized: req.body.year_stabilized,
          logo: req.body.logo,
        },
      }
    )
      .then(() => {
        res.json({
          message: "Publisher data is updated successfully.",
        });
      })
      .catch((error) => {
        res.json({
          message: "An error is occured.",
        });
      });
  }
};

const login = (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;
  let email = req.body.email;

  Publisher.findOne({
    $or: [{ email: email }, { username: username }],
  }).then((publisher) => {
    if (publisher) {
      bcrypt.compare(password, publisher.password, function (err, result) {
        if (err) {
          res.json({
            error: err,
          });
        }
        if (result) {
          let token = jwt.sign({ _id:publisher._id }, "verySecretValue", {
            expiresIn: "1h",
          });

          // let expireToken = jwt.sign(
          //   { name: publisher.name },
          //   "expireverySecretValue",
          //   {
          //     expiresIn: "48h",
          //   }
          // );

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
        message: "No publisher found!",
      });
    }
  });
};

const getPublisher = (req, res, next) => {
  Publisher.findOne({ _id: req.body._id })
    .then((publisher) => {
      res.json({
        message: "Publisher data is fetched successfully.",
        publisher: publisher,
      });
    })
    .catch((error) => {
      res.json({
        message: "An error is occured.",
      });
    });
};

const deletePublisher = (req, res, next) => {
  Publisher.findOneAndDelete({ _id: req.body._id })
    .then(() => {
      res.json({
        message: "Publisher data is deleted successfully.",
      });
    })
    .catch(() => {
      res.json({
        message: "An error is occured.",
      });
    });
};

const refreshToken = (req, res, next) => {
  const refreshToken = req.body.refreshToken;
  jwt.verify(refreshToken, "expireverySecretValue", (err, user) => {
    if (err) {
      res.sendStatus(403).json({
        message: "Invalid refresh token",
      });
    } else {
      let token = jwt.sign({ name: publisher.name }, "thesecrettoken", {
        expiresIn: "60s",
      });
      let refreshToken = req.body.refreshToken;
      re.status(200).json({
        token: token,
        refreshToken: refreshToken,
        message: "Token is refreshed",
      });
    }
  });
};

const getIDfromToken = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, "verySecretValue");
  console.log(decoded._id);
  res.json
  ({
    id: decoded._id
  });
};

module.exports = {
  register,
  login,
  update,
  getPublisher,
  deletePublisher,
  refreshToken,
  getIDfromToken
};
