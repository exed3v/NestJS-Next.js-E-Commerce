"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/libs/types";
import { useCart } from "@/components/providers/CartProvider";
import { Button } from "../ui/Button";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();

  // Obtener imagen principal
  const mainImage =
    product.images?.find((img) => img.isMain)?.url ||
    product.images?.[0]?.url ||
    "/placeholder.png";

  // Obtener nombre de categoría
  const categoryName = product.category?.name || "Sin categoría";

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    const firstVariant = product.variants?.[0];
    addItem(product.id, product.name, product.price, firstVariant?.id, 1);
  };

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="overflow-hidden rounded-lg bg-card">
        <div className="aspect-[3/4] overflow-hidden bg-muted relative">
          <Image
            src={mainImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            {categoryName}
          </p>
          <h3 className="mt-1 text-sm font-medium text-foreground line-clamp-1">
            {product.name}
          </h3>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">
              ${product.price.toFixed(2)}
            </span>
            <Button
              size="sm"
              variant="secondary"
              onClick={handleQuickAdd}
              className="text-xs"
              disabled={product.stock === 0}
            >
              {product.stock > 0 ? "Añadir" : "Agotado"}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
