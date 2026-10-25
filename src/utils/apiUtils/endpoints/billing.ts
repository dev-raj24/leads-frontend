import defaults from "./defaults";

const billing = {
  overview: {
    v1: { ...defaults.methods.GET, ...defaults.versions.v1, uri: "/billing" },
  },
  subscribe: {
    v1: { ...defaults.methods.POST, ...defaults.versions.v1, uri: "/billing/subscribe" },
  },
  cancel: {
    v1: { ...defaults.methods.POST, ...defaults.versions.v1, uri: "/billing/cancel" },
  },
};

export default billing;
