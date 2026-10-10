import defaults from "./defaults";

const seo = {
  list: {
    v1: { ...defaults.methods.GET, ...defaults.versions.v1, uri: "/seo/audits" },
  },
  get: {
    v1: { ...defaults.methods.GET, ...defaults.versions.v1, uri: "/seo/audits/:id" },
  },
  create: {
    v1: { ...defaults.methods.POST, ...defaults.versions.v1, uri: "/seo/audits" },
  },
};

export default seo;
