"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import OrderCard from "./OrderCard";
import { Button } from "../ui/Button";
import { useMyOrders } from "@/libs/hooks/useOrders";

const ProfileOrders = () => {
  const { data: orders, isLoading, error } = useMyOrders();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-muted-foreground">Cargando órdenes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-destructive mb-2">Error al cargar las órdenes</p>
        <p className="text-sm text-muted-foreground">
          Intenta recargar la página
        </p>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground/40 mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-1">
          No tienes órdenes aún
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Explora nuestra tienda y encuentra lo que buscas.
        </p>
        <Button asChild>
          <Link href="/products">Ver productos</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">Mis órdenes</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
};

export default ProfileOrders;
