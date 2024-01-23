const express = require("express");

const productController = require("../controller/productController");
const route = express.Router();

// View Products
route.get("/", productController.getAllProducts);

// Add Product
route.post("/", productController.addProducts);

// Update Product Details
route.put("/:productId", productController.updateProduct);

// Delete Product
route.patch("/:productId", productController.deleteProduct);

module.exports = route;
