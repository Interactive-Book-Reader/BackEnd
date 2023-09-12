const express = require("express");
const router = express.Router();

const Read_BooksController = require("../controllers/Read_BooksController");

router.get("/getdetails", Read_BooksController.getdetails);
router.post("/addbook", Read_BooksController.addbook);

module.exports = router;