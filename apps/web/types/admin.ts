export interface AdminProduct {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
  images: string[];
  variants: AdminVariant[];
}

export interface AdminVariant {
  size: string;
  color: string;
  stock: number;
}

export interface AdminOrder {
  id: string;
  date: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  total: number;
  status: AdminOrderStatus;
  items: AdminOrderItem[];
  trackingCode?: string;
  trackingNote?: string;
}

export type AdminOrderStatus =
  | "PENDIENTE"
  | "PROCESANDO"
  | "ENVIADO"
  | "ENTREGADO"
  | "CANCELADO";

export interface AdminOrderItem {
  name: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  image: string;
}

export interface SalesMetric {
  month: string;
  sales: number;
}
