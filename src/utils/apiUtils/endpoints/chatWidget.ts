import defaults from "./defaults";

const chatWidget = {
  conversations: {
    v1: { ...defaults.methods.GET, ...defaults.versions.v1, uri: "/chat-widget/conversations" },
  },
  reply: {
    v1: { ...defaults.methods.POST, ...defaults.versions.v1, uri: "/chat-widget/conversations/:leadId/reply" },
  },
};

export default chatWidget;
