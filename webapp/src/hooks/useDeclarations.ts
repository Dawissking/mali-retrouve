import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/axios";
import type { CreateDeclarationPayload, Declaration, Nature } from "../types/declaration";

export function useDeclarations() {
  return useQuery({
    queryKey: ["declarations"],
    queryFn: async () => {
      const { data } = await api.get<{ data: Declaration[]; limit: number; offset: number }>("/declarations");
      return data.data;
    },
  });
}

export function useDeclaration(id: string) {
  return useQuery({
    queryKey: ["declarations", id],
    queryFn: async () => {
      const { data } = await api.get<Declaration>(`/declarations/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateDeclaration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateDeclarationPayload) => {
      const { data } = await api.post<{ id: string; status: string; trackingNumber?: string }>("/declarations", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["declarations"] });
    },
  });
}

export function useUpdateDeclaration(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<CreateDeclarationPayload>) => {
      const { data } = await api.patch<{ message: string }>(`/declarations/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["declarations"] });
      queryClient.invalidateQueries({ queryKey: ["declarations", id] });
    },
  });
}

export function useDeclareTransition(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ event, reason }: { event: string; reason?: string }) => {
      const { data } = await api.post<{ declaration: Declaration; transitionedTo: string }>(`/declarations/${id}/transition`, { event, reason: reason ?? "" });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["declarations"] });
      queryClient.invalidateQueries({ queryKey: ["declarations", id] });
    },
  });
}
