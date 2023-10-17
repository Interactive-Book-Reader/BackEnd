const express = require("express");
const router = express.Router();

/* This code is creating a router object using the Express framework and defining several routes for
user-related operations. */
const UserController = require("../controllers/UserController");

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.post("/update", UserController.update);
router.post("/getUser", UserController.getUser);
router.post("/deleteUser", UserController.deleteUser);
router.get("/getAllUsers", UserController.getAllUsers);

module.exports = router;
