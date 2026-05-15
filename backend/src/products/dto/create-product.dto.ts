import { IsArray, IsBoolean, IsNumber, IsObject, IsOptional, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @IsString() slug!: string;
  @IsString() title!: string;
  @IsString() shortDescription!: string;
  @IsString() longDescription!: string;
  @IsNumber() @Min(0) price!: number;
  @IsNumber() @IsOptional() compareAtPrice?: number;
  @IsNumber() @Min(0) @IsOptional() stock?: number;
  @IsString() mainImage!: string;
  @IsArray() @IsOptional() images?: Array<{ src: string; alt?: string }>;
  @IsArray() @IsOptional() features?: string[];
  @IsArray() @IsOptional() benefits?: string[];
  @IsObject() @IsOptional() specifications?: Record<string, string>;
  @IsString() @IsOptional() marketingText?: string;
  @IsBoolean() @IsOptional() isActive?: boolean;
  @IsString() @IsOptional() status?: string;
}
