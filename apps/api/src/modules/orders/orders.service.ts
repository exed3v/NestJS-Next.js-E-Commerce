// modules/orders/orders.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CartService } from '../cart/cart.service';
import { CheckoutDto, PaymentMethod } from './dto/checkout.dto';
import { OrderStatus } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private cartService: CartService,
  ) {}

  private generateOrderNumber(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    return `ORD-${year}${month}-${random}`;
  }

  // Función auxiliar para validar paymentMethod
  private getPaymentMethod = (method?: string): PaymentMethod => {
    if (method === 'PAYPAL') return PaymentMethod.PAYPAL;
    if (method === 'BANK_TRANSFER') return PaymentMethod.BANK_TRANSFER;
    if (method === 'CASH_ON_DELIVERY') return PaymentMethod.CASH_ON_DELIVERY;
    return PaymentMethod.CARD; // default
  };

  async createFromCart(userId: string, checkoutDto: CheckoutDto) {
    // 1. Obtener carrito con items
    const cart = await this.cartService.getCart(userId);

    if (!cart.items || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // 2. Validar direcciones
    const shippingAddress = await this.prisma.address.findUnique({
      where: { id: checkoutDto.shippingAddressId },
    });

    if (!shippingAddress || shippingAddress.userId !== userId) {
      throw new BadRequestException('Invalid shipping address');
    }

    let billingAddressId = checkoutDto.shippingAddressId;
    if (checkoutDto.billingAddressId) {
      const billingAddress = await this.prisma.address.findUnique({
        where: { id: checkoutDto.billingAddressId },
      });
      if (!billingAddress || billingAddress.userId !== userId) {
        throw new BadRequestException('Invalid billing address');
      }
      billingAddressId = checkoutDto.billingAddressId;
    }

    // 3. Validar stock y preparar datos
    const orderItems: any[] = [];
    let subtotal = 0;

    for (const item of cart.items) {
      let unitPrice: number;
      let productName: string;
      let productSku: string | null = null;
      let variantInfo: any = null;

      if (item.variant) {
        // Verificar stock de variante
        const variant = await this.prisma.productVariant.findUnique({
          where: { id: item.variant.id },
          include: { product: true },
        });

        if (!variant || variant.stock < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for ${variant?.product.name} - ${variant?.type}: ${variant?.value}`,
          );
        }

        unitPrice = variant.price ?? variant.product.price;
        productName = variant.product.name;
        productSku = variant.sku;
        variantInfo = { type: variant.type, value: variant.value };
      } else {
        // Verificar stock de producto
        const product = await this.prisma.product.findUnique({
          where: { id: item.product.id },
        });

        if (!product || product.stock < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for ${product?.name}`,
          );
        }

        unitPrice = product.price;
        productName = product.name;
        productSku = product.sku;
      }

      const total = unitPrice * item.quantity;
      subtotal += total;

      orderItems.push({
        productId: item.product.id,
        variantId: item.variant?.id || null,
        productName,
        productSku,
        variantInfo: variantInfo ? JSON.stringify(variantInfo) : null,
        unitPrice,
        quantity: item.quantity,
        total,
      });
    }

    // 4. Calcular totales
    const tax = subtotal * 0.21;
    const shippingCost = 10;
    const total = subtotal + tax + shippingCost;

    const orderNumber = this.generateOrderNumber();

    // 5. Crear orden y descontar stock en transacción
    const order = await this.prisma.$transaction(async (prisma) => {
      // Crear orden
      const newOrder = await prisma.order.create({
        data: {
          orderNumber,
          userId,
          subtotal,
          tax,
          shippingCost,
          total,
          shippingAddressId: checkoutDto.shippingAddressId,
          billingAddressId,
          paymentMethod: this.getPaymentMethod(checkoutDto.paymentMethod),
          notes: checkoutDto.notes,
          items: {
            create: orderItems,
          },
        },
        include: {
          items: true,
          shippingAddress: true,
          billingAddress: true,
        },
      });

      // Descontar stock
      for (const item of cart.items) {
        if (item.variant?.id) {
          // 1. Descontar stock de la variante
          await prisma.productVariant.update({
            where: { id: item.variant.id },
            data: { stock: { decrement: item.quantity } },
          });

          // 2. Descontar stock total del producto
          await prisma.product.update({
            where: { id: item.product.id },
            data: { stock: { decrement: item.quantity } },
          });
        } else {
          // Si no tiene variante, solo descontar producto
          await prisma.product.update({
            where: { id: item.product.id },
            data: { stock: { decrement: item.quantity } },
          });
        }
      }

      // Vaciar carrito
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return newOrder;
    });

    return order;
  }

  async findByUser(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
        shippingAddress: true,
      },
    });
  }

  async findOne(id: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        shippingAddress: true,
        billingAddress: true,
        user: {
          select: { id: true, email: true, fullName: true },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    if (order.userId !== userId) {
      throw new ForbiddenException('You can only view your own orders');
    }

    return order;
  }

  async findAll() {
    return this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
        user: {
          select: { id: true, email: true, fullName: true },
        },
        shippingAddress: true,
      },
    });
  }

  async findOneAdmin(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        shippingAddress: true,
        billingAddress: true,
        user: {
          select: { id: true, email: true, fullName: true },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async updateStatus(id: string, status: OrderStatus) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    const updateData: {
      status: OrderStatus;
      shippedAt?: Date;
      deliveredAt?: Date;
    } = { status };

    if (status === OrderStatus.SHIPPED && !order.shippedAt) {
      updateData.shippedAt = new Date();
    }

    if (status === OrderStatus.DELIVERED && !order.deliveredAt) {
      updateData.deliveredAt = new Date();
    }

    return this.prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        items: true,
        user: {
          select: { id: true, email: true, fullName: true },
        },
      },
    });
  }
  // orders.service.ts
  async cancelOrder(orderId: string, userId: string, reason?: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId !== userId) {
      throw new ForbiddenException('You can only cancel your own orders');
    }

    // Verificar si se puede cancelar
    if (order.status !== 'PENDING') {
      throw new BadRequestException(
        `Cannot cancel order with status ${order.status}. Only PENDING orders can be cancelled. Please contact support.`,
      );
    }

    // Verificar tiempo límite (ej: 1 hora)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    if (order.createdAt < oneHourAgo) {
      throw new BadRequestException(
        'Order was created more than 1 hour ago. Please contact support to cancel.',
      );
    }

    // Cancelar en transacción
    return this.prisma.$transaction(async (prisma) => {
      // Restituir stock
      for (const item of order.items) {
        if (item.variantId) {
          await prisma.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { increment: item.quantity } },
          });
          await prisma.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        } else {
          await prisma.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }
      }

      // Actualizar estado de la orden
      return prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'CANCELLED',
          adminNotes: reason
            ? `Cancelled by user. Reason: ${reason}`
            : 'Cancelled by user',
        },
      });
    });
  }
}
