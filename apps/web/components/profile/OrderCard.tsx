import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/libs/utils/utils";
import { Button } from "../ui/Button";
import { Order } from "@/libs/types";
import Image from "next/image";

const statusStyles: Record<string, string> = {
  DELIVERED: "bg-green-500/15 text-green-500 border-green-500/30",
  PROCESSING: "bg-yellow-500/15 text-yellow-500 border-yellow-500/30",
  SHIPPED: "bg-blue-500/15 text-blue-500 border-blue-500/30",
  CANCELLED: "bg-red-500/15 text-red-500 border-red-500/30",
  PENDING: "bg-orange-500/15 text-orange-500 border-orange-500/30",
  REFUNDED: "bg-purple-500/15 text-purple-500 border-purple-500/30",
};

const statusLabels: Record<string, string> = {
  PENDING: "Pendiente",
  PROCESSING: "Procesando",
  SHIPPED: "Enviado",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
  REFUNDED: "Reembolsado",
};

const OrderCard = ({ order }: { order: Order }) => {
  const [open, setOpen] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="rounded-xl border border-border bg-card transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5">
        <div className="space-y-1">
          <p className="font-semibold text-foreground">{order.orderNumber}</p>
          <p className="text-sm text-muted-foreground">
            {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className={cn(
              "rounded-md text-xs font-medium",
              statusStyles[order.status] || "bg-gray-500/15 text-gray-500",
            )}
          >
            {statusLabels[order.status] || order.status}
          </Badge>
          <span className="font-semibold text-foreground">
            ${order.total.toFixed(2)}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(!open)}
            aria-label="Ver detalles"
          >
            {open ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="border-t border-border px-5 py-4 space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.productName}
                    width={56}
                    height={56}
                    className="h-14 w-14 rounded-lg object-cover"
                  />
                ) : (
                  <div className="h-14 w-14 rounded-lg bg-muted flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">
                      Sin imagen
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {item.productName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.variantInfo?.size && `${item.variantInfo.size} · `}
                    {item.variantInfo?.color && `${item.variantInfo.color} · `}x
                    {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-medium text-foreground">
                  ${item.unitPrice.toFixed(2)}
                </p>
              </div>
            ))}

            {/* Resumen del pedido */}
            <div className="border-t border-border/50 pt-3 mt-3 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              {order.shippingCost > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Envío</span>
                  <span>${order.shippingCost.toFixed(2)}</span>
                </div>
              )}
              {order.tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Impuestos</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
              )}
              {order.trackingNumber && (
                <div className="flex justify-between text-sm pt-2">
                  <span className="text-muted-foreground">Seguimiento</span>
                  <span className="font-mono text-xs">
                    {order.trackingNumber}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
