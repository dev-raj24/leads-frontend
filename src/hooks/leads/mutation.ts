import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLeadStatusService, bulkCreateLeadsService, draftLeadReplyService } from "@/services/leads";
import type { Lead, LeadImportRow } from "@/types/models";

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
    mutationFn: (leads: LeadImportRow["data"][]) => bulkCreateLeadsService(leads),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
};

export const useDraftLeadReply = () =>
  useMutation({ mutationFn: (id: string) => draftLeadReplyService(id) });
