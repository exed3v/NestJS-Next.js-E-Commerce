"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { Button } from "../ui/Button";

interface CartItemRowProps {
  item: {
    productId: string;
    productName: string;
    price: number;
    size: string;
    color: string;
    quantity: number;
    image?: string;
  };
}

const CartItemRow = ({ item }: CartItemRowProps) => {
  const { updateQuantity, removeItem } = useCart();
  const { productId, productName, price, size, color, quantity, image } = item;

  return (
    <div className="flex gap-4 border-b border-border py-4">
      <img
        src={image || "/placeholder-image.jpg"}
        alt={productName}
        className="h-24 w-20 rounded-md object-cover"
      />
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <h4 className="text-sm font-medium">{productName}</h4>
          <p className="text-xs text-muted-foreground">
            {size} / {color}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => updateQuantity(productId, size, color, quantity - 1)}
              aria-label="Reducir cantidad"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-6 text-center text-sm">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => updateQuantity(productId, size, color, Math.min(quantity + 1, 10))}
              aria-label="Aumentar cantidad"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">${(price * quantity).toFixed(2)}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
              onClick={() => removeItem(productId, size, color)}
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