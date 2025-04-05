// Conrollers for product
const mongoose = require("mongoose");
const fuse = require("fuse.js");
const { Product } = require("../models/product.modle.js");
const { Category } = require("../models/category.modle.js");
const { validationResult } = require("express-validator");
const asyncHandler = require("../middlewares/asyncHandler.js");
const appError = require("../utils/appError.js");
const sendResponse = require("../utils/sendResponse.js");
const status = require("../utils/status.js");
const { pagespeedonline_v5 } = require("googleapis");

// ----------------- Get all products -----------------
const getAllProducts = asyncHandler(async (req, res, next) => {
  const { limit = 8, page = 1 } = req.query;

  const parsedLimit = parseInt(limit);
  const parsedPage = parseInt(page);

  if (parsedLimit <= 0 || parsedPage <= 0) {
    throw new appError("Page and limit must be positive numbers", 400);
  }

  const startIndex = (parsedPage - 1) * parsedLimit;
  const products = await Product.find().limit(parsedLimit).skip(startIndex);

  if (products.length === 0) {
    throw new appError("No products found", 404);
  }

  const totalProducts = await Product.countDocuments();
  const totalPages = Math.ceil(totalProducts / parsedLimit);
  return sendResponse(
    res,
    status.Success,
    200,
    { products, totalPages },
    "Products retrieved successfully"
  );
});
// ----------------- Get by Id -----------------
const getSingleProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const product = await Product.findById(productId);

  if (!product) {
    throw new appError("Product not found", 404);
  }
  return sendResponse(
    res,
    status.Success,
    200,
    { product },
    "Product retrieved successfully"
  );
});
// ----------------- Post -----------------
const postProduct = asyncHandler(async (req, res, next) => {
  const { title, describe, discount, price, rate, img, quantity, category } =
    req.body;
  const existingCategory = await Category.findById(category);
  if (!existingCategory) {
    return next(new appError("Category not found", 404));
  }
  const newProduct = new Product({
    title,
    describe,
    discount,
    price,
    rate,
    img,
    quantity,
    category,
  });

  await newProduct.save();

  return sendResponse(
    res,
    status.Success,
    201,
    { newProduct },
    "Product created successfully"
  );
});

// ----------------- Patch -----------------
const patchProduct = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const product = await Product.findById(productId);
  if (!product) {
    throw new appError("Product not found", 404, status.Fail);
  }
  Object.assign(product, req.body);
  await product.save();
  return sendResponse(
    res,
    status.Success,
    200,
    { product },
    "Product updated successfully"
  );
});

// ----------------- Put -----------------
const putProduct = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const { category } = req.body;
  const existingProduct = await Product.findById(productId);
  const existingCategory = await Category.findById(category);
  if (!existingCategory) {
    return next(new appError("Category not found", 404));
  }
  if (!existingProduct) {
    return next(new appError("Product not found", 404));
  }
  const updatedProduct = await Product.findByIdAndUpdate(productId, req.body, {
    new: true,
    overwrite: true,
    runValidators: true,
  });
  return sendResponse(
    res,
    status.Success,
    200,
    { updatedProduct },
    "Product updated successfully"
  );
});
// ----------------- Delete by Id -----------------
const deleteProductById = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const deletedProduct = await Product.findByIdAndDelete(productId);
  if (!deletedProduct) {
    throw new appError("Product not found", 404, status.Fail);
  }
  return sendResponse(
    res,
    status.Success,
    200,
    {
      deletedProduct,
    },
    "Product deleted successfully"
  );
});
// ----------------- Delete all -----------------
const deleteproducts = asyncHandler(async (req, res, next) => {
  const deletedProductall = await Product.deleteMany({});
  return sendResponse(
    res,
    status.Success,
    200,
    { deletedCount: result.deletedCount },
    "All products deleted successfully"
  );
});
// ----------------- Get offers -----------------
const getOffers = asyncHandler(async (req, res, next) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 8;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const startIndex = (page - 1) * limit;
    if (limit <= 0 || page <= 0) {
      throw new appError("Page and limit must be positive numbers", 400, status.Fail);
    }
    const products = await Product.find({ discount: { $gt: 0 } })
      .limit(limit)
      .skip(startIndex);
    if (products.length === 0) {
      throw new appError("No products found", 404, status.Fail);
    }
    return sendResponse(
      res,
      status.Success,
      200,
      { products },
      "Products retrieved successfully"
    );
});
// ----------------- Get top rated -----------------
const getTopRated = asyncHandler(async (req, res, next) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 8;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const startIndex = (page - 1) * limit;
    if (limit <= 0 || page <= 0) {
      throw new appError("Page and limit must be positive numbers", 400, status.Fail);
    }
    const products = await Product.find({ rate: { $gte: 4 } })
      .sort({ rate: -1 })
      .limit(limit)
      .skip(startIndex);
    if (products.length === 0) {
      throw new appError("No products found", 404, status.Fail);
    }
    return sendResponse(
      res,
      status.Success,
      200,
      { products },
      "Products retrieved successfully"
    );
});
// ----------------- Get new arrivals -----------------
const getNewArrivals = asyncHandler(async (req, res, next) => {

    const limit = req.query.limit ? parseInt(req.query.limit) : 8;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const startIndex = (page - 1) * limit;
    if (limit <= 0 || page <= 0) {
      throw new appError("Page and limit must be positive numbers", 400, status.Fail);
    }
    const products = await Product.find()
      .sort({ addedAt: -1 })
      .limit(limit)
      .skip(startIndex);
    if (products.length === 0) {
      throw new appError("No products found", 404, status.Fail);
    }
    return sendResponse(
      res,
      status.Success,
      200,
      { products },
      "Products retrieved successfully"
    );
});
// ----------------- Search products -----------------
const searchProducts = asyncHandler(async (req, res, next) => {
    const searched = req.query.searched;
    if (!searched) {
      throw new appError("Search term is required", 400, status.Fail);
    }

    const products = await Product.find();

    const options = {
      keys: ["title"],
      threshold: 0.3,
      minMatchCharLength: Math.max(3, Math.floor(searched.length / 2)),
    };

    const fuseInstance = new fuse(products, options);

    const result = fuseInstance.search(searched).map((r) => r.item);

    if (result.length === 0) {
      throw new appError("No products found", 404, status.Fail);
    }

    return sendResponse(
      res,
      status.Success,
      200,
      { products: result },
      "Products retrieved successfully"
    );
});
// ----------------- Filter products -----------------
const getFilteredProducts = asyncHandler(async (req, res, next) => {
  const { minPrice, maxPrice, sort, category, page = 1, limit = 8 } = req.query;

  if (isNaN(page) || page <= 0) {
    throw new appError("Invalid page number", 400, status.Fail);
  }
  if (isNaN(limit) || limit <= 0) {
    throw new appError("Invalid limit number", 400, status.Fail);
  }

  let query = {};
  if (minPrice || maxPrice) {
    query.price = {};
    if (!isNaN(minPrice)) query.price.$gte = minPrice;
    if (!isNaN(maxPrice)) query.price.$lte = maxPrice;
  }
  if (category) {
    const categoryArray = category.split(",");
    const isValidAll = categoryArray.every((id) =>
      mongoose.Types.ObjectId.isValid(id)
    );
    if (!isValidAll) {
      return next(
        new appError("One or more category IDs are invalid", 400, status.Fail)
      );
    }
    query.category = { $in: categoryArray };
  }
  const sortOption = {};
  if (sort === "newest") {
    sortOption.addedAt = -1;
  } else if (sort === "oldest") {
    sortOption.addedAt = 1;
  }

  const skip = (page - 1) * limit;
  const products = await Product.find(query)
    .sort(sortOption)
    .skip(skip)
    .limit(limit)
    .lean();

  const totalProducts = await Product.countDocuments(query);
  const totalPages = Math.ceil(totalProducts / limit);
  console.log(totalPages, totalProducts, limit, page);
  if (products.length === 0) {
    throw new appError("No products found", 404, status.Fail);
  }
  return sendResponse(
    res,
    status.Success,
    200,
    { products, totalPages },
    "Products retrieved successfully"
  );
});

module.exports = {
  getAllProducts,
  getSingleProduct,
  postProduct,
  patchProduct,
  putProduct,
  deleteProductById,
  deleteproducts,
  getOffers,
  getTopRated,
  getNewArrivals,
  searchProducts,
  getFilteredProducts,
};
