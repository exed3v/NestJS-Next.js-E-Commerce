import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVariantDto {
  @ApiProperty({
    description: 'Variant type (Color, Talla, etc.)',
    example: 'Color',
  })
  @IsString()
  type: string;

  @ApiProperty({ description: 'Variant value', example: 'Negro' })
  @IsString()
  value: string;

  @ApiPropertyOptional({
    description: 'Specific price for this variant',
    example: 125.0,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  price?: number;

  @ApiPropertyOptional({
    description: 'Stock for this variant',
    example: 20,
    default: 0,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  stock?: number;

  @ApiPropertyOptional({
    description: 'SKU for this variant',
    example: 'NK-AM90-BLK',
  })
  @IsString()
  @IsOptional()
  sku?: string;
}
