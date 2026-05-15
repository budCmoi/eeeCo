import { IsArray, IsNumber, IsObject, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @IsString() productId!: string;
  @IsNumber() @Min(1) quantity!: number;
  @IsNumber() price!: number;
}

export class CreateOrderDto {
  @IsArray() @ValidateNested({ each: true }) @Type(() => OrderItemDto) items!: OrderItemDto[];
  @IsObject() address!: Record<string, string>;
  @IsNumber() @Min(0) subtotal!: number;
  @IsString() @IsOptional() promoCode?: string;
  @IsString() @IsOptional() paymentMethod?: string;
}
