"use client";

import Link from "next/link";
import { useCart } from "@/components/providers/CartProvider";
import CartItemRow from "@/components/cart/CartItemRow";
import { ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

const CartPage = () => {
  const { items, clearCart, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto flex min-h-[50vh] flex-col items-center justify-center px-4 py-16">
        <ShoppingBag className="h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 text-xl font-bold">Tu carrito está vacío</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Explora nuestros productos y añade lo que te guste.
        </p>
        <Link href="/products">
          <Button className="mt-4">Ver productos</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Carrito</h1>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground"
          onClick={clearCart}
        >
          <Trash2 className="h-4 w-4" /> Vaciar carrito
        </Button>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {items.map((item) => (
            <CartItemRow
              key={`${item.productId}-${item.size}-${item.color}`}
              item={item}
            />
          ))}
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-lg font-semibold">Resumen</h3>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Envío</span>
              <span className="text-muted-foreground">Gratis</span>
            </div>
          </div>
          <div className="mt-4 border-t border-border pt-4">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
          </div>
          <Link href="/checkout">
            <Button className="mt-6 w-full" size="lg">
              Proceder al checkout
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
