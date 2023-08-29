const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    username: {
      type: String,
    },
    password: {
      type: String,
    },
    bio_data: {
      type: String,
    },
    image_lisk:{
        type: String,
    }
   
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
