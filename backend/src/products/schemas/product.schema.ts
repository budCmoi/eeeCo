import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true, suppressReservedKeysWarning: true })
export class Product {
  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  collection: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  originalPrice?: number;

  @Prop({ type: [String], default: [] })
  sizes: string[];

  @Prop({ type: [String], default: [] })
  colors: string[];

  @Prop({ required: true })
  description: string;

  @Prop({ type: [String], default: [] })
  details: string[];

  @Prop({ type: [{ src: String, alt: String }], default: [] })
  images: Array<{ src: string; alt: string }>;

  @Prop({ default: false })
  featured?: boolean;

  @Prop({ default: false })
  newArrival?: boolean;

  @Prop({ default: 0 })
  inventory: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);