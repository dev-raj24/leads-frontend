import defaults from "./defaults";

const chat = {
  send: {
    v1: { ...defaults.methods.POST, ...defaults.versions.v1, uri: "/chat" },
  },
};

export default chat;
