import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

import { Model } from 'mongoose';
import { Cart } from 'modules/cart/cart.model';

@Injectable()
export class CronService {
  constructor(@InjectModel('Cart') private readonly cartModel: Model<Cart>) {}
  @Cron('*/20 * * * *')
  async checkAndDeleteEmptyCart(): Promise<void> {
    try {
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
      console.error('Error During Cron Job', error);
      throw error;
    }
  }
}
