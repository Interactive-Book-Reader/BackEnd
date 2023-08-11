const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyparser = require("body-parser");
const cors = require('cors');

const app = express();
app.use(cors());

app.use(morgan("dev"));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use('/uploads',express.static('uploads'))

const BookRoute=require('./routes/book')

mongoose.connect(
  "mongodb+srv://Group3_SEP:TdxB2XR8PVZKJfvs@interactivebookreader.uscktdx.mongodb.net/Interactive_Book_Reader?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;

db.on("error", (err) => {
  console.log(err);
});

db.once("open", () => {
  console.log("Database connection Established!");
});


const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is runing on port ${PORT}`);
});

app.use('/api/book',BookRoute)