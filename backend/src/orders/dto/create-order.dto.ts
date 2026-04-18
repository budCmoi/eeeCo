import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator';

class OrderProductImageDto {
  @IsString()
  src: string;

  @IsString()
  alt: string;
}

class OrderProductSnapshotDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  _id?: string;

  @IsString()
  slug: string;

  @IsString()
  name: string;

  @IsString()
  category: string;

  @IsString()
  collection: string;

  @Type(() => Number)
  @IsNumber()
  price: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  originalPrice?: number;

  @IsArray()
  @IsString({ each: true })
  sizes: string[];

  @IsArray()
  @IsString({ each: true })
  colors: string[];

  @IsString()
  description: string;

  @IsArray()
  @IsString({ each: true })
  details: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderProductImageDto)
  images: OrderProductImageDto[];

  @IsOptional()
  featured?: boolean;

  @IsOptional()
  newArrival?: boolean;

  @Type(() => Number)
  @IsNumber()
  inventory: number;
}

export class OrderItemDto {
  @IsOptional()
  @IsString()
  productId?: string;

  @IsOptional()
  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  price: number;

  @Type(() => Number)
  @IsNumber()
  quantity: number;

  @IsString()
  size: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => OrderProductSnapshotDto)
  product?: OrderProductSnapshotDto;
}

export class AddressDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  address1: string;

  @IsOptional()
  @IsString()
  address2?: string;

  @IsString()
  city: string;

  @IsString()
  country: string;

  @IsString()
  postalCode: string;
}

export class CreateOrderDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @Type(() => Number)
  @IsNumber()
  subtotal: number;

  @Type(() => Number)
  @IsNumber()
  shipping: number;

  @Type(() => Number)
  @IsNumber()
  total: number;
}