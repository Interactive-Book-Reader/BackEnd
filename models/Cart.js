const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/* The code is defining a Mongoose schema for a book. */
const CartSchema = new Schema(
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

const Cart = mongoose.model("Cart", CartSchema);
module.exports = Cart;
