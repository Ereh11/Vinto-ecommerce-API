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
  `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.CLUSTER_NAEM}:27017,${process.env.CLUSTER_NAME}:27017,${process.env.CLUSTER_NAME}:27017/${process.env.DB_NAME}?ssl=true&replicaSet=atlas-7o5bfh-shard-0&authSource=admin&retryWrites=true&w=majority&appName=${process.env.APP_NAME}`;

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
