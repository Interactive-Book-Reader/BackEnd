const express = require("express");
const router = express.Router();

/* The code is importing the `CartController` module from the
"../controllers/CartController" file and assigning it to the `CartController` constant. */
const CartController = require("../controllers/CartController");

router.post("/getcart", CartController.getCart);
router.post("/addbook", CartController.addbook);
router.post("/deletebook", CartController.deletebook);
router.post("/getbooksforuser", CartController.getBooksForUser);
router.post("/checkbookforuser", CartController.checkBookForUser);

module.exports = router;
