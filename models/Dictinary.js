const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dictinarySchema = new Schema(
    {
        user_id: {
            type: String,
        },
        word: {
            type: String,
        },
        meaning: {
            type: String,
        },
        example: {
            type: String,
        },
    },
    { timestamps: true }
);

const Dictinary = mongoose.model("Dictinary", dictinarySchema);
module.exports = Dictinary;
