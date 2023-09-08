const Dictinary = require("../models/Dictinary");

const add = (req, res, next) => {
  Dictinary.findOne({ word: req.body.word, user_id: req.body.user_id }).then(
    (data) => {
      if (data) {
        res.json({
          message: "Word is already exist.",
        });
      } else {
        let dictinary = new Dictinary({
          user_id: req.body.user_id,
          word: req.body.word,
          meaning: req.body.meaning,
          example: req.body.example,
        });
        dictinary
          .save()
          .then(() => {
            res.json({
              message: "Word is added successfully.",
            });
          })
          .catch((error) => {
            res.json({
              message: "An error is occured.",
            });
          });
      }
    }
  );
};

const update = (req, res, next) => {
  Dictinary.findOneAndUpdate(
    { _id: req.body._id },
    {
      $set: {
        word: req.body.word,
        meaning: req.body.meaning,
        example: req.body.example,
      },
    }
  )
    .then(() => {
      res.json({
        message: "Word is updated successfully.",
      });
    })
    .catch((error) => {
      res.json({
        message: "An error is occured.",
      });
    });
};

const remove = (req, res, next) => {
  Dictinary.findByIdAndDelete({ _id: req.body._id })
    .then(() => {
      res.json({
        message: "Word is deleted successfully.",
      });
    })
    .catch((error) => {
      res.json({
        message: "An error is occured.",
      });
    });
};

const getAll = (req, res, next) => {
  Dictinary.find({ user_id: req.body.user_id })
    .then((data) => {
      res.json({
        data: data,
      });
    })
    .catch((error) => {
      res.json({
        message: "An error is occured.",
      });
    });
};

const getOne = (req, res, next) => {
  Dictinary.findById({ _id: req.body._id })
    .then((data) => {
      res.json({
        data: data,
      });
    })
    .catch((error) => {
      res.json({
        message: "An error is occured.",
      });
    });
};

module.exports = {
  add,
  update,
  remove,
  getAll,
  getOne,
};
