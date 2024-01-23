const productModel = require("../models/product");

// To Show the all Products
exports.getAllProducts = async (req, res) => {
  try {
    const productData = await productModel.find().lean();
    res.status(200).send(productData);
  } catch (err) {
    res.status(400).send(" Error in Products fetching :" + err.message);
  }
};

// Add Product Data
exports.addProducts = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    await productModel.create({ name, description, price });
    res.status(201).send("Data Added successfully");
  } catch (err) {
    res.status(400).send(" Error in data Creation :" + err.message);
  }
};

// To Update Product Data
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;

    await productModel
      .findOneAndUpdate(
        { _id: req.params.productId },
        { name, description, price }
      )
      res.status(201).send("Data Updated successful In Product");
  } catch (err) {
    res.status(400).send(err.message + "Error in data Updating In Product");
  }
};

// To delete Product
exports.deleteProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.productId);
    res.status(200).send("data deleted successfully");
  } catch (err) {
    res.status(400).send(err.message + "Data Deletion Unsuccessful");
  }
};
