// cart.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

interface CartItemWithDetails {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: Array<{ url: string }>;
  };
  variant: {
    id: string;
    size: string;
    color: string;
  } | null;
}

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(userId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  where: { isMain: true },
                  take: 1,
                },
              },
            },
            variant: {
              select: {
                id: true,
                size: true,
                color: true,
                stock: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    // Tipar items
    const items = cart.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      product: item.product,
      variant: item.variant,
      unitPrice: item.product.price, // ✅ Siempre el precio base del producto
      totalPrice: item.product.price * item.quantity,
    }));

    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      id: cart.id,
      userId: cart.userId,
      expiresAt: cart.expiresAt,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
      items,
      subtotal,
      totalItems,
    };
  }

  async addToCart(userId: string, addToCartDto: AddToCartDto) {
    const { productId, variantId, quantity } = addToCartDto;

    let stockAvailable: number;
    let productName: string;

    // Verificar stock según si tiene variante o no
    if (variantId) {
      const variant = await this.prisma.productVariant.findUnique({
        where: { id: variantId },
        include: { product: true },
      });

      if (!variant) {
        throw new NotFoundException('Variant not found');
      }

      if (!variant.product.isActive) {
        throw new NotFoundException('Product not found');
      }

      stockAvailable = variant.stock;
      const variantDesc: string[] = [];
      if (variant.size) variantDesc.push(`Talle ${variant.size}`);
      if (variant.color) variantDesc.push(`Color ${variant.color}`);
      const variantSuffix = variantDesc.length
        ? ` - ${variantDesc.join(', ')}`
        : '';
      productName = `${variant.product.name}${variantSuffix}`;
      if (stockAvailable < quantity) {
        throw new BadRequestException(`Insufficient stock for ${productName}`);
      }
    } else {
      const product = await this.prisma.product.findUnique({
        where: { id: productId, isActive: true },
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      stockAvailable = product.stock;
      productName = product.name;

      if (stockAvailable < quantity) {
        throw new BadRequestException(`Insufficient stock for ${productName}`);
      }
    }

    // Obtener el carrito del usuario
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    // Verificar si el item ya existe en el carrito
    const existingItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
        variantId: variantId || null,
      },
    });

    if (existingItem) {
      // Actualizar cantidad
      const newQuantity = existingItem.quantity + quantity;

      // Verificar stock nuevamente con la nueva cantidad
      if (stockAvailable < newQuantity) {
        throw new BadRequestException(`Insufficient stock for ${productName}`);
      }

      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
        include: { product: true },
      });
    }

    // Crear nuevo item
    return this.prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        variantId: variantId || null,
        quantity,
      },
      include: { product: true },
    });
  }

  async updateCartItem(
    userId: string,
    itemId: string,
    updateCartItemDto: UpdateCartItemDto,
  ) {
    const { quantity } = updateCartItemDto;

    // Verificar que el item pertenece al usuario
    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: { userId },
      },
      include: { product: true },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    if (quantity === 0) {
      return this.prisma.cartItem.delete({
        where: { id: itemId },
      });
    }

    // Verificar stock según si tiene variante
    let stockAvailable: number;

    if (cartItem.variantId) {
      const variant = await this.prisma.productVariant.findUnique({
        where: { id: cartItem.variantId },
      });
      stockAvailable = variant?.stock ?? 0;
    } else {
      stockAvailable = cartItem.product.stock;
    }

    if (stockAvailable < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    return this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: { product: true },
    });
  }

  async removeCartItem(userId: string, itemId: string) {
    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: { userId },
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    return this.prisma.cartItem.delete({
      where: { id: itemId },
    });
  }

  async clearCart(userId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    return this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
  }
}
