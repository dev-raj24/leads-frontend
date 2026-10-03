import { useQuery } from "@tanstack/react-query";
import { fetchChatConversationsService } from "@/services/chatWidget";
import { fetchLeadService } from "@/services/leads";

export const useChatConversations = () =>
  useQuery({
    queryKey: ["chat-conversations"],
    queryFn: fetchChatConversationsService,
    refetchInterval: 8000,
  });

export const useChatThread = (leadId: string) =>
  useQuery({
    queryKey: ["chat-thread", leadId],
    queryFn: () => fetchLeadService(leadId),
    enabled: !!leadId,
    refetchInterval: 4000,
  });
