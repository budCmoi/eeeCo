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

export class OrderItemDto {
  @IsOptional()
  @IsString()
  productId?: string;

  @IsString()
  slug: string;

  @IsString()
  name: string;

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