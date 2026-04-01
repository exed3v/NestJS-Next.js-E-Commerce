import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export enum PaymentMethod {
  CARD = 'CARD',
  PAYPAL = 'PAYPAL',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CASH_ON_DELIVERY = 'CASH_ON_DELIVERY',
}

export class CheckoutDto {
  @ApiProperty({ description: 'Shipping address ID', example: 'cm8x1a2b3c...' })
  @IsString()
  shippingAddressId: string;

  @ApiPropertyOptional({
    description: 'Billing address ID (if different from shipping)',
    example: 'cm8x1a2b3c...',
  })
  @IsString()
  @IsOptional()
  billingAddressId?: string;

  @ApiPropertyOptional({
    description: 'Payment method',
    enum: ['CARD', 'PAYPAL', 'BANK_TRANSFER', 'CASH_ON_DELIVERY'],
    default: 'CARD',
  })
  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @ApiPropertyOptional({
    description: 'Additional notes',
    example: 'Leave at the door',
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
