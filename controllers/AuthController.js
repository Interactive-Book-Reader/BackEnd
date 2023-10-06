const Publisher = require("../models/Publisher");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();
const PublisherOTPVerification = require("../models/PublisherOTPVerification");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASSWORD,
  },
});

/**
 * The `register` function checks if a publisher already exists in the database, and if not, it hashes
 * the password and saves the publisher's information.
 * @param req - The `req` parameter is an object that represents the HTTP request made by the client.
 * It contains information such as the request headers, request body, request method, request URL, and
 * other relevant details.
 * @param res - The `res` parameter is the response object that is used to send a response back to the
 * client. It contains methods and properties that allow you to control the response, such as `json()`
 * to send a JSON response, `send()` to send a plain text response, and `status()` to
 * @param next - The `next` parameter is a callback function that is used to pass control to the next
 * middleware function in the request-response cycle. It is typically used when you want to pass
 * control to the next middleware function after the current middleware function has completed its
 * task.
 */
const register = (req, res, next) => {
  Publisher.findOne({ username: req.body.username }).then((publisher) => {
    let registering = false;
    if (publisher) {
      if (publisher.verified === true) {
        res.json({
          message: "Publisher already exists.",
        });
      } else {
        registering = true;
      }
    } else {
      registering = true;
    }
    if (registering) {
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
          verified: false,
        });
        publisher
          .save()
          .then((result) => {
            console.log("success");
            sendOTPVerification(result, res);
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
    }
  });
};

/**
 * The function updates a Publisher's data in a database, including hashing the password if provided.
 * @param req - The `req` parameter represents the HTTP request object, which contains information
 * about the incoming request such as headers, parameters, body, etc.
 * @param res - The `res` parameter is the response object that is used to send the response back to
 * the client. It contains methods and properties that allow you to control the response, such as
 * setting the status code, sending JSON data, or redirecting the client to another URL.
 * @param next - The `next` parameter is a callback function that is used to pass control to the next
 * middleware function in the request-response cycle. It is typically used when you want to pass
 * control to the next middleware function after the current middleware function has completed its
 * task.
 * @returns In this code, if there is an error during the hashing process, the function will return a
 * JSON response with a status code of 500 and an error message. If the hashing process is successful,
 * the function will update the Publisher document in the database and return a JSON response with a
 * message indicating that the update was successful. If there is an error during the update process,
 * the function will return a
 */
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

/**
 * The login function checks if a publisher exists with the provided username or email, compares the
 * password with the stored password using bcrypt, and returns a JWT token if the login is successful.
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
          let token = jwt.sign({ _id: publisher._id }, "verySecretValue", {
            expiresIn: "2h",
          });

          // let expireToken = jwt.sign(
          //   { name: publisher.name },
          //   "expireverySecretValue",
          //   {
          //     expiresIn: "48h",
          //   }
          // );
          if (publisher.verified === false) {
            res.json({
              message: "Please verify your email address.",
            });
          } else if (publisher.verified === true) {
            res.json({
              message: "Login Successful",
              token,
              // expireToken,
            });
          }
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

/**
 * The function `getPublisher` retrieves a publisher from the database based on the provided ID and
 * sends a JSON response with the fetched publisher data or an error message.
 * @param req - The `req` parameter is the request object that contains information about the incoming
 * HTTP request, such as the request headers, request body, and request parameters.
 * @param res - The `res` parameter is the response object that is used to send a response back to the
 * client. It contains methods and properties that allow you to control the response, such as
 * `res.json()` to send a JSON response, `res.send()` to send a plain text response, and `res
 * @param next - The `next` parameter is a function that is used to pass control to the next middleware
 * function in the request-response cycle. It is typically used when there is an error or when the
 * current middleware function has completed its task and wants to pass control to the next middleware
 * function.
 */
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

/**
 * The deletePublisher function deletes a publisher from the database based on the provided _id and
 * returns a success or error message.
 * @param req - The req parameter is the request object, which contains information about the HTTP
 * request made by the client. It includes data such as the request headers, request body, request
 * method, and request URL.
 * @param res - The `res` parameter is the response object that is used to send a response back to the
 * client. It contains methods and properties that allow you to control the response, such as `json()`
 * to send a JSON response, `send()` to send a plain text response, and `status()` to
 * @param next - The `next` parameter is a function that is used to pass control to the next middleware
 * function in the request-response cycle. It is typically used when there is an error or when the
 * current middleware function has completed its task and wants to pass control to the next middleware
 * function.
 */
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

/**
 * The function `refreshToken` verifies a refresh token, generates a new access token, and sends it
 * back along with the refresh token.
 * @param req - The `req` parameter is the request object that contains information about the incoming
 * HTTP request, such as the request headers, request body, and request parameters. It is typically
 * provided by the web framework or server handling the request.
 * @param res - The `res` parameter is the response object that is used to send the response back to
 * the client. It contains methods and properties that allow you to control the response, such as
 * setting the status code, sending JSON data, or redirecting the client to a different URL.
 * @param next - The `next` parameter is a function that is used to pass control to the next middleware
 * function in the request-response cycle. It is typically used when you want to pass control to the
 * next middleware function after completing some operations in the current middleware function.
 */
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

/**
 * The function `getIDfromToken` extracts the user ID from a JWT token and sends it as a response in a
 * JSON format.
 * @param req - The `req` parameter is the request object that contains information about the incoming
 * HTTP request, such as headers, query parameters, and request body. It is an object that is passed to
 * the function as an argument.
 * @param res - The `res` parameter is the response object that is used to send a response back to the
 * client. It contains methods and properties that allow you to control the response, such as
 * `res.json()` which is used to send a JSON response.
 * @param next - The `next` parameter is a function that is used to pass control to the next middleware
 * function in the request-response cycle. It is typically used when you want to pass control to the
 * next middleware function after performing some operations in the current middleware function.
 */
const getIDfromToken = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, "verySecretValue");
  console.log(decoded._id);
  res.json({
    id: decoded._id,
  });
};

/**
 * The function `sendOTPVerification` sends an email with a randomly generated OTP (One-Time Password)
 * for email verification.
 * @param res - The `res` parameter is the response object that will be sent back to the client. It is
 * used to send the response data, such as JSON data or error messages, back to the client making the
 * request.
 */
const sendOTPVerification = async ({ _id, email }, res) => {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: "OTP for Email Verification",
      html: `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  padding: 20px;
              }
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #ffffff;
                  padding: 20px;
                  border-radius: 5px;
                  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
              }
              h1 {
                  color: #333;
              }
              p {
                  font-size: 16px;
                  line-height: 1.5;
                  color: #666;
              }
              .otp {
                  font-size: 24px;
                  font-weight: bold;
                  color: #007bff;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>Email Verification</h1>
              <p>Thank you for signing up for our Interactive Book Reader!</p>
              <p>To complete your registration and start enjoying a world of interactive books, please enter the OTP below:</p>
              <p>Your OTP for Email Verification is: <span class="otp">${otp}</span></p>
              <p>If you did not request this OTP, please ignore this email.</p>
          </div>
      </body>
      </html>
      
      `,
    };
    const saltRounds = 10;
    const hashOTP = await bcrypt.hash(otp.toString(), saltRounds);
    const newOTPVerfication = new PublisherOTPVerification({
      publisherId: _id,
      otp: hashOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    await newOTPVerfication.save();
    await transporter.sendMail(mailOptions);
    res.json({
      status: "Pending",
      message: "OTP is sent successfully.",
      data: {
        publisherId: _id,
        email,
      },
    });
  } catch (err) {
    res.json({
      status: "Failed",
      message: "OTP is not sent.",
      error: err.message,
    });
  }
};

/**
 * The function `verifyOTP` is an asynchronous function that verifies an OTP (One-Time Password) for a
 * publisher and updates their account status accordingly.
 * @param req - The `req` parameter is the request object that contains information about the HTTP
 * request made to the server. It includes properties such as the request headers, request body,
 * request method, request URL, etc. In this code snippet, `req.body` is used to access the request
 * body, which is
 * @param res - The `res` parameter is the response object that is used to send the response back to
 * the client. It contains methods and properties that allow you to control the response, such as
 * `res.json()` to send a JSON response, `res.status()` to set the HTTP status code, and `res
 */
const verifyOTP = async (req, res) => {
  try {
    const { publisherId, otp } = req.body;
    if (!publisherId || !otp) {
      throw new Error("Invalid OTP");
    } else {
      const PublisherOTPVerificationRecords =
        await PublisherOTPVerification.find({ publisherId });
      if (PublisherOTPVerificationRecords.length <= 0) {
        throw new Error(
          "Account record does not exist or has been verified already. Please sign up or login to continue."
        );
      } else {
        const { expiresAt } = PublisherOTPVerificationRecords[0];
        const hashOTP = PublisherOTPVerificationRecords[0].otp;

        if (expiresAt < Date.now()) {
          await PublisherOTPVerification.deleteMany({ publisherId });
          throw new Error("OTP has expired. Please sign up again.");
        } else {
          const validOTP = await bcrypt.compare(otp, hashOTP);

          if (!validOTP) {
            throw new Error(
              "Invalid code passed.Check your inbox and try again."
            );
          } else {
            await Publisher.updateOne({ _id: publisherId }, { verified: true });
            await PublisherOTPVerification.deleteMany({ publisherId });
            res.json({
              status: "Verified",
              message: "OTP is verified successfully.",
            });
          }
        }
      }
    }
  } catch (err) {
    res.json({
      status: "Failed",
      message: "OTP is not verified.",
      error: err.message,
    });
  }
};

/**
 * The `resendOTP` function is an asynchronous function that takes in a request and response object,
 * checks if the publisherId and email are provided, deletes any existing OTP verification records for
 * the publisherId, and then sends a new OTP verification email.
 * @param req - The `req` parameter is the request object that contains information about the HTTP
 * request made by the client. It includes properties such as headers, body, query parameters, and
 * more.
 * @param res - The `res` parameter is the response object that is used to send the response back to
 * the client. It is typically an instance of the Express `Response` object.
 */
const resendOTP = async (req, res) => {
  try {
    const { publisherId, email } = req.body;
    if (!publisherId || !email) {
      res.json({
        status: "Failed",
        message: "Invalid publisherId or email.",
      });
    } else {
      await PublisherOTPVerification.deleteMany({ publisherId });
      sendOTPVerification({ _id: publisherId, email }, res);
    }
  } catch (err) {
    res.json({
      status: "Failed",
      message: "OTP is not sent.",
      error: err.message,
    });
  }
};

const forgotpassword = async (req, res) => {
  const { username } = req.body;
  try {
    const oldUser = await Publisher.findOne({ username });
    if (!oldUser) {
      return res.status(404).json({ message: "User doesn't exist." });
    }
    const JWT_SECRET_KEY =
      "askfjjkfh98314bjbahsdfhdjfafhssdjkhfkdjhfadjshfjhfdjkfhdf381tfhjsafjsf";
    const secret_key = JWT_SECRET_KEY + oldUser.password;
    const token = jwt.sign({ username }, secret_key, { expiresIn: "5m" });
    const CLIENT_URL = `http://localhost:3000/auth/resetpassword/${oldUser._id}/${token}`;
    sendResetPasswordEmail(oldUser.email, CLIENT_URL);
    res.json({ message: "Password reset link has been sent to your email." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const resetpassword = async (req, res) => {
  const { id, token, password } = req.body;
  const oldUser = await Publisher.findOne({ _id: id });
  if (!oldUser) {
    return res.status(404).json({ message: "User doesn't exist." });
  }
  const JWT_SECRET_KEY =
    "askfjjkfh98314bjbahsdfhdjfafhssdjkhfkdjhfadjshfjhfdjkfhdf381tfhjsafjsf";
  const secret_key = JWT_SECRET_KEY + oldUser.password;
  try {
    jwt.verify(token, secret_key);
    bcrypt.hash(password, 10, function (err, hashedPass) {
      if (err) {
        res.json({
          error: err,
        });
      } else {
        Publisher.findOneAndUpdate(
          { _id: id },
          {
            $set: {
              password: hashedPass,
            },
          }
        )
          .then(() => {
            res.json({
              message: "Password is updated successfully.",
            });
          })
          .catch((error) => {
            res.status(500).json({
              message: "An error occurred.",
              error: error.message, // Include the error message for debugging
            });
          });
      }
    });
  } catch (err) {
    res.json({ message: err.message });
  }
  // res.send("Done");
};

const sendResetPasswordEmail = async (email, link) => {
  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: "Password Reset Request",
    html: `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  padding: 20px;
              }
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #ffffff;
                  padding: 20px;
                  border-radius: 5px;
                  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
              }
              h1 {
                  color: #333;
              }
              p {
                  font-size: 16px;
                  line-height: 1.5;
                  color: #666;
              }
              .reset-link {
                  font-size: 16px;
                  font-weight: bold;
                  color: #007bff;
                  text-decoration: none;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>Password Reset Request</h1>
              <p>We received a request to reset your password for Interactive Book Reader.</p>
              <p>If this request was not initiated by you, please ignore this email.</p>
              <p>To reset your password, click the following link:</p>
              <p><a class="reset-link" href="${link}">Reset Password</a></p>

              <p>If the link above doesn't work, you can copy and paste the following URL into your browser:</p>
              <p>${link}</p>
              <p>This link will expire after a certain period of time for security reasons.</p>
              <p>If you have any questions or need further assistance, please contact our support team.</p>
          </div>
      </body>
      </html>
      `,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = {
  register,
  login,
  update,
  getPublisher,
  deletePublisher,
  refreshToken,
  getIDfromToken,
  verifyOTP,
  resendOTP,
  forgotpassword,
  resetpassword,
};
