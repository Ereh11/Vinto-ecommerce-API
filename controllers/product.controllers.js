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
//Get by id
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
const patchproducts = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.productid)) {
        return sendResponse(
            res,
            status.Fail,
            400,
            { product: null },
            "Sorry, product update failed due to invalid ID format."
        );
    }


    let product = await Product.findById(req.params.productid);
    if (!product) {
        return sendResponse(
            res,
            status.Fail,
            404,
            { product: null },
            "Product not found"
        )
    };
    Object.assign(product, req.body);
    await product.save();
    return sendResponse(
        res,
        status.Success,
        200,
        {
            id: product._id,
            title: product.title,
            describe: product.describe,
            discount: product.discount,
            price: product.price,
            rate: product.rate,
            img: product.img || "",
            quantity: product.quantity,
        },
        "Product updated successfully"
    );
})
/////////////////////////////////////////
///put
const putproducts = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return sendResponse(
            res,
            status.Fail,
            400,
            { product: null },
            errors.array().map((err) => err.msg).join(", ")
        );
    }
    if (!mongoose.Types.ObjectId.isValid(req.params.productid)) {
        return sendResponse(
            res,
            status.Fail,
            400,
            { product: null },
            "Invalid product ID format"
        );
    }

    let updtedproduct = await Product.findByIdAndUpdate(req.params.productid, req.body, { new: true, overwrite: true, runValidators: true });
    if (!updtedproduct) {
        return sendResponse(
            res,
            status.Fail,
            404,
            { product: null },
            "Product not found"
        );
    }

    return sendResponse(
        res,
        status.Success,
        200,
        {
            id: updtedproduct._id,
            title: updtedproduct.title,
            describe: updtedproduct.describe,
            discount: updtedproduct.discount,
            price: updtedproduct.price,
            rate: updtedproduct.rate,
            img: updtedproduct.img || "",
            quantity: updtedproduct.quantity,
        },
        "Product updated successfully"
    );
})
//////////////////////////////////////////
///delete by id
const deleteproductsbyid = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.productid)) {
        return sendResponse(res, status.Fail, 400, { product: null }, "Invalid product ID format");

    }

    let deletedProduct = await Product.findByIdAndDelete(req.params.productid);
    if (!deletedProduct) {
        return sendResponse(res, status.Fail, 404, { product: null }, "Product not found");

    }
    return sendResponse(
        res,
        status.Success,
        200,
        {
            id: deletedProduct._id,
            title: deletedProduct.title,
            describe: deletedProduct.describe,
            discount: deletedProduct.discount,
            price: deletedProduct.price,
            rate: deletedProduct.rate,
            img: deletedProduct.img || "",
            quantity: deletedProduct.quantity,
        },
        "Product deleted successfully"
    );

})
/////delete all
const deleteproducts = asyncHandler(async (req, res) => {

    const deletedProductall = await Product.deleteMany({});
    if (deletedProductall.deletedCount === 0) {
        return sendResponse(res, status.Fail, 404, { products: null }, "No products found to delete");

    }
    return sendResponse(res, status.Success, 200, { deletedCount: result.deletedCount }, "All products deleted successfully");


}
);

module.exports = {
    getallproducts,
    getsingleproducts,
    postproducts,
    patchproducts,
    putproducts,
    deleteproductsbyid,
    deleteproducts
}