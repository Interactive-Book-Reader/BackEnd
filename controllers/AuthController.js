const Publisher = require("../models/Publisher");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
require("dotenv").config();
const PublisherOTPVerification = require("../models/PublisherOTPVerification");

let transporter=nodemailer.createTransport({
  service: 'gmail',
  auth:{
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASSWORD
  }
});

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
      .then((result) => {
        console.log("success")
        sendOTPVerification(result,res);
        // res.json({
        //   message: "Publisher is added successfully.",
        // });
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
        return res.status(500).json({
          error: err,
        });
      }
      Publisher.findOneAndUpdate(
        { _id: req.body._id },
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
          res.status(500).json({
            message: "An error occurred.",
            error: error.message, // Include the error message for debugging
          });
        });
    });
  } else {
    Publisher.findOneAndUpdate(
      { _id: req.body._id },
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
        console.log("update");
        res.json({
          message: "Publisher data is updated successfully.",
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
            expiresIn: "2h",
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

const sendOTPVerification = async({_id,email},res) => {
  console.log(_id,email)
  try{
    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log(otp);
    console.log(process.env.AUTH_EMAIL);

    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: 'OTP for Email Verification',
      html: `<h1>OTP for Email Verification is <b>${otp}</b></h1>`
    };

    const saltRounds = 10;
    const hashOTP= await bcrypt.hash(toString(otp), saltRounds);
    const newOTPVerfication =new PublisherOTPVerification({
      publisherId: _id,
      otp: hashOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 5*60*1000
    });

    await newOTPVerfication.save();
    await transporter.sendMail(mailOptions);
    res.json({
      status: "Pending",
      message: "OTP is sent successfully.",
      data:{
        publisherId: _id,
        email,
      }
    });
  }
  catch(err){
    res.json({
      status: "Failed",
      message: "OTP is not sent.",
      error: err.message
  });

}
}



module.exports = {
  register,
  login,
  update,
  getPublisher,
  deletePublisher,
  refreshToken,
  getIDfromToken,
};
