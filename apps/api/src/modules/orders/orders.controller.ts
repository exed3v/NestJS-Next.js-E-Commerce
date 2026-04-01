// modules/orders/orders.controller.ts
import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  UseGuards,
  Req,
  Patch,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CheckoutDto } from './dto/checkout.dto';
import { JwtUser } from '../../common/interfaces/jwt-payload';
import { CancelOrderDto } from './dto/cancel-order.dto';

@ApiTags('Orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user orders' })
  getMyOrders(@Req() req: { user: JwtUser }) {
    return this.ordersService.findByUser(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID (user must own it)' })
  getOrder(@Param('id') id: string, @Req() req: { user: JwtUser }) {
    return this.ordersService.findOne(id, req.user.id);
  }

  @Post('checkout')
  @ApiOperation({ summary: 'Create order from cart' })
  checkout(@Body() checkoutDto: CheckoutDto, @Req() req: { user: JwtUser }) {
    return this.ordersService.createFromCart(req.user.id, checkoutDto);
  }

  // orders.controller.ts
  @Patch(':id/cancel')
  @ApiOperation({
    summary: 'Cancel an order (only if PENDING and within 1 hour)',
  })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order cancelled successfully' })
  cancelOrder(
    @Param('id') id: string,
    @Body() cancelOrderDto: CancelOrderDto,
    @Req() req: { user: JwtUser },
  ) {
    return this.ordersService.cancelOrder(
      id,
      req.user.id,
      cancelOrderDto.reason,
    );
  }
}
