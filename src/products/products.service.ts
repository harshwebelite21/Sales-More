import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {checkAndDeleteEmptyCart} from '../cart/cart.service'

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<'Product'>,
    @InjectModel('Cart') private readonly cartModel: Model<'Cart'>,
  ) {}

  

// To Show the all Products
async  getAllProducts () {
  try {
    const productData = await this.productModel.find().lean();
    return `JSON.stringify${productData}`
  } catch (err) {

    return `" Error in Products fetching :" + ${err.message}`
  }
};

// Add Product Data
async addProducts(name, description, price) {
  try {
    await this.productModel.create({ name, description, price });
    return "Data Added successfully"
  } catch (err) {
    return `" Error in data Creation :" + ${err.message}`
  }
};

// To Update Product Data
async updateProduct (name, description, price,productId) {
  try {
    await this.productModel.findOneAndUpdate(
      { _id: productId },
      { name, description, price },
    );
    return "Data Updated successful In Product";
    res.status(201).send();
  } catch (err) {
    res.status(400).send(err.message + "Error in data Updating In Product");
  }
};

// To delete Product
exports.deleteProduct = async (req, res) => {
  try {
    // Delete the product from the products collection
    await productModel.findByIdAndDelete(req.params.productId);

    // Update all carts that contain the deleted product
    await cartModel.updateMany(
      {
        "products.productId": new mongoose.Types.ObjectId(req.params.productId),
      },
      {
        $pull: {
          products: {
            productId: new mongoose.Types.ObjectId(req.params.productId),
          },
        },
      },
    );

    // check for if cart is empty then automatically delete the cart
    checkAndDeleteEmptyCart();

    res.status(200).send("data deleted successfully");
  } catch (err) {
    res.status(400).send(err.message + "Data Deletion Unsuccessful");
  }
};

}
