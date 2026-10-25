import defaults from "./defaults";

const searchConsole = {
  status: {
    v1: { ...defaults.methods.GET, ...defaults.versions.v1, uri: "/search-console/status" },
  },
  connect: {
    v1: { ...defaults.methods.POST, ...defaults.versions.v1, uri: "/search-console/connect" },
  },
  properties: {
    v1: { ...defaults.methods.GET, ...defaults.versions.v1, uri: "/search-console/properties" },
  },
  choose: {
    v1: { ...defaults.methods.PUT, ...defaults.versions.v1, uri: "/search-console/property" },
  },
  performance: {
    v1: { ...defaults.methods.GET, ...defaults.versions.v1, uri: "/search-console/performance" },
  },
  disconnect: {
    v1: { ...defaults.methods.DELETE, ...defaults.versions.v1, uri: "/search-console" },
  },
};

export default searchConsole;
