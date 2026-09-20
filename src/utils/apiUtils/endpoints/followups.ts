import defaults from "./defaults";

const followups = {
  list: {
    v1: { ...defaults.methods.GET, ...defaults.versions.v1, uri: "/followups" },
  },
  create: {
    v1: { ...defaults.methods.POST, ...defaults.versions.v1, uri: "/leads/:leadId/followups" },
  },
  approve: {
    v1: { ...defaults.methods.POST, ...defaults.versions.v1, uri: "/followups/:id/approve" },
  },
  cancel: {
    v1: { ...defaults.methods.POST, ...defaults.versions.v1, uri: "/followups/:id/cancel" },
  },
  markSent: {
    v1: { ...defaults.methods.POST, ...defaults.versions.v1, uri: "/followups/:id/mark-sent" },
  },
};

export default followups;
