import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, index: true })
  userId: string;

  @Prop({
    type: [
      {
        productId: String,
        slug: String,
        name: String,
        price: Number,
        quantity: Number,
        size: String,
        image: String
      }
    ],
    default: []
  })
  items: Array<{
    productId?: string;
    slug: string;
    name: string;
    price: number;
    quantity: number;
    size: string;
    image?: string;
  }>;

  @Prop({
    type: {
      firstName: String,
      lastName: String,
      email: String,
      phone: String,
      address1: String,
      address2: String,
      city: String,
      country: String,
      postalCode: String
    },
    required: true
  })
  address: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address1: string;
    address2?: string;
    city: string;
    country: string;
    postalCode: string;
  };

  @Prop({ required: true })
  subtotal: number;

  @Prop({ required: true })
  shipping: number;

  @Prop({ required: true })
  total: number;

  @Prop({ enum: ['processing', 'paid', 'shipped', 'delivered'], default: 'processing' })
  status: 'processing' | 'paid' | 'shipped' | 'delivered';

  @Prop({ enum: ['pending', 'paid'], default: 'pending' })
  paymentStatus: 'pending' | 'paid';

  @Prop()
  stripeSessionId?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);