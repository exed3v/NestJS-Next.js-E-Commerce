export interface ProductVariant {
  size: string;
  color: string;
  stock: number;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  variants: ProductVariant[];
}

export interface CartItem {
  product: Product;
  size: string;
  color: string;
  quantity: number;
}

export interface User {
  name: string;
  email: string;
  phone?: string;
  memberSince?: string;
}

export interface Order {
  id: string;
  date: string;
  total: number;
  status: "Entregado" | "Procesando" | "Enviado" | "Cancelado";
  items: {
    name: string;
    quantity: number;
    price: number;
    image?: string;
    size?: string;
    color?: string;
  }[];
}

export interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  zip: string;
  country: string;
  isDefault: boolean;
}
