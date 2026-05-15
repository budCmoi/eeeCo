import { IsArray, IsBoolean, IsNumber, IsObject, IsOptional, IsString, Min } from 'class-validator';

export class UpdateProductDto {
  @IsString() @IsOptional() slug?: string;
  @IsString() @IsOptional() title?: string;
  @IsString() @IsOptional() shortDescription?: string;
  @IsString() @IsOptional() longDescription?: string;
  @IsNumber() @Min(0) @IsOptional() price?: number;
  @IsNumber() @IsOptional() compareAtPrice?: number;
  @IsNumber() @Min(0) @IsOptional() stock?: number;
  @IsString() @IsOptional() mainImage?: string;
  @IsArray() @IsOptional() images?: Array<{ src: string; alt?: string }>;
  @IsArray() @IsOptional() features?: string[];
  @IsArray() @IsOptional() benefits?: string[];
  @IsObject() @IsOptional() specifications?: Record<string, string>;
  @IsString() @IsOptional() marketingText?: string;
  @IsBoolean() @IsOptional() isActive?: boolean;
  @IsString() @IsOptional() status?: string;
}
