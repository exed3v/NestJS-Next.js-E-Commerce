import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsInt, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class AddToCartDto {
  @ApiProperty({ description: 'Product ID', example: 'cm8x1a2b3c...' })
  @IsString()
  productId: string;

  @ApiPropertyOptional({
    description: 'Product variant ID (if applicable)',
    example: 'cm8x1a2b3c...',
  })
  @IsString()
  @IsOptional()
  variantId?: string;

  @ApiProperty({ description: 'Quantity', example: 1, default: 1 })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  quantity: number;
}
