const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/AuthController");

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/update", AuthController.update);
router.post("/getPublisher", AuthController.getPublisher);
router.post("/deletePublisher", AuthController.deletePublisher);

module.exports = router;
