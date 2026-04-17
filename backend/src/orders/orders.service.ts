import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateOrderDto } from '@/orders/dto/create-order.dto';
import { Order, OrderDocument } from '@/orders/schemas/order.schema';

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>) {}

  create(userId: string, dto: CreateOrderDto) {
    return this.orderModel.create({
      ...dto,
      userId,
      paymentStatus: 'pending',
      status: 'processing'
    });
  }

  findMyOrders(userId: string) {
    return this.orderModel.find({ userId }).sort({ createdAt: -1 });
  }

  findAll() {
    return this.orderModel.find().sort({ createdAt: -1 });
  }

  async getOverview() {
    const [ordersCount, paidOrders, revenueResult] = await Promise.all([
      this.orderModel.countDocuments(),
      this.orderModel.countDocuments({ paymentStatus: 'paid' }),
      this.orderModel.aggregate([{ $group: { _id: null, revenue: { $sum: '$total' } } }])
    ]);

    return {
      ordersCount,
      paidOrders,
      revenue: revenueResult[0]?.revenue ?? 0
    };
  }
}