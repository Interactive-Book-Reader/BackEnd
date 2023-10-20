const express = require("express");
const router = express.Router();

/* The code is importing the `CartController` module from the
"../controllers/CartController" file and assigning it to the `CartController` constant. */
const CartController = require("../controllers/CartController");

router.get("/getcart", CartController.getCart);
router.post("/addbook", CartController.addbook);

module.exports = router;
