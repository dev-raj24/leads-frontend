import defaults from "./defaults";

const reviews = {
  status: {
    v1: { ...defaults.methods.GET, ...defaults.versions.v1, uri: "/reviews/status" },
  },
  search: {
    v1: { ...defaults.methods.GET, ...defaults.versions.v1, uri: "/reviews/search" },
  },
  choose: {
    v1: { ...defaults.methods.PUT, ...defaults.versions.v1, uri: "/reviews/business" },
  },
  list: {
    v1: { ...defaults.methods.GET, ...defaults.versions.v1, uri: "/reviews" },
  },
  sync: {
    v1: { ...defaults.methods.POST, ...defaults.versions.v1, uri: "/reviews/sync" },
  },
  regenerate: {
    v1: { ...defaults.methods.POST, ...defaults.versions.v1, uri: "/reviews/:id/regenerate" },
  },
  skip: {
    v1: { ...defaults.methods.POST, ...defaults.versions.v1, uri: "/reviews/:id/skip" },
  },
  copy: {
    v1: { ...defaults.methods.POST, ...defaults.versions.v1, uri: "/reviews/:id/copy" },
  },
  disconnect: {
    v1: { ...defaults.methods.DELETE, ...defaults.versions.v1, uri: "/reviews" },
  },
};

export default reviews;
