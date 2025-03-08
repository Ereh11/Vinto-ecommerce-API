// Conrollers for product
const { Product } = require("../models/product.modle.js")
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
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
//////////////////////////////////////////
///delete by id
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
/////delete all
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

module.exports = {
    getallproducts,
    getsingleproducts,
    postproducts,
    patchproducts,
    putproducts,
    deleteproductsbyid,
    deleteproducts
}