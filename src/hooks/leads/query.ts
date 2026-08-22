import { useQuery } from "@tanstack/react-query";
import { fetchLeadsService, fetchLeadService } from "@/services/leads";

export const useLeads = (status?: string) =>
  useQuery({
    queryKey: ["leads", status ?? "all"],
    queryFn: () => fetchLeadsService(status),
  });

export const useLead = (id: string) =>
  useQuery({
    queryKey: ["lead", id],
    queryFn: () => fetchLeadService(id),
    enabled: !!id,
  });
