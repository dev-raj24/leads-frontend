import { useMutation, useQueryClient } from "@tanstack/react-query";
import { replyToChatService } from "@/services/chatWidget";

export const useReplyToChat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ leadId, text }: { leadId: string; text: string }) => replyToChatService(leadId, text),
    onSuccess: (_data, { leadId }) => {
      queryClient.invalidateQueries({ queryKey: ["chat-thread", leadId] });
      queryClient.invalidateQueries({ queryKey: ["chat-conversations"] });
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
};
