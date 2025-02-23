require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Construct MongoDB URI with the correct format
const MONGODB_URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@vintocluster.frlbn.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();

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
app.use(cors());
app.use(express.json());

// Routes
const userRouter = require("./routes/user.route");
const authRouter = require("./routes/authentication/user.route");
const profileRouter = require("./routes/profile.route");

// Here put your routes
// app.use("", );
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
