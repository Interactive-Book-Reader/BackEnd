const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const publisherSchema = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    phonenumber: {
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
    year_stabilized: {
      type: Number,
    },
    logo:{
      type: String,
    },
    verified: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

const Publisher = mongoose.model("Publisher", publisherSchema);
module.exports = Publisher;
