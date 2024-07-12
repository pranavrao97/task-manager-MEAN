const express = require("express");
const bodyParser = require("body-parser");
const { mongoose } = require("./db/mongoose");
const listRoutes = require("./routes/lists.route");
const userRoutes = require("./routes/users.route");

const app = express();

// Middlewares
app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:4200"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS"
  );
  res.header(
    "Access-Control-Expose-Headers",
    "x-access-token, x-refresh-token, _id"
  );
  next();
});

// Route Handlers

app.use("/lists", listRoutes);
app.use("/users", userRoutes);

// Start Server
app.listen("3000", () => {
  console.log("server started on port 3000");
});
