"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import Image from "next/image";
import { useCart } from "@/components/providers/CartProvider";
import { Minus, Plus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Product } from "@/libs/types";

interface ProductDetailClientProps {
  product: Product;
}

const ProductDetail = ({ product }: ProductDetailClientProps) => {
  const { addItem } = useCart();

  // Imagen principal
  const mainImage =
    product.images?.find((img) => img.isMain)?.url ||
    product.images?.[0]?.url ||
    "/placeholder.png";

  // Categoría
  const categoryName = product.category?.name || "Sin categoría";

  // Variantes por tipo
  const sizeVariants = product.variants?.filter((v) => v.type === "size") || [];
  const colorVariants =
    product.variants?.filter((v) => v.type === "color") || [];

  const availableSizes = [...new Set(sizeVariants.map((v) => v.value))];
  const availableColors = [...new Set(colorVariants.map((v) => v.value))];

  const [selectedSize, setSelectedSize] = useState(availableSizes[0] || "");
  const [selectedColor, setSelectedColor] = useState(availableColors[0] || "");
  const [quantity, setQuantity] = useState(1);

  // Encontrar la variante seleccionada (combinación de size y color)
  const selectedVariant = useMemo(() => {
    if (!selectedSize && !selectedColor) return null;

    return product.variants?.find((v) => {
      const sizeMatch = selectedSize
        ? v.type === "size" && v.value === selectedSize
        : true;
      const colorMatch = selectedColor
        ? v.type === "color" && v.value === selectedColor
        : true;
      return sizeMatch && colorMatch;
    });
  }, [product, selectedSize, selectedColor]);

  // Stock de la variante seleccionada
  const variantStock = selectedVariant?.stock ?? product.stock;

  const handleAdd = () => {
    // Obtener el variantId si existe una variante seleccionada
    const variantId = selectedVariant?.id;

    addItem(product.id, product.name, product.price, variantId, quantity);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/products"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Volver
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="aspect-[3/4] overflow-hidden rounded-lg bg-muted relative">
          <Image
            src={mainImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            {categoryName}
          </p>
          <h1 className="mt-1 text-3xl font-bold">{product.name}</h1>
          <p className="mt-2 text-2xl font-semibold">
            ${product.price.toFixed(2)}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {product.description || "Sin descripción"}
          </p>

          {/* Tallas */}
          {availableSizes.length > 0 && (
            <div className="mt-6">
              <label className="text-sm font-medium">Talla</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`rounded-md border px-4 py-2 text-sm transition-colors ${
                      selectedSize === size
                        ? "border-foreground bg-foreground text-background"
                        : "border-border text-muted-foreground hover:border-foreground"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colores */}
          {availableColors.length > 0 && (
            <div className="mt-4">
              <label className="text-sm font-medium">Color</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {availableColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`rounded-md border px-4 py-2 text-sm transition-colors ${
                      selectedColor === color
                        ? "border-foreground bg-foreground text-background"
                        : "border-border text-muted-foreground hover:border-foreground"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock */}
          <p className="mt-3 text-xs text-muted-foreground">
            Stock disponible: {variantStock} unidades
          </p>

          {/* Cantidad */}
          <div className="mt-4">
            <label className="text-sm font-medium">Cantidad</label>
            <div className="mt-2 flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                aria-label="Menos"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9"
                onClick={() =>
                  setQuantity(Math.min(variantStock, quantity + 1))
                }
                aria-label="Más"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Button
            className="mt-6 w-full"
            size="lg"
            onClick={handleAdd}
            disabled={variantStock === 0}
          >
            {variantStock > 0 ? "Añadir al carrito" : "Agotado"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
