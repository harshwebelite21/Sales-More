import { Module } from '@nestjs/common'
import { ProductController } from './products.controller'
import { ProductService } from './products.service'
import { DatabaseModule } from 'src/database/database.module'
import { MongooseModule } from '@nestjs/mongoose'
import { ProductSchema } from './products.model'

@Module({
  imports: [DatabaseModule, MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }])],
  controllers: [ProductController],
  providers: [ProductService]
})

export class ProductModule {}
