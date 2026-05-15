import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        addresses: { orderBy: { createdAt: 'asc' } },
        paymentMethods: { orderBy: { createdAt: 'asc' } },
        orders: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            items: {
              include: {
                product: { select: { title: true, mainImage: true, slug: true } }
              }
            }
          }
        },
        product: {
          select: { id: true, title: true, isActive: true, status: true, price: true, mainImage: true }
        }
      }
    });

    if (!user) throw new NotFoundException('Utilisateur introuvable');

    // Ne jamais exposer le mot de passe
    const { password, googleId, ...safeUser } = user;
    return safeUser;
  }

  async update(userId: string, dto: UpdateProfileDto) {
    const nameParts = [dto.firstName, dto.lastName].filter(Boolean);
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.firstName !== undefined ? { firstName: dto.firstName } : {}),
        ...(dto.lastName !== undefined ? { lastName: dto.lastName } : {}),
        ...(nameParts.length > 0 ? { name: nameParts.join(' ') } : {}),
        ...(dto.phone !== undefined ? { phone: dto.phone } : {}),
        ...(dto.avatar !== undefined ? { avatar: dto.avatar } : {})
      },
      select: {
        id: true, firstName: true, lastName: true,
        name: true, email: true, phone: true, avatar: true, role: true
      }
    });
  }

  async addAddress(
    userId: string,
    data: {
      label?: string;
      firstName: string;
      lastName: string;
      street: string;
      city: string;
      postalCode: string;
      country?: string;
      isDefault?: boolean;
      isBilling?: boolean;
      isShipping?: boolean;
    }
  ) {
    if (data.isDefault) {
      await this.prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
    }
    return this.prisma.address.create({ data: { userId, ...data } });
  }

  async removeAddress(userId: string, addressId: string) {
    await this.prisma.address.deleteMany({ where: { id: addressId, userId } });
    return { message: 'Adresse supprimée' };
  }

  async addPaymentMethod(
    userId: string,
    data: {
      type: string;
      label: string;
      brand?: string;
      last4?: string;
      expMonth?: number;
      expYear?: number;
      isDefault?: boolean;
    }
  ) {
    if (data.isDefault) {
      await this.prisma.paymentMethod.updateMany({ where: { userId }, data: { isDefault: false } });
    }
    return this.prisma.paymentMethod.create({ data: { userId, ...data, isDemo: true } });
  }

  async removePaymentMethod(userId: string, pmId: string) {
    await this.prisma.paymentMethod.deleteMany({ where: { id: pmId, userId } });
    return { message: 'Moyen de paiement supprimé' };
  }
}
