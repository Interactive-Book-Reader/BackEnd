const express = require("express");
const router = express.Router();

const UserController = require("../controllers/UserController");

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.post("/update", UserController.update);
router.post("/getUser", UserController.getUser);
router.post("/deleteUser", UserController.deleteUser);

module.exports = router;
