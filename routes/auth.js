const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/AuthController");
const authenticate = require("../middleware/authenticate");

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/update", authenticate,AuthController.update);
router.post("/getPublisher", AuthController.getPublisher);
router.post("/deletePublisher", AuthController.deletePublisher);
router.post("/refreshToken", AuthController.refreshToken);
router.post("/getDetailsfromToken", AuthController.getDetailsfromToken);

module.exports = router;
