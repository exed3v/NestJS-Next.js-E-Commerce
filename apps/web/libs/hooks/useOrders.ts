import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersApi } from "../api/orders";

const ordersKeys = {
  all: ["orders"] as const,
  list: () => [...ordersKeys.all, "list"] as const,
  detail: (id: string) => [...ordersKeys.all, "detail", id] as const,
};

export function useMyOrders() {
  return useQuery({
    queryKey: ordersKeys.list(),
    queryFn: ordersApi.getMyOrders,
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ordersKeys.detail(id),
    queryFn: () => ordersApi.getOrderById(id),
    enabled: !!id,
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ordersApi.cancelOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ordersKeys.list() });
    },
  });
}
