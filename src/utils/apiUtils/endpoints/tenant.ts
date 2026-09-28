import defaults from "./defaults";

const tenant = {
  me: {
    v1: { ...defaults.methods.GET, ...defaults.versions.v1, uri: "/tenant/me" },
  },
  updateName: {
    v1: { ...defaults.methods.PATCH, ...defaults.versions.v1, uri: "/tenant/name" },
  },
  updateIndustry: {
    v1: { ...defaults.methods.PATCH, ...defaults.versions.v1, uri: "/tenant/industry" },
  },
  choosePlan: {
    v1: { ...defaults.methods.PATCH, ...defaults.versions.v1, uri: "/tenant/plan" },
  },
};

export default tenant;
