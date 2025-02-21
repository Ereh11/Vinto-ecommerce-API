// Conrollers for product
const {Product} =require("../models/product.modle.js")
const { validationResult } = require("express-validator");

const sendResponse = (res, status, code, data, message) => {
    res.status(code).json({ status, code, data, message });
  };

  
 const getallproducts =async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


 const getsingleproducts = async (req, res) => {
   try {
       let product = await Product.findById(req.params.productid);
       if (!product) {
           return res.status(404).json({ msg: "Product not found" });
       }
       res.json(product);
   } catch (error) {
       res.status(500).json({ error: error.message });
   }
 }


 const postproducts =  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const newProduct = new Product(req.body);
      await newProduct.save();
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
const patchproducts = async (req,res)=>{
  try{
  let product =  await Product.findById(req.params.productid);
  if (!product) {
    return res.status(404).json({ msg: "Product not found" });
}
Object.assign(product, req.body);
await product.save();
res.status(201).json(product);
  }catch(error){
    res.status(500).json({ error: error.message });

  }
}
 const putproducts = async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try{
    let updtedproduct =  await Product.findByIdAndUpdate(req.params.productid , req.body ,  { new: true, overwrite: true, runValidators: true });
    if (!updtedproduct) {
      return res.status(404).json({ msg: "Product not found" });
  }
   
  res.status(201).json(updtedproduct);
    }catch(error){
      res.status(500).json({ error: error.message });
  
    }
  }
  const deleteproductsbyid =async(req ,res)=>{
    try{
    let deletedProduct =  await Product.findByIdAndDelete(req.params.productid);
    if (!deletedProduct) {
      return res.status(404).json({ msg: "Product not found" });
    }
    res.status(200).json({ msg: "Product deleted successfully", deletedProduct });
    }catch(error){
      res.status(500).json({ error: error.message });
  
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