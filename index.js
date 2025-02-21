// Main file to start our API

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const categoryRoutes = require("./routes/category.route.js");
const errorHandler = require("./middlewares/errorHandler.js");

const URLDB =
  "mongodb+srv://Vintodevs:amj76CzcY4Ymqeqc@vintocluster.frlbn.mongodb.net/?retryWrites=true&w=majority&appName=VintoCluster";

const app = express();

mongoose
  .connect(URLDB)
  .then(() => {
    console.log("Mongoose Connect Successfully");
  })
  .catch((err) => {
    console.log("ERORRRRRRRRR");
  });

app.use(cors());
app.use(express.json());

// Here put your routes
// app.use("", );
app.use("/api/categories", categoryRoutes);
app.use(errorHandler);

app.listen(4000, () => {
  console.log("Server is listining on port 4000");
});
