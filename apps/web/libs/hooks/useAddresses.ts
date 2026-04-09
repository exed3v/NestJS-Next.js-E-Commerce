import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addressesApi } from "../api/addresses";
import { AddressInput } from "../types";

const addressesKeys = {
  all: ["addresses"] as const,
  list: () => [...addressesKeys.all, "list"] as const,
  detail: (id: string) => [...addressesKeys.all, "detail", id] as const,
};

export function useAddresses() {
  return useQuery({
    queryKey: addressesKeys.list(),
    queryFn: addressesApi.getAll,
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addressesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressesKeys.list() });
    },
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AddressInput> }) =>
      addressesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressesKeys.list() });
    },
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addressesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressesKeys.list() });
    },
  });
}
