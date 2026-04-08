import { fetchClient } from "./client";
import { Order } from "../types";

export const ordersApi = {
  // Usuario autenticado
  getMyOrders: (): Promise<Order[]> => fetchClient("/orders"),

  getOrderById: (id: string): Promise<Order> => fetchClient(`/orders/${id}`),

  cancelOrder: (id: string): Promise<Order> =>
    fetchClient(`/orders/${id}/cancel`, { method: "PATCH" }),
};
