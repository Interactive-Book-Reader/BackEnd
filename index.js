/* This code is importing necessary modules and setting up the Express application. */
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyparser = require("body-parser");
const cors = require("cors");
const swaggerjsdoc = require("swagger-jsdoc");
const swaggerui = require("swagger-ui-express");

const app = express();
app.use(cors());

/* The `options` object is used to define the configuration for generating the OpenAPI documentation
using Swagger. */
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Interactive Book Reader",
      version: "0.1.0",
      description:
        "This is the project that is being doing as Semester 5 Project.",
      contact: {
        name: "H.W.K.Aravinda",
        email: "aravindahwk@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3001/",
      },
    ],
  },
  apis: ["./routes/book.js"],
};

/* The code `app.use(morgan("dev"));` is setting up the Morgan middleware, which is used for logging
HTTP requests. The "dev" parameter specifies the log format. */
app.use(morgan("dev"));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use("/uploads", express.static("uploads"));

/* The code `const spacs = swaggerjsdoc(options);` is creating a Swagger specification object using the
options defined earlier. This object will be used to generate the OpenAPI documentation. */
const spacs = swaggerjsdoc(options);
const BookRoute = require("./routes/book");
const AuthRoute = require("./routes/auth");
const UserRoute = require("./routes/user");
const DicRoute = require("./routes/dictionary");
const Read_BooksRoute = require("./routes/read_books");

/* The `mongoose.connect()` function is used to establish a connection to a MongoDB database. In this
code, it is connecting to a MongoDB Atlas cluster with the specified connection string. The
connection string contains the necessary information to connect to the database, including the
username, password, and the cluster URL. */
mongoose.connect(
  "mongodb+srv://Group3_SEP:TdxB2XR8PVZKJfvs@interactivebookreader.uscktdx.mongodb.net/Interactive_Book_Reader?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
/* This code is establishing a connection to a MongoDB database using Mongoose. */

const db = mongoose.connection;

db.on("error", (err) => {
  console.log(err);
});

db.once("open", () => {
  console.log("Database connection Established!");
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is runing on port ${PORT}`);
});

/* The code `app.use("/api-docs", swaggerui.serve, swaggerui.setup(spacs));` is setting up a route for
accessing the Swagger UI documentation. When a user navigates to "/api-docs" in the browser, the
Swagger UI will be served and displayed. */
app.use("/api-docs", swaggerui.serve, swaggerui.setup(spacs));
app.use("/api/book", BookRoute);
app.use("/api/publisher", AuthRoute);
app.use("/api/user", UserRoute);
app.use("/api/dictionary", DicRoute);
app.use("/api/read_books", Read_BooksRoute);
