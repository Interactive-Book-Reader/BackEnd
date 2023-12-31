const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/* The code is defining a Mongoose schema for a user object. The schema specifies the structure and
data types of the user object. */
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
    phonenumber: {
      type: String,
    },
    image_link:{
        type: String,
    }
   
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
