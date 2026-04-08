import { Address } from "./address";

export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";

export type PaymentMethod =
  | "CARD"
  | "PAYPAL"
  | "BANK_TRANSFER"
  | "CASH_ON_DELIVERY";

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId: string | null;
  productName: string; // ✅ Para item.name
  productSku: string | null;
  variantInfo: {
    size?: string; // ✅ Para item.size
    color?: string; // ✅ Para item.color
  } | null;
  unitPrice: number; // ✅ Para item.price
  quantity: number;
  total: number;

  // Campos adicionales para el frontend
  image?: string; // ✅ Imagen del producto (se puede agregar desde el backend)
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  total: number;
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  shippingAddressId: string | null;
  billingAddressId: string | null;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentId: string | null;
  trackingNumber: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  notes: string | null;
  adminNotes: string | null;
  shippingAddress?: Address;
  billingAddress?: Address;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}
export interface CheckoutInput {
  shippingAddressId: string;
  billingAddressId?: string;
  paymentMethod: PaymentMethod;
  notes?: string;
}
