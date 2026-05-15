import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateOrderDto } from '@/orders/dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateOrderDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Utilisateur introuvable');

    const product = await this.prisma.product.findFirst({ where: { isActive: true } });
    const shipping = dto.subtotal >= 80 ? 0 : 4.99;
    const discount = dto.promoCode === 'AURORA10' ? dto.subtotal * 0.1 : 0;
    const total = dto.subtotal + shipping - discount;

    return this.prisma.order.create({
      data: {
        userId,
        address: dto.address as object,
        subtotal: dto.subtotal,
        shipping,
        discount,
        total,
        promoCode: dto.promoCode,
        paymentMethod: dto.paymentMethod ?? 'demo',
        status: 'processing',
        paymentStatus: 'paid',
        isDemo: true,
        items: {
          create: dto.items.map((item) => ({
            productId: product?.id ?? item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: {
        items: { include: { product: { select: { title: true, mainImage: true, slug: true } } } }
      }
    });
  }

  async findForUser(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { items: { include: { product: { select: { title: true, mainImage: true, slug: true } } } } }
    });
  }

  async findOne(id: string, userId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id, userId },
      include: { items: { include: { product: true } } }
    });
    if (!order) throw new NotFoundException('Commande introuvable');
    return order;
  }
}
