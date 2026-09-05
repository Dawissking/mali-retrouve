import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/axios";
import type { Center, Agent } from "../types/center";

export function useCenters() {
  return useQuery({
    queryKey: ["centers"],
    queryFn: async () => {
      const { data } = await api.get<{ data: Center[] }>("/centers");
      return data.data;
    },
  });
}

export function useCenter(id: string) {
  return useQuery({
    queryKey: ["centers", id],
    queryFn: async () => {
      const { data } = await api.get<Center>(`/centers/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCenterAgents(centerId: string) {
  return useQuery({
    queryKey: ["centers", centerId, "agents"],
    queryFn: async () => {
      const { data } = await api.get<{ data: Agent[] }>(`/centers/${centerId}/agents`);
      return data.data;
    },
    enabled: !!centerId,
  });
}

export function useCreateCenter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Omit<Center, "id">) => {
      const { data } = await api.post<Center>("/centers", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["centers"] });
    },
  });
}

export function useCreateAgent(centerId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { email: string; password: string; role: string; employeeId?: string }) => {
      const { data } = await api.post<Agent>(`/centers/${centerId}/agents`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["centers", centerId, "agents"] });
    },
  });
}
