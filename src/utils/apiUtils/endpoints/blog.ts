import defaults from "./defaults";

const blog = {
  generate: {
    v1: { ...defaults.methods.POST, ...defaults.versions.v1, uri: "/blog/generate" },
  },
  list: {
    v1: { ...defaults.methods.GET, ...defaults.versions.v1, uri: "/blog" },
  },
  get: {
    v1: { ...defaults.methods.GET, ...defaults.versions.v1, uri: "/blog/:id" },
  },
  create: {
    v1: { ...defaults.methods.POST, ...defaults.versions.v1, uri: "/blog" },
  },
  update: {
    v1: { ...defaults.methods.PATCH, ...defaults.versions.v1, uri: "/blog/:id" },
  },
  remove: {
    v1: { ...defaults.methods.DELETE, ...defaults.versions.v1, uri: "/blog/:id" },
  },
};

export default blog;
