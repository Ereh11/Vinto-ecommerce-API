// Conrollers for product
const {Product} =require("../models/product.modle.js")
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const sendResponse = (res, status, code, data, message) => {
    res.status(code).json({ status, code, data, message });
  };

  //getall
 const getallproducts =async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({
            status: "SUCCESS",
            code: 200,
            data: products,
          });    } 
          catch (error) {
            res.status(500).json({
                status: "ERROR",
                code: 500,
                data: null,
                message: error.message,
              });    }
}

//get by id
 const getsingleproducts = async (req, res) => {
    const { productid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productid)) {
        return res.status(400).json({
            status: "FAIL",
            code: 400,
            data: { product: null },
            message: "Invalid product ID format",
          });    }
   try {
       let product = await Product.findById(req.params.productid);
       if (!product) {
        return res.status(404).json({
            status: "FAIL",
            code: 404,
            data: { product: null },
            message: "Product not found",
          });       }
          res.status(200).json({
            status: "SUCCESS",
            code: 200,
            data: {
              id: product._id,
              title: product.title,
              describe: product.describe,
              discount: product.discount,
              price: product.price,
              rate: product.rate,
              img: product.img || "",
              quantity: product.quantity,
            },
          });   } catch (error) {
            res.status(500).json({
                status: "ERROR",
                code: 500,
                data: null,
                message: error.message,
              });   }
 }


//post
 const postproducts = async (req, res) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
        return res.status(400).json({
            status: "FAIL",
            code: 400,
            data: { product: null },
          });     }
 
     try {
 
         const newProduct = new Product(req.body);
         await newProduct.save();
         res.status(200).json({
            status: "SUCCESS",
            code: 200,
            data: {
              id: newProduct._id,
              title: newProduct.title,
              describe: newProduct.describe,
              discount: newProduct.discount,
              price: newProduct.price,
              rate: newProduct.rate,
              img: newProduct.img || "",
              quantity: newProduct.quantity,
            },
          });
             } catch (error) {
                res.status(500).json({
                    status: "ERROR",
                    code: 500,
                    data: null,
                    message: error.message,
                  });
                     }
 };
 
 ///patchh
const patchproducts = async (req,res)=>{
    if (!mongoose.Types.ObjectId.isValid(req.params.productid)) {
        return res.status(400).json({
          status: "FAIL",
          code: 400,
          data: { product: null },
          message: "Invalid product ID format",
        });
      } 

  try{
  let product =  await Product.findById(req.params.productid);
  if (!product) {
    return res.status(404).json({
        status: "FAIL",
        code: 404,
        data: { product: null },
        message: "Product not found",
      });}
Object.assign(product, req.body);
await product.save();
res.status(200).json({
    status: "SUCCESS",
    code: 200,
    data: {
      id: product._id,
      title: product.title,
      describe: product.describe,
      discount: product.discount,
      price: product.price,
      rate: product.rate,
      img: product.img || "",
      quantity: product.quantity,
    },
  });  }catch(error){
    res.status(500).json({
        status: "ERROR",
        code: 500,
        data: null,
        message: error.message,
      });
  }
}
///put
 const putproducts = async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: "FAIL",
            code: 400,
            data: { product: null },
            message: errors.array().map(err => err.msg).join(", "),
          });    }
          if (!mongoose.Types.ObjectId.isValid(req.params.productid)) {
            return res.status(400).json({
              status: "FAIL",
              code: 400,
              data: { product: null },
              message: "Invalid product ID format",
            });
          }
    try{
    let updtedproduct =  await Product.findByIdAndUpdate(req.params.productid , req.body ,  { new: true, overwrite: true, runValidators: true });
    if (!updtedproduct) {
        return res.status(404).json({
            status: "FAIL",
            code: 404,
            data: { product: null },
            message: "Product not found",
          });  }
   
          res.status(200).json({
            status: "SUCCESS",
            code: 200,
            data: {
              id: updatedProduct._id,
              title: updatedProduct.title,
              describe: updatedProduct.describe,
              discount: updatedProduct.discount,
              price: updatedProduct.price,
              rate: updatedProduct.rate,
              img: updatedProduct.img || "",
              quantity: updatedProduct.quantity,
            },
          });  
    }catch(error){
        res.status(500).json({
            status: "ERROR",
            code: 500,
            data: null,
            message: error.message,
          });
    }
  }
  ///delete
  const deleteproductsbyid =async(req ,res)=>{
    if (!mongoose.Types.ObjectId.isValid(req.params.productid)) {
        return res.status(400).json({
          status: "FAIL",
          code: 400,
          data: { product: null },
          message: "Invalid product ID format",
        });
      } 
    try{
    let deletedProduct =  await Product.findByIdAndDelete(req.params.productid);
    if (!deletedProduct) {
        if (!deletedProduct) {
            return res.status(404).json({
              status: "FAIL",
              code: 404,
              data: { product: null },
              message: "Product not found",
            });
          }    }
          res.status(200).json({
            status: "SUCCESS",
            code: 200,
            data: {
              id: deletedProduct._id,
              title: deletedProduct.title,
              describe: deletedProduct.describe,
              discount: deletedProduct.discount,
              price: deletedProduct.price,
              rate: deletedProduct.rate,
              img: deletedProduct.img || "",
              quantity: deletedProduct.quantity,
            },
            message: "Product deleted successfully",
          });
            }catch (error) {
                res.status(500).json({
                  status: "ERROR",
                  code: 500,
                  data: null,
                  message: error.message,
                });
              }
  }

  module.exports={
    getallproducts,
    getsingleproducts,
    postproducts,
    patchproducts,
    putproducts,
    deleteproductsbyid
  }