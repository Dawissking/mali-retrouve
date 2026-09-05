import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/axios";
import type { Match } from "../types/match";

export function useMatches() {
  return useQuery({
    queryKey: ["matches"],
    queryFn: async () => {
      const { data } = await api.get<{ data: Match[] }>("/matches");
      return data.data;
    },
  });
}

export function useAcceptMatch(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post<{ message: string }>(`/matches/${id}/accept`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matches"] });
    },
  });
}

export function useRejectMatch(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post<{ message: string }>(`/matches/${id}/reject`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matches"] });
    },
  });
}

export function useAgentMatchQueue() {
  return useQuery({
    queryKey: ["agent-matches"],
    queryFn: async () => {
      const { data } = await api.get<{ data: Match[] }>("/matches/agent/queue");
      return data.data;
    },
  });
}

export function useAgentMatchDetail(id: string) {
  return useQuery({
    queryKey: ["agent-matches", id],
    queryFn: async () => {
      const { data } = await api.get<Match>(`/matches/agent/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useValidateMatch(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ decision, reason }: { decision: "VALIDATED" | "REJECTED"; reason?: string }) => {
      const { data } = await api.post<{ message: string }>(`/matches/agent/${id}/validate`, { decision, reason });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agent-matches"] });
      queryClient.invalidateQueries({ queryKey: ["agent-matches", id] });
    },
  });
}
