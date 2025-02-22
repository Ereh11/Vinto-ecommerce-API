// Main file to start our API

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const categoryRoutes = require("./routes/category.route.js");
const productRoutes = require("./routes/product.route.js")
const { Product } = require("./models/product.modle.js")
const errorHandler = require("./middlewares/errorHandler.js")
const URLDB =
"mongodb+srv://Vintodevs:amj76CzcY4Ymqeqc@vintocluster.frlbn.mongodb.net/?retryWrites=true&w=majority&appName=VintoCluster";

const app = express();
const { check, validationResult } = require("express-validator");
mongoose
  .connect(URLDB)
  .then(() => {
    console.log("Mongoose Connect Successfully");
  })
  .catch((err) => {
    console.log("ERORRRRRRRRR");
  });

app.use(cors());
app.use(express.json());


app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);

app.use(errorHandler);

app.listen(4000, () => {
  console.log("Server is listining on port 4000");
});

/////////////////////////banseh/////////////////

