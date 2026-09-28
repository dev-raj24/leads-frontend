import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  approveFollowupService,
  cancelFollowupService,
  createFollowupService,
  draftFollowupService,
  markFollowupSentService,
  sendFollowupEmailService,
} from "@/services/followups";

const useRefreshing = <TVars, TResult>(fn: (vars: TVars) => Promise<TResult>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["followups"] }),
  });
};

export const useCreateFollowup = () =>
  useRefreshing(({ leadId, runAt }: { leadId: string; runAt: string }) => createFollowupService(leadId, runAt));

export const useApproveFollowup = () =>
  useRefreshing(({ id, template }: { id: string; template?: string }) => approveFollowupService(id, template));

export const useCancelFollowup = () => useRefreshing((id: string) => cancelFollowupService(id));

export const useMarkFollowupSent = () =>
  useRefreshing(({ id, template }: { id: string; template?: string }) => markFollowupSentService(id, template));

export const useDraftFollowup = () => useMutation({ mutationFn: (id: string) => draftFollowupService(id) });

export const useSendFollowupEmail = () =>
  useRefreshing(({ id, template }: { id: string; template?: string }) => sendFollowupEmailService(id, template));
