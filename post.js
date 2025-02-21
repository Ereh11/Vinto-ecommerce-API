const mongoose = require("mongoose");
const generatePublicUrl = require("./utils/drive/pix_drive.js");
const { Category } = require("./models/category.modle.js"); // Import using destructuring

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

const seedDatabase = async () => {
  try {
    // Generate the public URL for the image
    const imageUrl = await generatePublicUrl("test.jpeg");

    // Create a sample category object
    const sampleCategory = {
      title: "Electronics",
      img: imageUrl,
    };

    // Insert the sample category into the database
    const createdCategory = await Category.create(sampleCategory);
    console.log(`Successfully seeded category: ${createdCategory.title}`);
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
