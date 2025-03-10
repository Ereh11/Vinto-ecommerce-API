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
    // Find the existing category by title (change "Electronics" as needed)
    const existingCategory = await Category.findOne({ title: "Furniture" });
    if (!existingCategory) {
      console.error("Category not found. Please seed the category first.");
      process.exit(1);
    }

    // Generate the public URL for the product image
    const productImageUrl01 = await generatePublicUrl("./image.png");
    const productImageUrl02 = await generatePublicUrl("./image copy.png");
    const productImageUrl03 = await generatePublicUrl("./image copy 2.png");
    //const productImageUrl04 = await generatePublicUrl("./image copy 3.png");
    const sampleProduct = {
      title: "Mainsail Striped Sweater",
      price: 3199.99,
      describe: "Classic and timeless vintage inspired cream colored knit sweater with dark navy blue horizontal stripes. Features long puffed sleeves, drop shoulders, and cozy slightly oversize fit.",
      rate: 4.9,
      discount: 0,
      quantity: 60,
      characteristics: [
        "Fabric: 100% Cotton",
        "Measurements: 30 length / 20 across chest (relaxed) / 27 raglan sleeve",
        "Puffed sleeves",
        "Dropped shoulders",
        "Imported"
      ],
      addedAt: "2025-03-08T00:00:02.012+00:00",
      img: [productImageUrl01, productImageUrl02, productImageUrl03],// productImageUrl04],
      category: "67ba3e8716548f20d6370e86", 
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
