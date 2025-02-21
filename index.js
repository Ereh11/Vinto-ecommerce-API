// Main file to start our API

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const categoryRoutes = require("./routes/category.route.js");
const  productRoutes= require("./routes/product.route.js")
const {Product} =require("./models/product.modle.js")
const URLDB =
  "mongodb://Vintodevs:amj76CzcY4Ymqeqc@vintocluster-shard-00-00.frlbn.mongodb.net:27017,vintocluster-shard-00-01.frlbn.mongodb.net:27017,vintocluster-shard-00-02.frlbn.mongodb.net:27017/Vinto?ssl=true&replicaSet=atlas-7o5bfh-shard-0&authSource=admin&retryWrites=true&w=majority&appName=VintoCluster";
  const productcontroller= require('./controllers/product.controllers.js')

// const mongoURI =
//   "mongodb+srv://kholoudellkasaby:FRNtzLLFoVmDYCLW@cluster0.t6fvn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const app = express();
const { check, validationResult } = require("express-validator");

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

app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({
    status: "ERROR",
    code: 500,
    data: null,
    message: "Internal Server Error",
  });
});

 
  //  const products = [
  //     { id: 1, name: "Laptop", price: 1000 },
  //     { id: 2, name: "Phone", price: 500 },
  //   ];

app.use("/api/products" ,productRoutes)

app.listen(4000, () => {
  console.log("Server is listining on port 4000");
});

/////////////////////////banseh/////////////////

