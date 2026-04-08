export interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
  isMain: boolean;
  order: number;
}

export interface ProductVariant {
  id: string;
  type: string;
  value: string;
  price: number | null;
  stock: number;
  sku: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  parentId: string | null;
  children?: Category[];
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compareAtPrice: number | null;
  costPerItem: number | null;
  stock: number;
  sku: string | null;
  barcode: string | null;
  isActive: boolean;
  isFeatured: boolean;
  weight: number | null;
  categoryId: string | null;
  category?: Category;
  images: ProductImage[];
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}
