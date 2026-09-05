import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/axios";
import type { Category, Domain, ItemType, Zone } from "../types/catalog";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await api.get<Category[]>("/catalog/categories");
      return data;
    },
  });
}

export function useDomains(categoryCode?: string) {
  return useQuery({
    queryKey: ["domains", categoryCode],
    queryFn: async () => {
      const { data } = await api.get<Domain[]>("/catalog/domains", {
        params: categoryCode ? { category: categoryCode } : undefined,
      });
      return data;
    },
    enabled: !!categoryCode,
  });
}

export function useTypes(domainCode?: string, nature?: string) {
  return useQuery({
    queryKey: ["types", domainCode, nature],
    queryFn: async () => {
      const { data } = await api.get<ItemType[]>("/catalog/types", {
        params: { domain: domainCode, nature },
      });
      return data;
    },
    enabled: !!domainCode,
  });
}

export function useZones() {
  return useQuery({
    queryKey: ["zones"],
    queryFn: async () => {
      const { data } = await api.get<Zone[]>("/catalog/zones");
      return data;
    },
  });
}
