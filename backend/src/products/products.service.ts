import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';

import { CreateProductDto } from '@/products/dto/create-product.dto';
import { seedProducts } from '@/products/products.seed';
import { UpdateProductDto } from '@/products/dto/update-product.dto';
import { isUuid, serializeProduct } from '@/prisma/prisma-mappers';
import { PrismaService } from '@/prisma/prisma.service';

const productInclude = {
  images: { orderBy: { position: 'asc' as const } },
  seller: { select: { id: true, name: true, avatar: true } },
  category: { select: { name: true, slug: true } }
};

@Injectable()
export class ProductsService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    const productCount = await this.prisma.product.count();

    if (productCount > 0) {
      return;
    }

    for (const product of seedProducts) {
      const typed = product as typeof product & {
        category?: string;
        images?: Array<{ src: string; alt: string }>;
        deliveryDays?: number;
      };
      await this.prisma.product.upsert({
        where: { slug: typed.slug },
        update: {},
        create: {
          slug: typed.slug,
          name: typed.name,
          categoryName: typed.category ?? 'General',
          collection: typed.collection ?? null,
          price: typed.price,
          originalPrice: typed.originalPrice ?? null,
          sizes: typed.sizes,
          colors: typed.colors,
          description: typed.description,
          details: typed.details,
          featured: typed.featured ?? false,
          newArrival: typed.newArrival ?? false,
          inventory: typed.inventory ?? 0,
          deliveryDays: typed.deliveryDays ?? 5,
          images: typed.images
            ? {
                create: typed.images.map((img, index) => ({ src: img.src, alt: img.alt, position: index }))
              }
            : undefined
        }
      });
    }
  }

  async findAll(query: Record<string, string | undefined>) {
    const where: Record<string, unknown> = {};

    if (query.category) {
      where.categoryName = { equals: query.category, mode: 'insensitive' };
    }

    if (query.size) {
      where.sizes = { has: query.size };
    }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { collection: { contains: query.search, mode: 'insensitive' } },
        { categoryName: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } }
      ];
    }

    const minPrice = query.minPrice ? Number(query.minPrice) : undefined;
    const maxPrice = query.maxPrice ? Number(query.maxPrice) : undefined;

    if (Number.isFinite(minPrice) || Number.isFinite(maxPrice)) {
      where.price = {};
      if (Number.isFinite(minPrice)) {
        (where.price as Record<string, number>).gte = minPrice as number;
      }
      if (Number.isFinite(maxPrice)) {
        (where.price as Record<string, number>).lte = maxPrice as number;
      }
    }

    if (query.delivery) {
      where.deliveryDays = { lte: Number(query.delivery) };
    }

    const orderBy: Record<string, unknown>[] = [];
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

    const items = await this.prisma.product.findMany({
      where,
      orderBy,
      include: productInclude
    });

    return { items: items.map(serializeProduct) };
  }

  async findOne(idOrSlug: string) {
    const product = await this.findUniqueProduct(idOrSlug);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return serializeProduct(product);
  }

  async create(dto: CreateProductDto, sellerId?: string) {
    const { images, ...rest } = dto as typeof dto & { images?: Array<{ src: string; alt: string }> };

    const product = await this.prisma.product.create({
      data: {
        slug: rest.slug,
        name: rest.name,
        categoryName: rest.category,
        collection: rest.collection ?? null,
        price: rest.price,
        originalPrice: rest.originalPrice ?? null,
        sizes: rest.sizes,
        colors: rest.colors,
        description: rest.description,
        details: rest.details,
        featured: rest.featured ?? false,
        newArrival: rest.newArrival ?? false,
        inventory: rest.inventory ?? 0,
        deliveryDays: rest.deliveryDays ?? 5,
        sellerId: sellerId ?? null,
        images: images
          ? {
              create: images.map((img, index) => ({ src: img.src, alt: img.alt, position: index }))
            }
          : undefined
      },
      include: productInclude
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
        ...(dto.category !== undefined ? { categoryName: dto.category } : {}),
        ...(dto.collection !== undefined ? { collection: dto.collection } : {}),
        ...(dto.price !== undefined ? { price: dto.price } : {}),
        ...(dto.originalPrice !== undefined ? { originalPrice: dto.originalPrice } : {}),
        ...(dto.sizes !== undefined ? { sizes: dto.sizes } : {}),
        ...(dto.colors !== undefined ? { colors: dto.colors } : {}),
        ...(dto.description !== undefined ? { description: dto.description } : {}),
        ...(dto.details !== undefined ? { details: dto.details } : {}),
        ...(dto.featured !== undefined ? { featured: dto.featured } : {}),
        ...(dto.newArrival !== undefined ? { newArrival: dto.newArrival } : {}),
        ...(dto.inventory !== undefined ? { inventory: dto.inventory } : {})
      },
      include: productInclude
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
      return this.prisma.product.findUnique({ where: { id: idOrSlug }, include: productInclude });
    }

    return this.prisma.product.findUnique({ where: { slug: idOrSlug }, include: productInclude });
  }
}