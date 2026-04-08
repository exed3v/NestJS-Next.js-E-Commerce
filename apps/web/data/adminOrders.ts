import { AdminOrder } from "@/types/admin";

const STORAGE_KEY = "noirstore-admin-orders";

const defaultOrders: AdminOrder[] = [
  {
    id: "ORD-2025-001",
    date: "2025-03-15",
    customerName: "María López",
    customerEmail: "maria@example.com",
    shippingAddress: "Calle Mayor 12, Madrid, 28001",
    total: 129.98,
    status: "ENTREGADO",
    trackingCode: "TRK123456789",
    trackingNote: "Entregado en mano",
    items: [
      {
        name: "Camiseta Básica Blanca",
        size: "M",
        color: "Blanco",
        quantity: 2,
        price: 29.99,
        image:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop",
      },
      {
        name: "Jeans Rectos Azul",
        size: "L",
        color: "Azul",
        quantity: 1,
        price: 69.99,
        image:
          "https://images.unsplash.com/photo-1542272604-787c3835535d?w=100&h=100&fit=crop",
      },
    ],
  },
  {
    id: "ORD-2025-002",
    date: "2025-03-28",
    customerName: "Carlos Ruiz",
    customerEmail: "carlos@example.com",
    shippingAddress: "Av. Diagonal 450, Barcelona, 08006",
    total: 189.99,
    status: "ENVIADO",
    trackingCode: "TRK123456789",
    trackingNote: "",
    items: [
      {
        name: "Chaqueta de Cuero",
        size: "L",
        color: "Negro",
        quantity: 1,
        price: 189.99,
        image:
          "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=100&h=100&fit=crop",
      },
    ],
  },
  {
    id: "ORD-2025-003",
    date: "2025-04-02",
    customerName: "Ana García",
    customerEmail: "ana@example.com",
    shippingAddress: "Calle Larios 5, Málaga, 29005",
    total: 124.98,
    status: "PROCESANDO",
    items: [
      {
        name: "Camiseta Oversize Gris",
        size: "M",
        color: "Gris",
        quantity: 1,
        price: 34.99,
        image:
          "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=100&h=100&fit=crop",
      },
      {
        name: "Zapatillas Urbanas",
        size: "M",
        color: "Blanco",
        quantity: 1,
        price: 89.99,
        image:
          "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100&h=100&fit=crop",
      },
    ],
  },
  {
    id: "ORD-2025-004",
    date: "2025-04-05",
    customerName: "Pedro Martín",
    customerEmail: "pedro@example.com",
    shippingAddress: "Gran Vía 30, Madrid, 28013",
    total: 59.99,
    status: "PENDIENTE",
    items: [
      {
        name: "Pantalón Slim Fit Negro",
        size: "M",
        color: "Negro",
        quantity: 1,
        price: 59.99,
        image:
          "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=100&h=100&fit=crop",
      },
    ],
  },
  {
    id: "ORD-2025-005",
    date: "2025-03-10",
    customerName: "Laura Fernández",
    customerEmail: "laura@example.com",
    shippingAddress: "Paseo de Gracia 15, Barcelona, 08007",
    total: 149.99,
    status: "CANCELADO",
    items: [
      {
        name: "Botas Chelsea Negras",
        size: "M",
        color: "Negro",
        quantity: 1,
        price: 149.99,
        image:
          "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=100&h=100&fit=crop",
      },
    ],
  },
];

export const getAdminOrders = (): AdminOrder[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : defaultOrders;
  } catch {
    return defaultOrders;
  }
};

export const saveAdminOrders = (list: AdminOrder[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
};
