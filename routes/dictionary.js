const express = require("express");
const router = express.Router();

const DictionaryController = require("../controllers/DictionaryController");

router.post("/add", DictionaryController.add);
router.post("/update", DictionaryController.update);
router.post("/remove", DictionaryController.remove);
router.post("/get", DictionaryController.getAll);
router.post("/getOne", DictionaryController.getOne);

module.exports = router;
