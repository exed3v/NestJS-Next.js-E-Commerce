import { ApiProperty } from '@nestjs/swagger';

export class JwtUser {
  @ApiProperty({ description: 'User ID' })
  id: string;

  @ApiProperty({ description: 'User email' })
  email: string;

  @ApiProperty({ description: 'User role', enum: ['ADMIN', 'USER'] })
  role: string;

  @ApiProperty({ description: 'User full name', nullable: true })
  name?: string;
}
