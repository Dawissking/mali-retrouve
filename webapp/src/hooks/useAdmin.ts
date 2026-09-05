import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/axios";
import type { AdminStats, Policy, Incident, AuditLog } from "../types/admin";

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const { data } = await api.get<AdminStats>("/admin/stats");
      return data;
    },
  });
}

export function usePolicies() {
  return useQuery({
    queryKey: ["policies"],
    queryFn: async () => {
      const { data } = await api.get<{ data: Policy[] }>("/admin/policies");
      return data.data;
    },
  });
}

export function useUpdatePolicy() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const { data } = await api.patch<Policy>(`/admin/policies/${key}`, { value });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["policies"] });
    },
  });
}

export function useIncidents() {
  return useQuery({
    queryKey: ["incidents"],
    queryFn: async () => {
      const { data } = await api.get<{ data: Incident[] }>("/admin/incidents");
      return data.data;
    },
  });
}

export function useCreateIncident() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { severity: string; type: string; title: string; description: string }) => {
      const { data } = await api.post<Incident>("/admin/incidents", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incidents"] });
    },
  });
}

export function useAuditLogs(filters?: { action?: string; entityType?: string; entityId?: string; actorId?: string; from?: string; to?: string; limit?: number; offset?: number }) {
  return useQuery({
    queryKey: ["audit", filters],
    queryFn: async () => {
      const { data } = await api.get<{ data: AuditLog[] }>("/audit", { params: filters });
      return data.data;
    },
  });
}

export function useAuditTrail(declarationId: string) {
  return useQuery({
    queryKey: ["audit", "declaration", declarationId],
    queryFn: async () => {
      const { data } = await api.get<AuditLog[]>(`/audit/declaration/${declarationId}`);
      return data;
    },
    enabled: !!declarationId,
  });
}
