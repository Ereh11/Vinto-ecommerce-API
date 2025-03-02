require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const categoryRoutes = require("./routes/category.route.js");
const likeRoutes = require("./routes/itemLiked.route.js");
const wishlistRoutes = require("./routes/wishedList.route.js");
const itemOrderedRoutes = require("./routes/itemOrdered.route.js");
const shipmentInfoRoutes = require("./routes/shipmentInfo.route.js");
const errorHandler = require("./middlewares/errorHandler.js");
const app = express();

const URLDB = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.CLUSTER_NAME}:27017,${process.env.CLUSTER_NAME}:27017,${process.env.CLUSTER_NAME}:27017/${process.env.DB_NAME}?ssl=true&replicaSet=atlas-7o5bfh-shard-0&authSource=admin&retryWrites=true&w=majority&appName=${process.env.APP_NAME}`;
console.log(URLDB);

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
app.use("/api/liked", likeRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/itemOrdered", itemOrderedRoutes);
app.use("/api/shipmentInfo", shipmentInfoRoutes);
app.use(errorHandler);

app.listen(4000, () => {
  console.log("Server is listening on port 4000");
});

//For unKnown Error
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception! Shutting down...", err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection! Shutting down...", err);
  server.close(() => process.exit(1));
});
