import { Order } from "@/types";

export const mockOrders: Order[] = [
  {
    id: "ORD-001",
    date: "15/03/2025",
    total: 89.99,
    status: "Entregado",
    items: [
      {
        name: "Camiseta Básica Blanca",
        quantity: 2,
        price: 29.99,
        image:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop",
        size: "M",
        color: "Blanco",
      },
    ],
  },
  {
    id: "ORD-002",
    date: "20/02/2025",
    total: 149.99,
    status: "Entregado",
    items: [
      {
        name: "Chaqueta de Cuero",
        quantity: 1,
        price: 149.99,
        image:
          "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=100&h=100&fit=crop",
        size: "L",
        color: "Negro",
      },
    ],
  },
  {
    id: "ORD-003",
    date: "05/04/2025",
    total: 59.99,
    status: "Procesando",
    items: [
      {
        name: "Pantalón Slim Fit Negro",
        quantity: 1,
        price: 59.99,
        image:
          "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=100&h=100&fit=crop",
        size: "M",
        color: "Negro",
      },
    ],
  },
];
