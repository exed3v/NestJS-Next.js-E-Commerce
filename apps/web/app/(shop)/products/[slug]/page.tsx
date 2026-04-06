"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useMemo } from "react";
import { products } from "@/data/products";
import { useCart } from "@/components/providers/CartProvider";
import { Minus, Plus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import ProductCard from "@/components/products/ProductCard";

const ProductDetailPage = () => {
  const params = useParams();
  const slug = params.slug as string;
  const product = products.find((p) => p.id === Number(slug));
  const { addItem } = useCart();

  const availableSizes = useMemo(() => {
    if (!product) return [];
    return [...new Set(product.variants.map((v) => v.size))];
  }, [product]);

  const [selectedSize, setSelectedSize] = useState(availableSizes[0] || "");

  const availableColors = useMemo(() => {
    if (!product) return [];
    return [...new Set(product.variants.filter((v) => v.size === selectedSize).map((v) => v.color))];
  }, [product, selectedSize]);

  const [selectedColor, setSelectedColor] = useState(availableColors[0] || "");
  const [quantity, setQuantity] = useState(1);

  const colorsForSize = useMemo(() => {
    if (!product) return [];
    return [...new Set(product.variants.filter((v) => v.size === selectedSize).map((v) => v.color))];
  }, [product, selectedSize]);

  const currentVariant = product?.variants.find(
    (v) => v.size === selectedSize && v.color === (colorsForSize.includes(selectedColor) ? selectedColor : colorsForSize[0])
  );

  const effectiveColor = colorsForSize.includes(selectedColor) ? selectedColor : colorsForSize[0] || "";

  const similar = product ? products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4) : [];

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">Producto no encontrado.</p>
        <Link href="/products">
          <Button variant="outline" className="mt-4">Volver a productos</Button>
        </Link>
      </div>
    );
  }

  const handleAdd = () => {
    addItem(
      product.id.toString(),
      product.name,
      product.price,
      selectedSize,
      effectiveColor,
      quantity,
      product.image
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/products" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Volver
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="aspect-[3/4] overflow-hidden rounded-lg">
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{product.category}</p>
          <h1 className="mt-1 text-3xl font-bold">{product.name}</h1>
          <p className="mt-2 text-2xl font-semibold">${product.price.toFixed(2)}</p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

          {/* Size */}
          <div className="mt-6">
            <label className="text-sm font-medium">Talla</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {availableSizes.map((s) => (
                <button
                  key={s}
                  onClick={() => { setSelectedSize(s); setQuantity(1); }}
                  className={`rounded-md border px-4 py-2 text-sm transition-colors ${
                    selectedSize === s
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-muted-foreground hover:border-foreground"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div className="mt-4">
            <label className="text-sm font-medium">Color</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {colorsForSize.map((c) => (
                <button
                  key={c}
                  onClick={() => { setSelectedColor(c); setQuantity(1); }}
                  className={`rounded-md border px-4 py-2 text-sm transition-colors ${
                    effectiveColor === c
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-muted-foreground hover:border-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Stock */}
          <p className="mt-3 text-xs text-muted-foreground">
            Stock disponible: {currentVariant?.stock ?? 0} unidades
          </p>

          {/* Quantity */}
          <div className="mt-4">
            <label className="text-sm font-medium">Cantidad</label>
            <div className="mt-2 flex items-center gap-3">
              <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Menos">
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setQuantity(Math.min(10, quantity + 1))} aria-label="Más">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Button className="mt-6 w-full" size="lg" onClick={handleAdd} disabled={!currentVariant || currentVariant.stock === 0}>
            Añadir al carrito
          </Button>
        </div>
      </div>

      {/* Similar products */}
      {similar.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold">Productos similares</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {similar.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetailPage;