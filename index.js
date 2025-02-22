// Main file to start our API
require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const categoryRoutes = require("./routes/category.route.js");
const itemOrderedRoutes = require("./routes/itemOrdered.route.js");
const errorHandler = require("./middlewares/errorHandler.js");
const app = express();

const URLDB =
  "mongodb+srv://Vintodevs:amj76CzcY4Ymqeqc@vintocluster.frlbn.mongodb.net/?retryWrites=true&w=majority&appName=VintoCluster"


mongoose
  .connect(URLDB)
  .then(() => {
    console.log("Mongoose Connect Successfully");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(cors());
app.use(express.json());

app.use("/api/categories", categoryRoutes);
app.use("/api/itemOrdered", itemOrderedRoutes);
app.use(errorHandler);

app.listen(4000, () => {
  console.log("Server is listining on port 4000");
});
