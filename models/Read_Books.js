const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Read_BooksSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    book_id: {
        type: mongoose.Schema.Types.ObjectId,
    }
});

const Read_Books = mongoose.model('Read_Books', Read_BooksSchema);

module.exports = Read_Books;