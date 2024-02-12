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

  async addToCart(body: AddToCartDto): Promise<void> {
    const { products } = body;
    const userId = convertToObjectId(body.userId);

    const productIds = this.extractProductIds(products);
    const productsWithIds = await this.fetchProducts(productIds);
    this.checkProductAvailability(products, productsWithIds);

    const availableUser = await this.findUserCart(userId);
    if (availableUser) {
      await this.addToExistingCart(userId, products);
    } else {
      const mergedProducts = this.mergeAndConvertProducts(products);
      await this.createCart(userId, mergedProducts);
    }
  }

  //  Delete data from cart
  async removeFromCart(id: string): Promise<void> {
    await this.cartModel.findOneAndDelete({ userId: convertToObjectId(id) });
  }

  // To remove the specific item from cart

  async removeSpecificItem(body: RemoveSpecificItemDto): Promise<void> {
    const { productId } = body;
    const updatedCart = await this.cartModel
      .updateOne(
        {
          userId: convertToObjectId(body.userId),
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
    const cartData = await this.cartModel.aggregate([
      {
        $match: {
          userId: convertToObjectId(id),
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
    const { productId } = body;
    const decrementedData = await this.cartModel
      .updateOne(
        {
          userId: convertToObjectId(body.userId),
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

  // Other Private Functions

  private extractProductIds(products: AddToCartDto['products']): string[] {
    return products.map((product) => product.productId);
  }

  private async fetchProducts(productIds: string[]): Promise<Product[]> {
    return await this.productModel.find({
      _id: { $in: productIds },
    });
  }

  private checkProductAvailability(
    products: AddToCartDto['products'],
    productsWithIds: Product[],
  ): void {
    products.forEach((product) => {
      const availableProduct = productsWithIds.find(
        (p) => p._id.toString() === product.productId,
      );
      if (
        !availableProduct ||
        availableProduct.availableQuantity < product.quantity
      ) {
        throw new Error(
          `Product with ID ${product.productId} is Not Available`,
        );
      }
    });
  }

  private async findUserCart(userId: Types.ObjectId): Promise<Cart | null> {
    return await this.cartModel.findOne({ userId });
  }

  private async addToExistingCart(
    userId: Types.ObjectId,
    products: AddToCartDto['products'],
  ): Promise<void> {
    const allProductIdAvailableInCart =
      (await this.findUserCart(userId))?.products.map(({ productId }) =>
        productId.toString(),
      ) || [];

    const promises = products.map(async (element) => {
      if (allProductIdAvailableInCart.includes(element.productId)) {
        await this.cartModel.findOneAndUpdate(
          { userId, 'products.productId': element.productId },
          { $inc: { 'products.$.quantity': element.quantity } },
        );
      } else {
        await this.cartModel.updateOne(
          { userId },
          { $push: { products: element } },
        );
      }
    });

    await Promise.all(promises);
  }

  private mergeAndConvertProducts(
    products: AddToCartDto['products'],
  ): CartProduct[] {
    const mergedProductsMap = this.mergeProductsByProductId(products);
    return this.convertToCartProductsArray(mergedProductsMap);
  }

  private mergeProductsByProductId(
    products: AddToCartDto['products'],
  ): MergedProductsMap {
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

  private convertToCartProductsArray(
    mergedProductsMap: MergedProductsMap,
  ): CartProduct[] {
    return Object.entries(mergedProductsMap).map(([productId, quantity]) => ({
      productId,
      quantity,
    }));
  }

  private async createCart(
    userId: Types.ObjectId,
    products: CartProduct[],
  ): Promise<void> {
    await this.cartModel.create({
      userId,
      products,
    });
  }
}
