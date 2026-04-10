"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { Button } from "../ui/Button";
import { CartItem } from "@/libs/types";

interface CartItemRowProps {
  item: CartItem;
}

const CartItemRow = ({ item }: CartItemRowProps) => {
  const { updateQuantity, removeItem } = useCart();

  const productName = item.product.name;
  const price = item.unitPrice;
  const quantity = item.quantity;
  const image = item.product.images?.[0]?.url || "/placeholder.png";

  // Extraer talla y color de la variante
  const size = item.variant?.type === "size" ? item.variant.value : null;
  const color = item.variant?.type === "color" ? item.variant.value : null;

  return (
    <div className="flex gap-4 border-b border-border py-4">
      <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
        <Image
          src={image}
          alt={productName}
          fill
          sizes="80px"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <h4 className="text-sm font-medium">{productName}</h4>
          {(size || color) && (
            <p className="text-xs text-muted-foreground">
              {size && `${size}`}
              {size && color && " / "}
              {color && `${color}`}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => updateQuantity(item.id, quantity - 1)}
              aria-label="Reducir cantidad"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-6 text-center text-sm">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => updateQuantity(item.id, quantity + 1)}
              aria-label="Aumentar cantidad"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">
              ${(price * quantity).toFixed(2)}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
              onClick={() => removeItem(item.id)}
              aria-label="Eliminar"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItemRow;
