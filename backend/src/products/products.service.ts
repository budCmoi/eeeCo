import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { CreateProductDto } from '@/products/dto/create-product.dto';
import { seedProducts } from '@/products/products.seed';
import { UpdateProductDto } from '@/products/dto/update-product.dto';
import { isUuid, serializeProduct } from '@/prisma/prisma-mappers';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class ProductsService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    const productCount = await this.prisma.product.count();

    if (productCount > 0) {
      return;
    }

    await this.prisma.$transaction(
      seedProducts.map((product) =>
        this.prisma.product.create({
          data: {
            ...product,
            images: product.images as unknown as Prisma.InputJsonValue,
            featured: product.featured ?? false,
            newArrival: product.newArrival ?? false
          }
        })
      )
    );
  }

  async findAll(query: Record<string, string | undefined>) {
    const where: Prisma.ProductWhereInput = {};

    if (query.category) {
      where.category = query.category;
    }

    if (query.size) {
      where.sizes = { has: query.size };
    }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { collection: { contains: query.search, mode: 'insensitive' } },
        { category: { contains: query.search, mode: 'insensitive' } }
      ];
    }

    const minPrice = query.minPrice ? Number(query.minPrice) : undefined;
    const maxPrice = query.maxPrice ? Number(query.maxPrice) : undefined;

    if (Number.isFinite(minPrice) || Number.isFinite(maxPrice)) {
      where.price = {};

      if (Number.isFinite(minPrice)) {
        where.price.gte = minPrice;
      }

      if (Number.isFinite(maxPrice)) {
        where.price.lte = maxPrice;
      }
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput[] = [];

    switch (query.sort) {
      case 'price-asc':
        orderBy.push({ price: 'asc' });
        break;
      case 'price-desc':
        orderBy.push({ price: 'desc' });
        break;
      case 'newest':
        orderBy.push({ createdAt: 'desc' }, { newArrival: 'desc' });
        break;
      default:
        orderBy.push({ featured: 'desc' }, { createdAt: 'desc' });
        break;
    }

    const items = await this.prisma.product.findMany({ where, orderBy });

    return {
      items: items.map(serializeProduct)
    };
  }

  async findOne(idOrSlug: string) {
    const product = await this.findUniqueProduct(idOrSlug);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return serializeProduct(product);
  }

  async create(dto: CreateProductDto) {
    const product = await this.prisma.product.create({
      data: {
        ...dto,
        images: dto.images as unknown as Prisma.InputJsonValue,
        featured: dto.featured ?? false,
        newArrival: dto.newArrival ?? false
      }
    });

    return serializeProduct(product);
  }

  async update(idOrSlug: string, dto: UpdateProductDto) {
    const existingProduct = await this.findUniqueProduct(idOrSlug);

    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }

    const product = await this.prisma.product.update({
      where: { id: existingProduct.id },
      data: {
        ...(dto.slug !== undefined ? { slug: dto.slug } : {}),
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.category !== undefined ? { category: dto.category } : {}),
        ...(dto.collection !== undefined ? { collection: dto.collection } : {}),
        ...(dto.price !== undefined ? { price: dto.price } : {}),
        ...(dto.originalPrice !== undefined ? { originalPrice: dto.originalPrice } : {}),
        ...(dto.sizes !== undefined ? { sizes: dto.sizes } : {}),
        ...(dto.colors !== undefined ? { colors: dto.colors } : {}),
        ...(dto.description !== undefined ? { description: dto.description } : {}),
        ...(dto.details !== undefined ? { details: dto.details } : {}),
        ...(dto.images !== undefined ? { images: dto.images as unknown as Prisma.InputJsonValue } : {}),
        ...(dto.featured !== undefined ? { featured: dto.featured } : {}),
        ...(dto.newArrival !== undefined ? { newArrival: dto.newArrival } : {}),
        ...(dto.inventory !== undefined ? { inventory: dto.inventory } : {})
      }
    });

    return serializeProduct(product);
  }

  async remove(idOrSlug: string) {
    const existingProduct = await this.findUniqueProduct(idOrSlug);

    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }

    await this.prisma.product.delete({ where: { id: existingProduct.id } });

    return { deleted: true };
  }

  private findUniqueProduct(idOrSlug: string) {
    if (isUuid(idOrSlug)) {
      return this.prisma.product.findUnique({ where: { id: idOrSlug } });
    }

    return this.prisma.product.findUnique({ where: { slug: idOrSlug } });
  }
}