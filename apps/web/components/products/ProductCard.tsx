"use client";

import Link from "next/link";
import { Product } from "@/types";
import { useCart } from "@/components/providers/CartProvider";
import { Button } from "../ui/Button";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    const firstVariant = product.variants[0];
    if (firstVariant) {
      addItem(
        product.id.toString(),
        product.name,
        product.price,
        firstVariant.size,
        firstVariant.color,
        1,
        product.image,
      );
    }
  };

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="overflow-hidden rounded-lg bg-card">
        <div className="aspect-[3/4] overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="p-4">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            {product.category}
          </p>
          <h3 className="mt-1 text-sm font-medium text-foreground">
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
            >
              Añadir
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
