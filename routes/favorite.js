const express = require("express");
const router = express.Router();

/* The code is importing the `FavoriteController` module from the
"../controllers/FavoriteController" file and assigning it to the `FavoriteController` constant. */
const FavoriteController = require("../controllers/FavoriteController");

router.post("/getfavorite", FavoriteController.getFavorite);
router.post("/addbook", FavoriteController.addbook);

module.exports = router;