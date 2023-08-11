const express = require("express");
const router = express.Router();

const BookController = require("../controllers/BookController");
const upload=require('../middleware/upload')

router.get("/", BookController.index);
router.post("/show", BookController.show);
router.post("/store", upload.single('pdf'),BookController.store);
router.post("/update", BookController.update);
router.post("/delete", BookController.destroy);

module.exports = router;
