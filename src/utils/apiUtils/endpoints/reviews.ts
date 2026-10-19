import defaults from "./defaults";

const reviews = {
  status: {
    v1: { ...defaults.methods.GET, ...defaults.versions.v1, uri: "/reviews/status" },
  },
  connect: {
    v1: { ...defaults.methods.POST, ...defaults.versions.v1, uri: "/reviews/connect" },
  },
  locations: {
    v1: { ...defaults.methods.GET, ...defaults.versions.v1, uri: "/reviews/locations" },
  },
  choose: {
    v1: { ...defaults.methods.PUT, ...defaults.versions.v1, uri: "/reviews/location" },
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
  send: {
    v1: { ...defaults.methods.POST, ...defaults.versions.v1, uri: "/reviews/:id/send" },
  },
  disconnect: {
    v1: { ...defaults.methods.DELETE, ...defaults.versions.v1, uri: "/reviews" },
  },
};

export default reviews;
