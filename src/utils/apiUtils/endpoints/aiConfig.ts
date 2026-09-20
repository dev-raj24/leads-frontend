import defaults from "./defaults";

const aiConfig = {
  get: {
    v1: { ...defaults.methods.GET, ...defaults.versions.v1, uri: "/ai-config" },
  },
  save: {
    v1: { ...defaults.methods.PUT, ...defaults.versions.v1, uri: "/ai-config" },
  },
};

export default aiConfig;
