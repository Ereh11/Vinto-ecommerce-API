// Main file to start our API
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const itemOrderedRoutes = require("./routes/itemOrdered.route.js");
const cartRoutes = require("./routes/cart.route.js");
const errorHandler = require("./middlewares/errorHandler.js");
const path = require('path');
const app = express();
const dotenv = require("dotenv");

const filePath = path.join(__dirname, '.env');
const envParams = dotenv.config({ path: filePath }).parsed;

const URLDB =
  `mongodb://${envParams.DB_USERNAME}:${envParams.DB_PASSWORD}@${envParams.CLUSTER_NAEM}:27017,${envParams.CLUSTER_NAME}:27017,${envParams.CLUSTER_NAME}:27017/${envParams.DB_NAME}?ssl=true&replicaSet=atlas-7o5bfh-shard-0&authSource=admin&retryWrites=true&w=majority&appName=${envParams.APP_NAME}`;


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

app.use("/api/itemOrdered", itemOrderedRoutes);
app.use("/api/cart", cartRoutes);
app.use(errorHandler);

app.listen(4000, () => {
  console.log("Server is listining on port 4000");
});
