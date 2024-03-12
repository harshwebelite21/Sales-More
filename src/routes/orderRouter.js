const express = require("express");

const orderController = require("../controller/orderController");
const route = express.Router();

// Checkout
route.post("/", orderController.checkOut);
// View Order History using user Specific userId
route.get("/", orderController.getOrderHistory);

module.exports = route;
