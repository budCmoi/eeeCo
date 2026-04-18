import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { CreateOrderDto } from '@/orders/dto/create-order.dto';
import {
  hasCompleteOrderItems,
  normalizeCheckoutItems,
  normalizeOrderAddress,
  serializeOrder
} from '@/prisma/prisma-mappers';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateOrderDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const items = normalizeCheckoutItems(dto.items);

    if (!hasCompleteOrderItems(items)) {
      throw new BadRequestException('Invalid order items');
    }

    const order = await this.prisma.order.create({
      data: {
        userId,
        items,
        address: normalizeOrderAddress(dto.address),
        subtotal: dto.subtotal,
        shipping: dto.shipping,
        total: dto.total,
        paymentStatus: 'pending',
        status: 'processing'
      }
    });

    return serializeOrder(order);
  }

  async findMyOrders(userId: string) {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return orders.map(serializeOrder);
  }

  async findAll() {
    const orders = await this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return orders.map(serializeOrder);
  }

  async getOverview() {
    const [ordersCount, paidOrders, revenueResult] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.order.count({ where: { paymentStatus: 'paid' } }),
      this.prisma.order.aggregate({ _sum: { total: true } })
    ]);

    return {
      ordersCount,
      paidOrders,
      revenue: revenueResult._sum.total ?? 0
    };
  }
}