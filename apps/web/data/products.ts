import { Address, Product } from "@/types";

export const categories = ["Camisetas", "Pantalones", "Chaquetas", "Zapatos"];

export const products: Product[] = [
  {
    id: 1,
    name: "Camiseta Básica Blanca",
    price: 29.99,
    description:
      "Camiseta de algodón orgánico con corte regular. Perfecta para el día a día, suave al tacto y con un ajuste cómodo que se adapta a cualquier estilo.",
    category: "Camisetas",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=700&fit=crop",
    variants: [
      { size: "S", color: "Blanco", stock: 10 },
      { size: "M", color: "Blanco", stock: 5 },
      { size: "L", color: "Blanco", stock: 8 },
      { size: "XL", color: "Blanco", stock: 3 },
      { size: "S", color: "Negro", stock: 7 },
      { size: "M", color: "Negro", stock: 12 },
    ],
  },
  {
    id: 2,
    name: "Pantalón Slim Fit Negro",
    price: 59.99,
    description:
      "Pantalón slim fit con tejido elástico para mayor comodidad. Ideal para looks casuales y formales. Cintura media con cierre de botón.",
    category: "Pantalones",
    image:
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=700&fit=crop",
    variants: [
      { size: "S", color: "Negro", stock: 6 },
      { size: "M", color: "Negro", stock: 4 },
      { size: "L", color: "Negro", stock: 9 },
      { size: "XL", color: "Negro", stock: 2 },
      { size: "M", color: "Gris", stock: 5 },
      { size: "L", color: "Gris", stock: 3 },
    ],
  },
  {
    id: 3,
    name: "Chaqueta de Cuero",
    price: 189.99,
    description:
      "Chaqueta de cuero sintético premium con forro interior. Diseño clásico con cierre frontal y bolsillos laterales. Un básico atemporal.",
    category: "Chaquetas",
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=700&fit=crop",
    variants: [
      { size: "S", color: "Negro", stock: 3 },
      { size: "M", color: "Negro", stock: 5 },
      { size: "L", color: "Negro", stock: 4 },
      { size: "XL", color: "Negro", stock: 1 },
      { size: "M", color: "Marrón", stock: 2 },
      { size: "L", color: "Marrón", stock: 3 },
    ],
  },
  {
    id: 4,
    name: "Zapatillas Urbanas",
    price: 89.99,
    description:
      "Zapatillas urbanas con suela de goma y parte superior de lona. Diseño minimalista perfecto para completar cualquier outfit casual.",
    category: "Zapatos",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=700&fit=crop",
    variants: [
      { size: "S", color: "Blanco", stock: 8 },
      { size: "M", color: "Blanco", stock: 6 },
      { size: "L", color: "Blanco", stock: 4 },
      { size: "S", color: "Negro", stock: 5 },
      { size: "M", color: "Negro", stock: 7 },
    ],
  },
  {
    id: 5,
    name: "Camiseta Oversize Gris",
    price: 34.99,
    description:
      "Camiseta oversize en algodón premium. Corte holgado y moderno con acabados de alta calidad. Perfecta para un look streetwear.",
    category: "Camisetas",
    image:
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=700&fit=crop",
    variants: [
      { size: "S", color: "Gris", stock: 12 },
      { size: "M", color: "Gris", stock: 8 },
      { size: "L", color: "Gris", stock: 6 },
      { size: "XL", color: "Gris", stock: 4 },
    ],
  },
  {
    id: 6,
    name: "Jeans Rectos Azul",
    price: 69.99,
    description:
      "Jeans de corte recto en denim de alta calidad. Lavado medio con ligero desgaste para un look casual y contemporáneo.",
    category: "Pantalones",
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=700&fit=crop",
    variants: [
      { size: "S", color: "Azul", stock: 7 },
      { size: "M", color: "Azul", stock: 10 },
      { size: "L", color: "Azul", stock: 5 },
      { size: "XL", color: "Azul", stock: 3 },
    ],
  },
  {
    id: 7,
    name: "Bomber Jacket Verde",
    price: 129.99,
    description:
      "Bomber jacket con tejido resistente al agua. Interior acolchado para mayor calidez. Puños y cintura elásticos para un ajuste perfecto.",
    category: "Chaquetas",
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=700&fit=crop",
    variants: [
      { size: "S", color: "Verde", stock: 4 },
      { size: "M", color: "Verde", stock: 6 },
      { size: "L", color: "Verde", stock: 3 },
      { size: "XL", color: "Verde", stock: 2 },
      { size: "M", color: "Negro", stock: 5 },
    ],
  },
  {
    id: 8,
    name: "Botas Chelsea Negras",
    price: 149.99,
    description:
      "Botas Chelsea en cuero sintético de alta calidad. Suela robusta y elásticos laterales para fácil calce. Elegantes y versátiles.",
    category: "Zapatos",
    image:
      "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=600&h=700&fit=crop",
    variants: [
      { size: "S", color: "Negro", stock: 5 },
      { size: "M", color: "Negro", stock: 8 },
      { size: "L", color: "Negro", stock: 4 },
      { size: "XL", color: "Negro", stock: 2 },
      { size: "M", color: "Marrón", stock: 3 },
    ],
  },
];
