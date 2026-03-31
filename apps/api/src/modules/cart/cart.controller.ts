// cart.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { JwtUser } from '../../common/interfaces/jwt-payload';

@ApiTags('Cart')
@Controller('cart')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user cart' })
  @ApiResponse({ status: 200, description: 'Cart retrieved successfully' })
  getCart(@Req() req: { user: JwtUser }) {
    return this.cartService.getCart(req.user.id);
  }

  @Post('items')
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiResponse({ status: 201, description: 'Item added to cart' })
  addToCart(@Body() addToCartDto: AddToCartDto, @Req() req: { user: JwtUser }) {
    return this.cartService.addToCart(req.user.id, addToCartDto);
  }

  @Patch('items/:itemId')
  @ApiOperation({ summary: 'Update cart item quantity' })
  @ApiParam({ name: 'itemId', description: 'Cart item ID' })
  updateCartItem(
    @Param('itemId') itemId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
    @Req() req: { user: JwtUser },
  ) {
    return this.cartService.updateCartItem(
      req.user.id,
      itemId,
      updateCartItemDto,
    );
  }

  @Delete('items/:itemId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiParam({ name: 'itemId', description: 'Cart item ID' })
  async removeCartItem(
    @Param('itemId') itemId: string,
    @Req() req: { user: JwtUser },
  ) {
    await this.cartService.removeCartItem(req.user.id, itemId);
  }

  @Delete('clear')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Clear entire cart' })
  async clearCart(@Req() req: { user: JwtUser }) {
    await this.cartService.clearCart(req.user.id);
  }
}
