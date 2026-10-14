import defaults from "./defaults";

const seo = {
  list: {
    v1: { ...defaults.methods.GET, ...defaults.versions.v1, uri: "/seo/audits" },
  },
  get: {
    v1: { ...defaults.methods.GET, ...defaults.versions.v1, uri: "/seo/audits/:id" },
  },
  fixes: {
    v1: { ...defaults.methods.POST, ...defaults.versions.v1, uri: "/seo/audits/:id/fixes" },
  },
  apply: {
    v1: { ...defaults.methods.POST, ...defaults.versions.v1, uri: "/seo/audits/:id/apply" },
  },
  overrides: {
    v1: { ...defaults.methods.GET, ...defaults.versions.v1, uri: "/seo/overrides" },
  },
  removeOverride: {
    v1: { ...defaults.methods.DELETE, ...defaults.versions.v1, uri: "/seo/overrides" },
  },
  create: {
    v1: { ...defaults.methods.POST, ...defaults.versions.v1, uri: "/seo/audits" },
  },
};

export default seo;
