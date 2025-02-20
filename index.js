// Main file to start our API

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const URLDB =
  "mongodb://Vintodevs:amj76CzcY4Ymqeqc@vintocluster-shard-00-00.frlbn.mongodb.net:27017,vintocluster-shard-00-01.frlbn.mongodb.net:27017,vintocluster-shard-00-02.frlbn.mongodb.net:27017/Vinto?ssl=true&replicaSet=atlas-7o5bfh-shard-0&authSource=admin&retryWrites=true&w=majority&appName=VintoCluster";

const app = express();

mongoose.connect(URLDB).then(() => {
  console.log("Mongoose Connect Successfully");
});
const userRouter = require("./routes/user.route");
app.use(cors());
app.use(express.json());
const authRouter = require("./routes/authentication/user.route");
const profileRouter = require("./routes/profile.route");

// Here put your routes
// app.use("", );
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);

app.listen(4000, () => {
  console.log("Server is listining on port 4000");
});
