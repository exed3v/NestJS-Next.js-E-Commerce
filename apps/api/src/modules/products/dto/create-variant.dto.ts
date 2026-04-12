import { IsString, IsOptional, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVariantDto {
  @ApiProperty({ required: false, example: 'M' })
  @IsOptional()
  @IsString()
  size?: string;

  @ApiProperty({ required: false, example: 'Rojo' })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiProperty({ required: false, example: 10 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;
}
