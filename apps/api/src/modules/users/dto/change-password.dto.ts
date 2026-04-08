// change-password.dto.ts
import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Current password for verification',
    example: 'OldPassword123',
    minLength: 1,
  })
  @IsString()
  currentPassword: string;

  @ApiProperty({
    description: 'New password (minimum 6 characters)',
    example: 'NewSecurePass456',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  newPassword: string;
}
