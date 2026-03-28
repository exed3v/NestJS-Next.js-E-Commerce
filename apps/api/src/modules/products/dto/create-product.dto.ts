// modules/products/dto/create-product.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  Min,
  MaxLength,
  IsArray,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({ description: 'Product name', example: 'Nike Air Max 90' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({
    description: 'Product description',
    example: 'Clásicas zapatillas Nike',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Product price', example: 120.0 })
  @IsNumber()
  @Min(0)
  @Type(() => Number) // 👈 Transforma string a número
  price: number;

  @ApiPropertyOptional({
    description: 'Compare at price (for discounts)',
    example: 150.0,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  compareAtPrice?: number;

  @ApiPropertyOptional({
    description: 'Cost per item (for admin)',
    example: 80.0,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  costPerItem?: number;

  @ApiPropertyOptional({
    description: 'Stock quantity',
    example: 50,
    default: 0,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  stock?: number;

  @ApiPropertyOptional({ description: 'SKU code', example: 'NK-AM90-001' })
  @IsString()
  @IsOptional()
  sku?: string;

  @ApiPropertyOptional({ description: 'Barcode', example: '1234567890123' })
  @IsString()
  @IsOptional()
  barcode?: string;

  @ApiPropertyOptional({ description: 'Product active status', default: true })
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Featured product', default: false })
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  isFeatured?: boolean;

  @ApiPropertyOptional({ description: 'Weight in kg', example: 0.5 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  weight?: number;

  @ApiPropertyOptional({ description: 'Category ID', example: 'cm8x1a2b3c...' })
  @IsString()
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'Image URLs from Cloudinary',
    type: [String],
  })
  @IsArray()
  @IsOptional()
  @IsUrl({}, { each: true })
  images?: string[];
}
