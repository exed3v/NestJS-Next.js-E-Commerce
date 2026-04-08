// update-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEmail, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
    minLength: 2,
  })
  @IsString()
  @MinLength(2)
  @IsOptional()
  fullName?: string;

  @ApiProperty({
    description: 'Email address of the user (must be unique)',
    example: 'john.doe@example.com',
  })
  @IsOptional()
  @IsEmail()
  email: string;
}
