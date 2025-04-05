require("dotenv").config();
const mongoose = require("mongoose");
const generatePublicUrl = require("./utils/drive/pix_drive.js");
const { Category } = require("./models/category.modle.js"); // Your category model
const { Product } = require("./models/product.modle.js");   // Your product model

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.CLUSTER_NAME}:27017,${process.env.CLUSTER_NAME}:27017,${process.env.CLUSTER_NAME}:27017/${process.env.DB_NAME}?ssl=true&replicaSet=atlas-7o5bfh-shard-0&authSource=admin&retryWrites=true&w=majority&appName=${process.env.APP_NAME};`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Connection error:", err.message);
    process.exit(1);
  }
};

// Seed the database with a sample product that references an existing category
const seedDatabase = async () => {
  try {
    // Generate the public URL for the product image
    const productImageUrl01 = await generatePublicUrl("./image.png");
    const productImageUrl02 = await generatePublicUrl("./image copy.png");
    const productImageUrl03 = await generatePublicUrl("./image copy 2.png");
    //const productImageUrl04 = await generatePublicUrl("./image copy 3.png");
    const sampleProduct = {
      title: "Amouage Silver Gilt Malachite Bottle Islamic Arabic",
      price: 10500.75,
      describe: "Islamic Amouage vintage perfume bottle of 24-karat yellow gold on silver and malachite, on malachite stand. Complete with fitted leather, velvet and silk-lined box. Appears to be full.",
      rate: 5,
      discount: 0,
      quantity: 1,
      characteristics: [
        "Era: 20th Century",
        "Material: Malachite, Silver",
        "Condition: Excellent",
        "Dimensions: Height: 4 in (10.16 cm)Width: 2 in (5.08 cm)Depth: 2 in (5.08 cm)",
        "Place of Origin: France",
      ],
      addedAt: "2025-03-14T00:00:02.012+00:00",
      img: [productImageUrl01, productImageUrl02, productImageUrl03],// productImageUrl04],
      category: "67ba3e261c5c6144284d9aaa", 
    };

    // Insert the sample product into the database
    const createdProduct = await Product.create(sampleProduct);
    console.log(`Successfully seeded product: ${createdProduct.title}`);
  } catch (error) {
    console.error("Seeding error:", error.message);
    process.exit(1);
  } finally {
    mongoose.connection.close();
  }
};

(async () => {
  await connectDB();
  await seedDatabase();
  console.log("Database seeding completed!");
  process.exit(0);
})();
