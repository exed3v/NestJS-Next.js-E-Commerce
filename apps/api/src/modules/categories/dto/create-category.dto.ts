import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Category name', example: 'Zapatillas' })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Category description',
    example: 'Todo tipo de zapatillas deportivas',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Category image URL',
    example: 'https://res.cloudinary.com/.../zapatillas.jpg',
  })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiPropertyOptional({
    description: 'Parent category ID (for nested categories)',
    example: 'cm8x1a2b3c...',
  })
  @IsString()
  @IsOptional()
  parentId?: string;
}
