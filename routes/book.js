const express = require("express");
const router = express.Router();

/* The code is importing the `BookController` module from the "../controllers/BookController" file and
assigning it to the `BookController` constant. */
const BookController = require("../controllers/BookController");

router.get("/", BookController.index);
router.post("/show", BookController.show);
router.post("/store", BookController.store);
router.post("/update", BookController.update);
router.post("/delete", BookController.destroy);
router.post("/pricebook", BookController.findPriceRangeBook);
router.post("/publisherbook", BookController.findBookByPublisher);
router.post("/genrebook", BookController.findBookByGenre);
router.get("/autherlist", BookController.getAutherList);

module.exports = router;
