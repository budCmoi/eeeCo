import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  OnModuleInit
} from '@nestjs/common';

import { CreateProductDto } from '@/products/dto/create-product.dto';
import { UpdateProductDto } from '@/products/dto/update-product.dto';
import { PrismaService } from '@/prisma/prisma.service';

const productInclude = {
  images: { orderBy: { position: 'asc' as const } },
  reviews: { orderBy: { createdAt: 'desc' as const } }
};

@Injectable()
export class ProductsService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    const count = await this.prisma.product.count();
    if (count > 0) return;

    await this.prisma.product.create({
      data: {
        slug: 'aurora-essence',
        title: 'Aurora Essence',
        shortDescription: 'Le parfum qui redéfinit le luxe accessible.',
        longDescription: "Aurora Essence est le fruit d'une quête d'excellence. Notes de tête : bergamote sicilienne, mandarine rose. Notes de coeur : rose de Damas, iris poudré, jasmin blanc. Notes de fond : bois de santal, ambre chaud, musc doux.",
        price: 89.9,
        compareAtPrice: 129.9,
        stock: 47,
        mainImage: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800',
        features: ['Fragrance longue durée 12h', 'Flacon rechargeable premium', 'Sans parabènes', 'Cruelty-free & vegan', 'Fabriqué en France'],
        benefits: ['Confiance instantanée', 'Signature olfactive unique', 'Emballage éco-responsable', 'Service client premium'],
        specifications: { volume: '50 ml', concentration: 'Eau de Parfum 18%', famille: 'Florale-Orientale', origine: 'Grasse, France' },
        marketingText: "Offrez-vous l'excellence. Aurora Essence, une fragrance pensée pour les esprits libres.",
        status: 'active',
        isActive: true,
        images: {
          create: [
            { src: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800', alt: 'Aurora Essence - Vue principale', position: 0 },
            { src: 'https://images.unsplash.com/photo-1542295669297-4d352b042bca?w=800', alt: 'Aurora Essence - Flacon détail', position: 1 },
            { src: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=800', alt: 'Aurora Essence - Ambiance', position: 2 },
            { src: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800', alt: 'Aurora Essence - Lifestyle', position: 3 }
          ]
        },
        reviews: {
          create: [
            { author: 'Sophie M.', avatar: 'https://i.pravatar.cc/100?img=1', rating: 5, comment: 'Un parfum absolument envoûtant. La tenue est incroyable.', isDemo: true },
            { author: 'Lucas R.', avatar: 'https://i.pravatar.cc/100?img=3', rating: 5, comment: "Offert pour l'anniversaire de ma femme. Elle l'adore.", isDemo: true },
            { author: 'Amira B.', avatar: 'https://i.pravatar.cc/100?img=5', rating: 4, comment: 'Magnifique, très élégant.', isDemo: true },
            { author: 'Thomas L.', avatar: 'https://i.pravatar.cc/100?img=8', rating: 5, comment: 'Le rapport qualité-prix est imbattable.', isDemo: true }
          ]
        }
      }
    });
  }

  async findActive() {
    const product = await this.prisma.product.findFirst({
      where: { isActive: true },
      include: productInclude
    });
    if (!product) throw new NotFoundException('Aucun produit actif');
    return product;
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id }, include: productInclude });
    if (!product) throw new NotFoundException('Produit introuvable');
    return product;
  }

  async create(dto: CreateProductDto, ownerId: string) {
    const existing = await this.prisma.product.findFirst({ where: { isActive: true } });
    if (existing) {
      throw new ConflictException('Un produit actif existe déjà. Supprimez-le avant d\'en créer un nouveau.');
    }

    const { images, ...data } = dto as CreateProductDto & { images?: Array<{ src: string; alt?: string }> };

    return this.prisma.product.create({
      data: {
        slug: data.slug,
        title: data.title,
        shortDescription: data.shortDescription,
        longDescription: data.longDescription,
        price: data.price,
        compareAtPrice: data.compareAtPrice,
        stock: data.stock ?? 0,
        mainImage: data.mainImage,
        features: data.features ?? [],
        benefits: data.benefits ?? [],
        specifications: (data.specifications as object) ?? {},
        marketingText: data.marketingText,
        status: (data.status as 'active' | 'draft') ?? 'draft',
        isActive: data.isActive ?? false,
        ownerId,
        images: images ? { create: images.map((img, i) => ({ src: img.src, alt: img.alt ?? '', position: i })) } : undefined
      },
      include: productInclude
    });
  }

  async update(id: string, dto: UpdateProductDto, requesterId: string, requesterRole: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Produit introuvable');
    if (requesterRole !== 'admin' && product.ownerId !== requesterId) throw new ForbiddenException('Accès refusé');

    const { images, ...data } = dto as UpdateProductDto & { images?: Array<{ src: string; alt?: string }> };

    return this.prisma.product.update({
      where: { id },
      data: {
        ...data,
        specifications: data.specifications ? (data.specifications as object) : undefined,
        ...(images !== undefined ? {
          images: { deleteMany: {}, create: images.map((img, i) => ({ src: img.src, alt: img.alt ?? '', position: i })) }
        } : {})
      },
      include: productInclude
    });
  }

  async remove(id: string, requesterId: string, requesterRole: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Produit introuvable');
    if (requesterRole !== 'admin' && product.ownerId !== requesterId) throw new ForbiddenException('Accès refusé');
    await this.prisma.product.delete({ where: { id } });
    return { message: 'Produit supprimé avec succès' };
  }
}
