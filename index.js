const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyparser = require("body-parser");
const cors = require("cors");
const swaggerjsdoc = require("swagger-jsdoc");
const swaggerui = require("swagger-ui-express");

const app = express();
app.use(cors());

const options = {
  definition: {
    openapi: "3.0.0",
    info:{
      title: "Interactive Book Reader",
      version: "0.1.0",
      description:
        "This is the project that is being doing as Semester 5 Project.",
      contact:{
        name : "H.W.K.Aravinda",
        email: "aravindahwk@gmail.com",
      }
    },
    servers: [
      {
        url: "http://localhost:3001/",
      },
    ],
  },
  apis: ["./routes/book.js"],
};

app.use(morgan("dev"));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use("/uploads", express.static("uploads"));

const spacs = swaggerjsdoc(options);
const BookRoute = require("./routes/book");
const AuthRoute = require("./routes/auth");

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

app.use("/api-docs", swaggerui.serve, swaggerui.setup(spacs));
app.use("/api/book", BookRoute);
app.use("/api/publisher", AuthRoute);
