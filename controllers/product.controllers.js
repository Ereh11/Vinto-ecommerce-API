// Conrollers for product
const mongoose = require("mongoose");
const fuse = require("fuse.js");
const { Product } = require("../models/product.modle.js")
const { validationResult } = require("express-validator");
const asyncHandler = require("../middlewares/asyncHandler.js");
const appError = require("../utils/appError.js");
const sendResponse = require("../utils/sendResponse.js");
const status = require("../utils/status.js");


// Get all products
const getallproducts = async (req, res, next) => {
    try {
        const query = req.query;
        const limit = query.limit ? parseInt(query.limit) : 9;
        const page = query.page ? parseInt(query.page) : 1;
        const startIndex = (page - 1) * limit;
        if (limit <= 0 || page <= 0) {
            return next(new appError("Page and limit must be positive numbers", 400));
        }

        const products = await Product.find().limit(limit).skip(startIndex);
        if (products.length === 0) {
            return sendResponse(
                res,
                status.Fail,
                404,
                { products: null },
                "No products found"
            );
        }
        return sendResponse(
            res,
            status.Success,
            200,
            { products },
            "Products retrieved successfully"
        );
    } catch (err) {
        next(err);
    }
}
//Get by Id
const getsingleproducts = async (req, res, next) => {
    try {
        const { productid } = req.params;

        if (!mongoose.Types.ObjectId.isValid(productid)) {
            return next(new appError("Invalid product ID format", 400));
        }
        let product = await Product.findById(req.params.productid);
        if (!product) {
            return next(new appError("Product not found", 404));
        }
        return sendResponse(
            res,
            status.Success,
            200,
            {
                product
            },
            "Product retrieved successfully"
        );

    } catch (err) {
        next(err);
    }
};
//post
const postproducts = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new appError(errors.array().map((err) => err.msg).join(", "), 400));
        }
        if (!mongoose.Types.ObjectId.isValid(req.params.productid)) {
            return next(new appError("Invalid product ID format", 400));
        }
        const { title, describe, discount, price, rate, img, quantity } = req.body;
        const newProduct = new Product({
            title,
            describe,
            discount,
            price,
            rate,
            img,
            quantity
        });
        await newProduct.save();
        return sendResponse(res,
            status.Success,
            200, {
            newProduct
        }, "Product created successfully"
        );
    }
    catch (err) {
        next(err);
    }
};
//patch
const patchproducts = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new appError(errors.array().map((err) => err.msg).join(", "), 400));
    }
    if (!mongoose.Types.ObjectId.isValid(req.params.productid)) {
        return next(new appError("Invalid product ID format", 400));
    }
    let product = await Product.findById(req.params.productid);
    if (!product) {
        return next(new appError("Product not found", 404));
    };
    Object.assign(product, req.body);
    await product.save();
    return sendResponse(
        res,
        status.Success,
        200,
        {
            product
        },
        "Product updated successfully"
    );
};
//Put
const putproducts = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new appError(errors.array().map((err) => err.msg).join(", "), 400));
        }
        if (!mongoose.Types.ObjectId.isValid(req.params.productid)) {
            return next(new appError("Invalid product ID format", 400));
        }

        let updatedProduct = await Product.findByIdAndUpdate(req.params.productid, req.body, { new: true, overwrite: true, runValidators: true });
        if (!updatedProduct) {
            return next(new appError("Product not found", 404));
        }

        return sendResponse(
            res,
            status.Success,
            200,
            {
                updatedProduct
            },
            "Product updated successfully"
        );
    }
    catch (err) {
        next(err);
    }
};
//Delete by id
const deleteproductsbyid = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.productid)) {
            return next(new appError("Invalid product ID format", 400));
        }

        let deletedProduct = await Product.findByIdAndDelete(req.params.productid);
        if (!deletedProduct) {
            return next(new appError("Product not found", 404));
        }
        return sendResponse(
            res,
            status.Success,
            200,
            {
                deletedProduct
            },
            "Product deleted successfully"
        );
    }
    catch (err) {
        next(err);
    }
};
//Delete all
const deleteproducts = async (req, res, next) => {
    try {
        const deletedProductall = await Product.deleteMany({});
        if (deletedProductall.deletedCount === 0) {
            return next(new appError("No products found", 404));
        }
        return sendResponse(res, status.Success, 200, { deletedCount: result.deletedCount }, "All products deleted successfully");
    }
    catch (err) {
        next(err);
    }
};
const getOffers = async (req, res, next) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : 12;
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const startIndex = (page - 1) * limit;
        if (limit <= 0 || page <= 0) {
            return next(new appError("Page and limit must be positive numbers", 400));
        }
        const products = await Product.find({ discount: { $gt: 0 } }).limit(limit).skip(startIndex);
        if (products.length === 0) {
            return sendResponse(
                res,
                status.Fail,
                404,
                { products: null },
                "No products found"
            );
        }
        return sendResponse(
            res,
            status.Success,
            200,
            { products },
            "Products retrieved successfully"
        );
    } catch (err) {
        next(err);
    }

};
const getTopRated = async (req, res, next) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : 12;
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const startIndex = (page - 1) * limit;
        if (limit <= 0 || page <= 0) {
            return next(new appError("Page and limit must be positive numbers", 400));
        }
        const products = await Product.find({ rate: { $gte: 4 } }).sort({ rate: -1 }).limit(limit).skip(startIndex);
        if (products.length === 0) {
            return sendResponse(
                res,
                status.Fail,
                404,
                { products: null },
                "No products found"
            );
        }
        return sendResponse(
            res,
            status.Success,
            200,
            { products },
            "Products retrieved successfully"
        );
    } catch (err) {
        next(err);
    }

};
const getNewArrivals = async (req, res, next) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : 12;
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const startIndex = (page - 1) * limit;
        if (limit <= 0 || page <= 0) {
            return next(new appError("Page and limit must be positive numbers", 400));
        }
        const products = await Product.find().sort({ addedAt: -1 }).limit(limit).skip(startIndex);
        if (products.length === 0) {
            return sendResponse(
                res,
                status.Fail,
                404,
                { products: null },
                "No products found"
            );
        }
        return sendResponse(
            res,
            status.Success,
            200,
            { products },
            "Products retrieved successfully"
        );
    } catch (err) {
        next(err);
    }

};

const searchProducts = async (req, res, next) => {
    try {
        const searched = req.query.searched;
        if (!searched) {
            return next(new appError("Please provide a search query", 400));
        }

        const products = await Product.find();

        const options = {
            keys: ["title", "describe"],
            threshold: 0.3,
            minMatchCharLength: Math.max(2, Math.floor(searched.length / 2)),
        };

        const fuseInstance = new fuse(products, options);

        const result = fuseInstance.search(searched).map((r) => r.item);

        if (result.length === 0) {
            return sendResponse(res, status.Fail, 404, { products: null }, "No products found");
        }

        return sendResponse(res, status.Success, 200, { products: result }, "Products retrieved successfully");
    } catch (err) {
        next(err);
    }
};
const getFilteredProducts = async (req, res, next) => {
    try {
        const { minPrice, maxPrice, sort, category, page = 1, limit = 12 } = req.query;

        let query = {};

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseFloat(minPrice);
            if (maxPrice) query.price.$lte = parseFloat(maxPrice);
        }
        if (category) {
            if (!mongoose.Types.ObjectId.isValid(category)) {
                return next(new appError("Invalid category ID format", 400));
            }
            else {
                query.category = category
            }
        }

        let sortOption = {};
        if (sort === "newest") sortOption.addedAt = -1;
        else if (sort === "oldest") sortOption.addedAt = 1;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const products = await Product.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(parseInt(limit));

        if (products.length === 0) {
            return sendResponse(res, status.Fail, 404, { products: null }, "No products found");
        }

        return sendResponse(res, status.Success, 200, { products }, "Products retrieved successfully");

    } catch (err) {
        next(err);
    }
};


module.exports = {
    getallproducts,
    getsingleproducts,
    postproducts,
    patchproducts,
    putproducts,
    deleteproductsbyid,
    deleteproducts,
    getOffers,
    getTopRated,
    getNewArrivals,
    searchProducts,
    getFilteredProducts
}