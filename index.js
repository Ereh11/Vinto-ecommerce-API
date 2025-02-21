// Main file to start our API

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const categoryRoutes = require("./routes/category.route.js");
const errorHandler = require("./middlewares/errorHandler.js");

const URLDB =
  "mongodb://Vintodevs:amj76CzcY4Ymqeqc@vintocluster-shard-00-00.frlbn.mongodb.net:27017,vintocluster-shard-00-01.frlbn.mongodb.net:27017,vintocluster-shard-00-02.frlbn.mongodb.net:27017/Vinto?ssl=true&replicaSet=atlas-7o5bfh-shard-0&authSource=admin&retryWrites=true&w=majority&appName=VintoCluster";

// const mongoURI =
//   "mongodb+srv://kholoudellkasaby:FRNtzLLFoVmDYCLW@cluster0.t6fvn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const app = express();

mongoose
  .connect(URLDB)
  .then(() => {
    console.log("Mongoose Connect Successfully");
  })
  .catch((err) => {
    console.log(err.message);
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
