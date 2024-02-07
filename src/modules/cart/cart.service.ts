import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './cart.model';
import { Model, Types } from 'mongoose';
import {
  AddToCartDto,
  FindCartInterface,
  RemoveSpecificItemDto,
} from './dto/cart.dto';

@Injectable()
export class CartService {
  constructor(@InjectModel('Cart') private readonly cartModel: Model<Cart>) {}

  // Create a cart
  async addToCart(body: AddToCartDto): Promise<void> {
    const { userId, products } = body;

    // Check users cart available or not
    const availableUser = await this.cartModel.findOne({ userId });
    // const availableUser = await this.cartModel.exists({ userId });   returns only id;

    // If User is available then Added Products to same cart other wise create new cart
    if (availableUser) {
      // To save the all userId which is saved in user's specific cart
      const allProductIdAvailableInCart = availableUser.products.map(
        ({ productId }) => {
          return productId.toString();
        },
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
  }

  //  Delete data from cart
  async removeFromCart(userId: string): Promise<void> {
    await this.cartModel.findOneAndDelete({ userId });
  }

  // To remove the specific item from cart

  async removeSpecificItem(body: RemoveSpecificItemDto): Promise<void> {
    const { userId, productId } = body;
    const updatedCart = await this.cartModel
      .updateOne(
        {
          userId,
          'products.productId': productId,
        },
        { $pull: { products: { productId } } },
      )
      .populate('userId');
    if (!updatedCart || updatedCart.modifiedCount < 1) {
      throw Error('Cart or item not found');
    }
    this.checkAndDeleteEmptyCart();
  }

  // View the user data from cart
  async findCart(userId: string): Promise<FindCartInterface[]> {
    const cartData = await this.cartModel.aggregate([
      {
        $match: {
          userId: new Types.ObjectId(userId),
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
    if (cartData.length == 0) {
      throw Error('No Such User Found');
    }

    return cartData;
  }

  async reduceQuantity(body: RemoveSpecificItemDto): Promise<void> {
    const { userId, productId } = body;
    const decrementedData = await this.cartModel
      .updateOne(
        {
          userId,
          'products.productId': productId,
        },
        {
          $inc: { 'products.$.quantity': -1 },
        },
      )
      .populate('userId');
    if (!decrementedData || decrementedData.modifiedCount < 1) {
      throw Error('Cart or item not found.');
    }
  }

  // Automatically Delete cart if it is an empty cart
  async checkAndDeleteEmptyCart(): Promise<void> {
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
  }
}
