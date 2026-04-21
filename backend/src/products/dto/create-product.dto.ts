import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';

class ProductImageDto {
  @IsString()
  src: string;

  @IsString()
  alt: string;
}

export class CreateProductDto {
  @IsString()
  slug: string;

  @IsString()
  name: string;

  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  collection?: string;

  @Type(() => Number)
  @IsNumber()
  price: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  originalPrice?: number;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  sizes: string[];

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  colors: string[];

  @IsString()
  description: string;

  @IsArray()
  @IsString({ each: true })
  details: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductImageDto)
  images: ProductImageDto[];

  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @IsBoolean()
  newArrival?: boolean;

  @Type(() => Number)
  @IsNumber()
  inventory: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  deliveryDays?: number;
}