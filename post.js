const mongoose = require("mongoose");
const generatePublicUrl = require("./utils/drive/pix_drive.js");
const { Category } = require("./models/category.modle.js"); // Your category model
const { Product } = require("./models/product.modle.js");   // Your product model

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://Vintodevs:amj76CzcY4Ymqeqc@vintocluster.frlbn.mongodb.net/?retryWrites=true&w=majority",
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
    const existingCategory = await Category.findOne({ title: "Electronics" });
    if (!existingCategory) {
      console.error("Category 'Electronics' not found. Please seed the category first.");
      process.exit(1);
    }

    // Generate the public URL for the product image
    const productImageUrl = await generatePublicUrl("brownclock.jpg");

    // Create a sample product object
    const sampleProduct = {
      title: "brown clock",
      price:3800,
      describe: "A classic and stylish brown wall clock that blends functionality with elegance. Designed with a rich brown frame, it adds warmth and sophistication to any room, making it perfect for homes, offices, or cafés.",
      rate: 4.6,
      discount: 15,
      quantity: 40,
      img:productImageUrl,
      category: "67b8ff6248c555f16011ef15", // Reference to the existing category
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
