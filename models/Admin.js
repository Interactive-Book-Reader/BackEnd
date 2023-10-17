const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/* This code is defining a Mongoose schema for an "Admin" model. */
const adminSchema = new Schema(
  {
    username: {
      type: String,
    },
    password: {
      type: String,
    },
    email: {
      type: String,
    },
    name: {
      type: String,
    },
    profile_image: {
      type: String,
    },
    phonenumber: {
      type: String,
    },
    bio_data: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema);
