import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';

import { CreateProductDto } from '@/products/dto/create-product.dto';
import { seedProducts } from '@/products/products.seed';
import { UpdateProductDto } from '@/products/dto/update-product.dto';
import { Product, ProductDocument } from '@/products/schemas/product.schema';

@Injectable()
export class ProductsService implements OnModuleInit {
  constructor(@InjectModel(Product.name) private readonly productModel: Model<ProductDocument>) {}

  async onModuleInit() {
    const productCount = await this.productModel.estimatedDocumentCount();

    if (productCount > 0) {
      return;
    }

    await this.productModel.insertMany(seedProducts);
  }

  async findAll(query: Record<string, string | undefined>) {
    const filter: FilterQuery<ProductDocument> = {};

    if (query.category) {
      filter.category = query.category;
    }

    if (query.size) {
      filter.sizes = query.size;
    }

    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { collection: { $regex: query.search, $options: 'i' } },
        { category: { $regex: query.search, $options: 'i' } }
      ];
    }

    const minPrice = query.minPrice ? Number(query.minPrice) : undefined;
    const maxPrice = query.maxPrice ? Number(query.maxPrice) : undefined;

    if (typeof minPrice === 'number' || typeof maxPrice === 'number') {
      filter.price = {};

      if (typeof minPrice === 'number') {
        filter.price.$gte = minPrice;
      }

      if (typeof maxPrice === 'number') {
        filter.price.$lte = maxPrice;
      }
    }

    const request = this.productModel.find(filter);

    switch (query.sort) {
      case 'price-asc':
        request.sort({ price: 1 });
        break;
      case 'price-desc':
        request.sort({ price: -1 });
        break;
      case 'newest':
        request.sort({ createdAt: -1, newArrival: -1 });
        break;
      default:
        request.sort({ featured: -1, createdAt: -1 });
        break;
    }

    return {
      items: await request.exec()
    };
  }

  async findOne(idOrSlug: string) {
    const query = Types.ObjectId.isValid(idOrSlug) ? { _id: idOrSlug } : { slug: idOrSlug };
    const product = await this.productModel.findOne(query);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  create(dto: CreateProductDto) {
    return this.productModel.create(dto);
  }

  async update(idOrSlug: string, dto: UpdateProductDto) {
    const query = Types.ObjectId.isValid(idOrSlug) ? { _id: idOrSlug } : { slug: idOrSlug };
    const product = await this.productModel.findOneAndUpdate(query, dto, { new: true });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async remove(idOrSlug: string) {
    const query = Types.ObjectId.isValid(idOrSlug) ? { _id: idOrSlug } : { slug: idOrSlug };
    const deleted = await this.productModel.findOneAndDelete(query);

    if (!deleted) {
      throw new NotFoundException('Product not found');
    }

    return { deleted: true };
  }
}