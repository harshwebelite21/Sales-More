const express = require("express");
const route = express.Router();
const { isAuthenticated } = require("../middlewares/authenticationMiddleware");
const userRouter = require("./userRouter");
const productRouter = require("./productRouter");
const cartRouter = require("./cartRouter");
const orderRouter = require("./orderRouter");

//  Home Page
route.get("/", (req, res) => {
  res.status(200).send("hello");
});

route.use("/users", userRouter);
route.use("/products", isAuthenticated, productRouter);
route.use("/cart", cartRouter);
route.use("/orders", isAuthenticated, orderRouter);

module.exports = route;
