import defaults from "./defaults";

const sites = {
  me: {
    v1: { ...defaults.methods.GET, ...defaults.versions.v1, uri: "/sites/me" },
  },
  install: {
    v1: { ...defaults.methods.GET, ...defaults.versions.v1, uri: "/sites/me/install" },
  },
  updateSettings: {
    v1: { ...defaults.methods.PATCH, ...defaults.versions.v1, uri: "/sites/:id/settings" },
  },
};

export default sites;
