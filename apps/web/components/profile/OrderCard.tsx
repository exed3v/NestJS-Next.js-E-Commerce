import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Order } from "@/types";
import { cn } from "@/libs/utils/utils";
import { Button } from "../ui/Button";

const statusStyles: Record<Order["status"], string> = {
  Entregado: "bg-green-500/15 text-green-500 border-green-500/30",
  Procesando: "bg-yellow-500/15 text-yellow-500 border-yellow-500/30",
  Enviado: "bg-blue-500/15 text-blue-500 border-blue-500/30",
  Cancelado: "bg-red-500/15 text-red-500 border-red-500/30",
};

const OrderCard = ({ order }: { order: Order }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-border bg-card transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5">
        <div className="space-y-1">
          <p className="font-semibold text-foreground">{order.id}</p>
          <p className="text-sm text-muted-foreground">{order.date}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className={cn(
              "rounded-md text-xs font-medium",
              statusStyles[order.status],
            )}
          >
            {order.status}
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
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-14 w-14 rounded-lg object-cover"
                  loading="lazy"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.size} · {item.color} · x{item.quantity}
                  </p>
                </div>
                <p className="text-sm font-medium text-foreground">
                  ${item.price.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
