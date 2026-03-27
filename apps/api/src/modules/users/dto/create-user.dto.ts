import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
    minLength: 2,
  })
  @IsString()
  @MinLength(2)
  fullName: string;

  @ApiProperty({
    description: 'Email address of the user (must be unique)',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password for the account (min 6 characters)',
    example: 'securePassword123',
    minLength: 6,
    writeOnly: true, // No se muestra en respuestas
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({
    description: 'User role (only ADMIN can assign roles)',
    enum: ['ADMIN', 'USER'],
    default: 'USER',
    example: 'USER',
  })
  @IsOptional()
  @IsString()
  role?: string;
}
