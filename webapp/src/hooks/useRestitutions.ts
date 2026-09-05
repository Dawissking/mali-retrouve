import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/axios";
import type { Restitution } from "../types/restitution";

export function useRestitutions() {
  return useQuery({
    queryKey: ["restitutions"],
    queryFn: async () => {
      const { data } = await api.get<{ data: Restitution[] }>("/restitutions");
      return data.data;
    },
  });
}

export function useCreateRestitution() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { declarationId: string; matchId?: string; plannedAt?: string }) => {
      const { data } = await api.post<Restitution>("/restitutions", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restitutions"] });
    },
  });
}

export function useCompleteRestitution(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { signatureProof?: string; signatureType?: string; notes?: string; otpVerified?: boolean }) => {
      const { data } = await api.post<{ message: string }>(`/restitutions/${id}/complete`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restitutions"] });
    },
  });
}
