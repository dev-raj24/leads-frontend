import defaults from "./defaults";

const leads = {
  list: {
    v1: { ...defaults.methods.GET, ...defaults.versions.v1, uri: "/leads" },
  },
  get: {
    v1: { ...defaults.methods.GET, ...defaults.versions.v1, uri: "/leads/:id" },
  },
  updateStatus: {
    v1: { ...defaults.methods.PATCH, ...defaults.versions.v1, uri: "/leads/:id" },
  },
  aiReply: {
    v1: { ...defaults.methods.POST, ...defaults.versions.v1, uri: "/leads/:id/ai-reply" },
  },
  template: {
    v1: { ...defaults.methods.GET, ...defaults.versions.v1, uri: "/leads/template" },
  },
  uploadPreview: {
    v1: { ...defaults.methods.POST, ...defaults.versions.v1, uri: "/leads/upload-preview" },
  },
  bulk: {
    v1: { ...defaults.methods.POST, ...defaults.versions.v1, uri: "/leads/bulk" },
  },
};

export default leads;
