import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { convertToObjectId } from 'src/utils/converter';
import { Cart } from './cart.model';
import { AddToCartDto, RemoveSpecificItemDto } from './dto/cart.dto';
import { CartProduct, FindCartInterface } from './interfaces/cart.interface';
import { Product } from '../products/products.model';

// Define the MergedProductsMap type
type MergedProductsMap = { [productId: string]: number };

@Injectable()
export class CartService {
  constructor(
    @InjectModel('Cart') private readonly cartModel: Model<Cart>,
    @InjectModel('Product')
    private readonly productModel: Model<Product>,
  ) {}

  // Create a cart
  async addToCart(body: AddToCartDto): Promise<void> {
    const { products } = body;
    const userId = new Types.ObjectId(body.userId);

    const productIds = products.map((product) => product.productId);

    // Fetch all products at once
    const productsWithIds = await this.productModel.find({
      _id: { $in: productIds },
    });

    // Create a map of available product IDs to their quantities
    const availableProductMap: Array<{ productId: string; qty: number }> = [];
    productsWithIds.forEach((product) => {
      availableProductMap.push({
        productId: product._id.toString(),
        qty: product.availableQuantity,
      });
    });

    // Check if any product is not available
    const unavailableProduct = products.find((product) => {
      const getProduct = availableProductMap.find(
        (availableProduct) => availableProduct.productId === product.productId,
      );
      return !getProduct?.qty;
    });

    if (unavailableProduct) {
      throw new Error(
        `Product with ID ${unavailableProduct.productId} is Not Available`,
      );
    }

    // Check users cart available or not
    const availableUser = await this.cartModel.findOne({ userId });

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
      const mergedProducts: CartProduct[] = ((products: CartProduct[]) => {
        // Merge products by productId
        const mergedProductsMap = this.mergeProductsByProductId(products);
        // Convert merged products map to array of CartProduct objects
        return this.convertToCartProductsArray(mergedProductsMap);
      })(products);

      await this.cartModel.create({
        userId,
        products: mergedProducts,
      });
    }
  }

  //  Delete data from cart
  async removeFromCart(id: string): Promise<void> {
    const userId = convertToObjectId(id);
    await this.cartModel.findOneAndDelete({ userId });
  }

  // To remove the specific item from cart

  async removeSpecificItem(body: RemoveSpecificItemDto): Promise<void> {
    const { productId } = body;
    const userId = new Types.ObjectId(body.userId);
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
  }

  // View the user data from cart
  async findCart(id: string): Promise<FindCartInterface[]> {
    const userId = convertToObjectId(id);
    const cartData = await this.cartModel.aggregate([
      {
        $match: {
          userId,
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
    if (!cartData.length) {
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

  // Function to merge products by productId
  private mergeProductsByProductId(products: CartProduct[]): MergedProductsMap {
    const mergedProductsMap: MergedProductsMap = {};

    products.forEach((product) => {
      if (mergedProductsMap[product.productId] === undefined) {
        mergedProductsMap[product.productId] = product.quantity;
      } else {
        mergedProductsMap[product.productId] += product.quantity;
      }
    });

    return mergedProductsMap;
  }

  // Function to convert merged products map to array of CartProduct objects
  private convertToCartProductsArray(
    mergedProductsMap: MergedProductsMap,
  ): CartProduct[] {
    return Object.entries(mergedProductsMap).map(([productId, quantity]) => ({
      productId,
      quantity,
    }));
  }
}
