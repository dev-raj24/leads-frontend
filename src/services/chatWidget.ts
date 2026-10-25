import { callApi } from "@/utils/apiUtils";
import chatWidgetEndpoints from "@/utils/apiUtils/endpoints/chatWidget";
import { ApiEndpoint } from "@/types/api";
import type { ChatConversation, Message } from "@/types/models";

export async function fetchChatConversationsService(): Promise<{ conversations: ChatConversation[] }> {
  return callApi({
    uriEndPoint: { ...chatWidgetEndpoints.conversations.v1 } as ApiEndpoint,
  });
}

export async function replyToChatService(leadId: string, text: string): Promise<{ message: Message }> {
  return callApi({
    uriEndPoint: { ...chatWidgetEndpoints.reply.v1 } as ApiEndpoint,
    pathParams: { leadId },
    body: { text },
  });
}
