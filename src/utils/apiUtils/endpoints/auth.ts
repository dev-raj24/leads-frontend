import defaults from "./defaults";

const auth = {
  signup: {
    v1: { ...defaults.methods.POST, ...defaults.versions.v1, uri: "/auth/signup" },
  },
  login: {
    v1: { ...defaults.methods.POST, ...defaults.versions.v1, uri: "/auth/login" },
  },
};

export default auth;
