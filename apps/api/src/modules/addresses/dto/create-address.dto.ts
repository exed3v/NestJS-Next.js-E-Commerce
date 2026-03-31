import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsPhoneNumber,
  IsPostalCode,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAddressDto {
  @ApiProperty({ description: 'First name', example: 'Juan' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'Last name', example: 'Pérez' })
  @IsString()
  lastName: string;

  @ApiPropertyOptional({ description: 'Company name', example: 'Empresa S.A.' })
  @IsString()
  @IsOptional()
  company?: string;

  @ApiProperty({
    description: 'Address line 1',
    example: 'Av. Corrientes 1234',
  })
  @IsString()
  addressLine1: string;

  @ApiPropertyOptional({
    description: 'Address line 2',
    example: 'Piso 3, Depto B',
  })
  @IsString()
  @IsOptional()
  addressLine2?: string;

  @ApiProperty({ description: 'City', example: 'Buenos Aires' })
  @IsString()
  city: string;

  @ApiProperty({ description: 'State/Province', example: 'CABA' })
  @IsString()
  state: string;

  @ApiProperty({ description: 'Postal code', example: '1043' })
  @IsString()
  @IsPostalCode('any')
  postalCode: string;

  @ApiProperty({ description: 'Country', example: 'Argentina' })
  @IsString()
  country: string;

  @ApiProperty({ description: 'Phone number', example: '+541112345678' })
  @IsPhoneNumber()
  phone: string;

  @ApiPropertyOptional({
    description: 'Set as default address',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  isDefault?: boolean;
}
