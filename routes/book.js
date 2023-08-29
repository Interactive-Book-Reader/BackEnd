const express = require("express");
const router = express.Router();

const BookController = require("../controllers/BookController");

router.get("/", BookController.index);
router.post("/show", BookController.show);
router.post("/store", BookController.store);
router.post("/update", BookController.update);
router.post("/delete", BookController.destroy);
router.post("/pricebook", BookController.findPriceRangeBook);

module.exports = router;
