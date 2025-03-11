// Main file to start our API

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const sendResponse = require("./utils/sendResponse.js");
const { status } = require("./utils/status.js");

const categoryRoutes = require("./routes/category.route.js");
const productRoutes = require("./routes/product.route.js")
const { Product } = require("./models/product.modle.js")
const errorHandler = require("./middlewares/errorHandler.js")

const URLDB = `mongodb+srv://Vintodevs:ngTl9Pm4iLopenTcEm7@vintocluster.frlbn.mongodb.net/Vinto?retryWrites=true&w=majority&appName=VintoCluster;`;
console.log(URLDB);

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


app.all('*', (req, res) => {
  sendResponse(res, status.fail, 404, null, `Route '${req.originalUrl}' not found`);
});

app.listen(4000, () => {
  console.log("Server is listining on port 4000");
});

/////////////////////////banseh/////////////////

