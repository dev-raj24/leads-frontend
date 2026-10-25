import { callApi } from "@/utils/apiUtils";
import chatEndpoints from "@/utils/apiUtils/endpoints/chat";
import { ApiEndpoint } from "@/types/api";

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export async function sendChatService(messages: ChatTurn[]): Promise<{ reply: string }> {
  return callApi({
    uriEndPoint: { ...chatEndpoints.send.v1 } as ApiEndpoint,
    body: { messages },
  });
}
