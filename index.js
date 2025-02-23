require("dotenv").config();require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const categoryRoutes = require("./routes/category.route.js");
const itemOrderedRoutes = require("./routes/itemOrdered.route.js");
const shipmentInfoRoutes = require("./routes/shipmentInfo.route.js");
const errorHandler = require("./middlewares/errorHandler.js");
const app = express();

const URLDB =
  `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.CLUSTER_NAEM}:27017,${process.env.CLUSTER_NAME}:27017,${process.env.CLUSTER_NAME}:27017/${process.env.DB_NAME}?ssl=true&replicaSet=atlas-7o5bfh-shard-0&authSource=admin&retryWrites=true&w=majority&appName=${process.env.APP_NAME}`;

// Connect to MongoDB
mongoose
  
  .connect(MONGODB_URI)
  
  .then(() => {
      console.log("Connected to MongoDB Atlas successfully");
  })
  .catch((err) => {
    console.log(err);
    })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const userRouter = require("./routes/user.route");
const authRouter = require("./routes/authentication/user.route");
const profileRouter = require("./routes/profile.route");

app.use("/api/categories", categoryRoutes);
app.use("/api/itemOrdered", itemOrderedRoutes);
app.use("/api/shipmentInfo", shipmentInfoRoutes);
app.use(errorHandler);

app.listen(4000, () => {
  console.log("Server is listining on port 4000");
});
