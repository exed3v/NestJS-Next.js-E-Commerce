import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Full name of the user',
    example: 'John Doe Updated',
    minLength: 2,
  })
  @IsString()
  @IsOptional()
  @MinLength(2)
  fullName?: string;

  @ApiPropertyOptional({
    description: 'Email address of the user',
    example: 'john.updated@example.com',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'New password (min 6 characters)',
    example: 'newSecurePassword123',
    minLength: 6,
    writeOnly: true,
  })
  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;
}
