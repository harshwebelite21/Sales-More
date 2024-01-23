const express = require("express");

const cartController = require("../controller/cartController");
const route = express.Router();

// Add New Item To cart
route.post("/", cartController.addToCart);

// Remove the  user Cart
route.delete("/:userId", cartController.removeFromCart);

// Remove the Specific Item From cart
route.patch("/items/:productId", cartController.removeSpecificItem);

// Decrement the quantity from cart
route.patch("/reduce-quantity/:productId",cartController.reduceQuantity)

// View the user specific Cart
route.get("/:userId", cartController.findCart);

module.exports = route;
