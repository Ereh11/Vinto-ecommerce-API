require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const stripeRoutes = require("./routes/stripe.route.js");
const productRoutes = require("./routes/product.route.js");
const categoryRoutes = require("./routes/category.route.js");
const likeRoutes = require("./routes/itemLiked.route.js");
const wishlistRoutes = require("./routes/wishedList.route.js");
const itemOrderedRoutes = require("./routes/itemOrdered.route.js");
const cartRoutes = require("./routes/cart.route.js");
const shipmentInfoRoutes = require("./routes/shipmentInfo.route.js");
const userRouter = require("./routes/user.route");
const authRouter = require("./routes/authentication/user.route");
//const productRoutes = require("./routes/product.route.js")
const profileRouter = require("./routes/profile.route");
const errorHandler = require("./middlewares/errorHandler.js");
const app = express();

const MONGODB_URI = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.CLUSTER_NAEM}:27017,${process.env.CLUSTER_NAME}:27017,${process.env.CLUSTER_NAME}:27017/${process.env.DB_NAME}?ssl=true&replicaSet=atlas-7o5bfh-shard-0&authSource=admin&retryWrites=true&w=majority&appName=${process.env.APP_NAME}`;

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB Atlas successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Middleware
app.use(
  cors({
    origin: "http://localhost:4200", // Angular frontend URL
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/categories", categoryRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/itemOrdered", itemOrderedRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/shipmentInfo", shipmentInfoRoutes);
app.use("/api/products", productRoutes);
app.use("/api/stripe", stripeRoutes);

app.use(errorHandler);

app.all("*", (req, res) => {
  sendResponse(
    res,
    status.fail,
    404,
    null,
    `Route '${req.originalUrl}' not found`
  );
});

app.listen(4000, () => {
  console.log("Server is listening on port 4000");
});

//For unKnown Error
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection! Shutting down...", err);
  server.close(() => process.exit(1));
});

//
