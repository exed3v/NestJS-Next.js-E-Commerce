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
  productName: string;
  productSku: string | null;
  variantInfo: Record<string, any> | null;
  unitPrice: number;
  quantity: number;
  total: number;
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
