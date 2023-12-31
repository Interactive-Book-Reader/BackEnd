const express = require("express");
const router = express.Router();

/* This code is importing the `AdminController` module from the "../controllers/AdminController" file
and assigning it to the `AdminController` constant. */
const AdminController = require("../controllers/AdminController");

router.post("/login", AdminController.loginAdmin);
router.post("/register", AdminController.addAdmin);
router.post("/get", AdminController.getAdmin);
router.post("/update", AdminController.update);

module.exports = router;
