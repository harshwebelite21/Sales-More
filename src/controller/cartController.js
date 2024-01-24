const mongoose = require("mongoose");
const cartModel = require("../models/cart");

// Create a cart
exports.addToCart = async (req, res) => {
  try {
    const { userId, products } = req.body;

    // Check users cart available or not
    const availableUser = await cartModel.findOne({ userId });
    // const availableUser = await cartModel.exists({ userId });   returns only id;

    // If User is available then Added Products to same cart other wise create new cart
    if (availableUser) {
      // To save the all userId which is saved in user's specific cart
      const allProductIdAvilableInCart = availableUser.products.map(
        ({ productId }) => productId.toString(),
      );

      // Create promises for all changes and last they all are resolved
      const promises = products.map(async (element) => {
        if (allProductIdAvilableInCart.includes(element.productId)) {
          await cartModel.findOneAndUpdate(
            { userId, "products.productId": element.productId },
            { $inc: { "products.$.quantity": element.quantity } },
          );
        } else {
          await cartModel.updateOne({ userId }, { $push: { products } });
        }
      });

      // Resolve all promises at one time
      await Promise.all(promises);
    } else {
      await cartModel.create({ userId, products });
    }

    res.status(201).send("Data Added successfully In the cart");
  } catch (err) {
    res.status(400).send(" Error in cart Creation :" + err.message);
  }
};

//  Delete data from cart
exports.removeFromCart = async (req, res) => {
  try {
    // Delete data from cart using cart id
    await cartModel.findOneAndDelete({ userId: req.params.userId });
    res.status(200).send("data deleted successfully from cart");
  } catch (err) {
    res.status(400).send(err.message + "Data Deletion Unsuccessful from cart");
  }
};

// View the user data from cart
exports.findCart = async (req, res) => {
  try {
    const cartData = await cartModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.params.userId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "products.productId",
          foreignField: "_id",
          as: "product",
        },
      },
    ]);
    res.status(200).send(cartData);
  } catch (err) {
    res.send(err.message + "Fetching data ").status(400);
  }
};

// To remove the specific item from cart

exports.removeSpecificItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { userId } = req.body;
    const updatedCart = await cartModel
      .updateOne(
        {
          userId,
          "products.productId": productId,
        },
        { $pull: { products: { productId } } },
        { new: true },
      )
      .populate("userId");
    if (!updatedCart || updatedCart.modifiedCount < 1) {
      return res.status(404).json({ error: "Cart or item not found." });
    }

    res.send("Item Removed from your Cart");
  } catch (err) {
    console.error("Error removing item from cart:", err);
    res.status(500).json({ err: "Internal Server Error" });
  }
};

exports.reduceQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { userId } = req.body;
    const decrementedData = await cartModel
      .updateOne(
        {
          userId,
          "products.productId": productId,
        },
        {
          $inc: { "products.$.quantity": -1 },
        },
        { new: true },
      )
      .populate("userId");
    if (!decrementedData || decrementedData.modifiedCount < 1) {
      return res.status(404).json({ error: "Cart or item not found." });
    }
    res.json("Item Decremented from your Cart");
  } catch (err) {
    console.error("Error in Decrement the count of item from cart:", err);
    res.status(500).json({ err: "Internal Server Error" });
  }
};

// Automatically Delete cart if it is an empty cart
exports.checkAndDeleteEmptyCart = async () => {
  try {
    // Find carts with no products
    const emptyCarts = await cartModel.aggregate([
      {
        $match: {
          products: { $exists: true, $size: 0 }, // Match carts with no products
        },
      },
      {
        $project: {
          _id: 1, // Project only the _id field for optimization
        },
      },
    ]);

    // Extract cart IDs to be deleted
    const cartIdsToDelete = emptyCarts.map(({ _id }) => _id.toString());

    // Delete carts with no products
    if (cartIdsToDelete.length > 0) {
      const deleteResult = await cartModel.deleteMany({
        _id: { $in: cartIdsToDelete },
      });
      console.log(`${deleteResult.deletedCount} cart(s) deleted`);
    } else {
      console.log("No empty carts found");
    }
  } catch (error) {
    console.error("Error deleting empty carts:", error);
  }
};
