import { useMutation } from "@tanstack/react-query";
import { sendChatService, type ChatTurn } from "@/services/chat";

export const useSendChat = () =>
  useMutation({ mutationFn: (messages: ChatTurn[]) => sendChatService(messages) });
