import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProductController } from './products.controller';
import { ProductSchema } from './products.model';
import { ProductService } from './products.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
