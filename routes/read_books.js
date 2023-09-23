const express = require("express");
const router = express.Router();

/* The code is importing the `Read_BooksController` module from the
"../controllers/Read_BooksController" file and assigning it to the `Read_BooksController` constant. */
const Read_BooksController = require("../controllers/Read_BooksController");

router.post("/getdetails", Read_BooksController.getdetails);
router.post("/addbook", Read_BooksController.addbook);

module.exports = router;