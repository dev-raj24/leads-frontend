import defaults from "./defaults";

const sites = {
  me: {
    v1: { ...defaults.methods.GET, ...defaults.versions.v1, uri: "/sites/me" },
  },
  inspect: {
    v1: { ...defaults.methods.POST, ...defaults.versions.v1, uri: "/sites/me/inspect" },
  },
  updateSettings: {
    v1: { ...defaults.methods.PATCH, ...defaults.versions.v1, uri: "/sites/:id/settings" },
  },
};

export default sites;
