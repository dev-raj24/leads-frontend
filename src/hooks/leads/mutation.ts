import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLeadStatusService, bulkCreateLeadsService } from "@/services/leads";
import type { Lead } from "@/types/models";

export const useUpdateLeadStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Lead["status"] }) =>
      updateLeadStatusService(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["lead"] });
    },
  });
};

export const useBulkCreateLeads = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (leads: any[]) => bulkCreateLeadsService(leads),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
};
