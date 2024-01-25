import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { type Cart } from './cart.model';

@Injectable()
export class CartService {
  constructor(@InjectModel('Cart') private readonly cartModel: Model<Cart>) {}

  async addToCart(
    userId: string,
    products: Array<{ productId: string; quantity: number }>,
  ): Promise<string> {
    try {
      // Check users cart available or not
      const availableUser = await this.cartModel.findOne({ userId });

      // const availableUser = await cartModel.exists({ userId });   returns only id;

      // If User is available then Added Products to same cart other wise create new cart
      if (availableUser) {
        // To save the all userId which is saved in user's specific cart
        const allProductIdAvailableInCart = availableUser.products.map(
          ({ productId }) => JSON.stringify(productId),
        );

        // Create promises for all changes and last they all are resolved
        const promises = products.map(async (element) => {
          if (allProductIdAvailableInCart.includes(element.productId)) {
            await this.cartModel.findOneAndUpdate(
              { userId, 'products.productId': element.productId },
              { $inc: { 'products.$.quantity': element.quantity } },
            );
          } else {
            await this.cartModel.updateOne({ userId }, { $push: { products } });
          }
        });

        // Resolve all promises at one time
        await Promise.all(promises);
      } else {
        await this.cartModel.create({ userId, products });
      }

      return 'Data Added Successfully';
    } catch (err) {
      return `Error in cart creation : + ${err}`;
    }
  }

  //  Delete data from cart
  async removeFromCart(userId: string): Promise<string> {
    try {
      // Delete data from cart using cart id
      await this.cartModel.findOneAndDelete({ userId });
      return 'Data Deletion Successful from cart ';
    } catch (err) {
      return `Data Deletion Unsuccessful from cart : + ${err}`;
    }
  }

  // View the user data from cart
  async findCart(userId: string): Promise<string> {
    try {
      const cartData = await this.cartModel.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(userId),
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $lookup: {
            from: 'products',
            localField: 'products.productId',
            foreignField: '_id',
            as: 'product',
          },
        },
      ]);
      return `${JSON.stringify(cartData)}+ This is cart Data `;
    } catch (err) {
      return `${err.message} + Fetching Data`;
    }
  }

  // To remove the specific item from cart

  async removeSpecificItem(productId: string, userId: string): Promise<string> {
    try {
      const updatedCart = await this.cartModel.updateOne(
        {
          userId,
          'products.productId': productId,
        },
        { $pull: { products: { productId } } },
      );
      // .populate('userId');
      console.log(updatedCart);

      if (!updatedCart || updatedCart.matchedCount > 1) {
        return ` "Cart or item not found."`;
        // Automatically Delete cart if it is an empty cart
      }

      return `Item Removed from your Cart`;
    } catch (err) {
      console.error('Error removing item from cart:', err);

      return `${err}: "Internal Server Error"`;
    }
  }
  // To reduce Quantity from cart
  async reduceQuantity(productId: string, userId: string): Promise<string> {
    try {
      const decrementedData = await this.cartModel.updateOne(
        {
          userId,
          'products.productId': productId,
        },
        {
          $inc: { 'products.$.quantity': -1 },
        },
      );
      // .populate("userId");
      if (!decrementedData || decrementedData.modifiedCount < 1) {
        return 'Cart or item not found.';
      }
      return 'Item Decremented from your Cart';
    } catch (err) {
      console.error('Error in Decrement the count of item from cart:', err);
      return `${err}: "Internal Server Error"`;
    }
  }

  // Automatically Delete cart if it is an empty cart
  async checkAndDeleteEmptyCart() {
    try {
      // Find carts with no products
      const emptyCarts = await this.cartModel.aggregate([
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
        const deleteResult = await this.cartModel.deleteMany({
          _id: { $in: cartIdsToDelete },
        });
        console.log(`${deleteResult.deletedCount} cart(s) deleted`);
      } else {
        console.log('No empty carts found');
      }
    } catch (error) {
      console.error('Error deleting empty carts:', error);
    }
  }
}
