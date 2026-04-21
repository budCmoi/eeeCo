import { Injectable, OnModuleInit } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

const DEFAULT_CATEGORIES = [
  { name: 'Vêtements', slug: 'vetements', description: 'Hauts, bas, robes et ensembles', imageUrl: '' },
  { name: 'Chaussures', slug: 'chaussures', description: 'Sneakers, boots, sandales', imageUrl: '' },
  { name: 'Accessoires', slug: 'accessoires', description: 'Sacs, bijoux, ceintures', imageUrl: '' },
  { name: 'Sport', slug: 'sport', description: 'Tenues et équipements sportifs', imageUrl: '' },
  { name: 'Luxe', slug: 'luxe', description: 'Pièces premium et éditions limitées', imageUrl: '' },
  { name: 'Streetwear', slug: 'streetwear', description: 'Urban fashion', imageUrl: '' },
  { name: 'Vintage', slug: 'vintage', description: 'Pièces rétro et secondhand', imageUrl: '' },
  { name: 'Électronique', slug: 'electronique', description: 'Gadgets et tech', imageUrl: '' }
];

@Injectable()
export class CategoriesService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    const count = await this.prisma.category.count();

    if (count > 0) {
      return;
    }

    await this.prisma.category.createMany({
      data: DEFAULT_CATEGORIES,
      skipDuplicates: true
    });
  }

  async findAll() {
    return this.prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { products: true } } }
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.category.findUnique({
      where: { slug },
      include: { _count: { select: { products: true } } }
    });
  }
}
