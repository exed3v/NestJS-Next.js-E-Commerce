import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "../api/users";
import { UpdateUserInput } from "../types";

export function useUpdateMe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserInput) => usersApi.updateMe(data),
    onSuccess: (data) => {
      queryClient.setQueryData(["auth", "me"], data); // ✅ Directo
    },
  });
}

export function useDeleteMe() {
  return useMutation({
    mutationFn: () => usersApi.deleteMe(),
  });
}
