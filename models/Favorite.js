const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/* The code is defining a Mongoose schema for a book. */
const FavoriteSchema = new Schema(
  {
    book_id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  { timestamps: true }
);

const Favorite = mongoose.model("Favorite", FavoriteSchema);
module.exports = Favorite;
