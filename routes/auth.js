const express = require("express");
const router = express.Router();

/* The code is importing the `AuthController` module from the "../controllers/AuthController" file and
the `authenticate` middleware from the "../middleware/authenticate" file. */
const AuthController = require("../controllers/AuthController");
const authenticate = require("../middleware/authenticate");


router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/update", AuthController.update);
router.post("/getPublisher", AuthController.getPublisher);
router.post("/deletePublisher", AuthController.deletePublisher);
router.post("/refreshToken", AuthController.refreshToken);
router.post("/getIDfromToken", AuthController.getIDfromToken);
router.post("/verifyOTP", AuthController.verifyOTP);
router.post("/resendOTP", AuthController.resendOTP);
router.post("/forgotPassword", AuthController.forgotpassword);

module.exports = router;
