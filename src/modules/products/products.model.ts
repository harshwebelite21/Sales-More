import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: Number, required: true, default: 0 })
  price: number;

  @Prop({ type: Number, required: true, default: 0 })
  availableQuantity: number;

  @Prop({ type: Number, required: true })
  category: number;

  @Prop({ type: [{ url: String }] })
  images: { url: string }[];

  @Prop()
  image: string;

  @Prop()
  company: string;

  @Prop()
  stars: number;

  @Prop()
  featured: boolean;

  @Prop([String])
  colors: string[];

  @Prop([
    {
      name: { type: String, required: true },
      value: { type: String, required: true },
    },
  ])
  attributes: { name: string; value: string }[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.index({ name: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ name: 1, price: 1, category: 1 });

// category.enum.ts
export enum CategoryEnum {
  Clothing = 1,
  Electronics,
  HomeAndFurniture,
  SportsAndOutdoors,
}
