import defaults from "./defaults";

const auth = {
  signup: {
    v1: { ...defaults.methods.POST, ...defaults.versions.v1, uri: "/auth/signup" },
  },
  login: {
    v1: { ...defaults.methods.POST, ...defaults.versions.v1, uri: "/auth/login" },
  },
  forgotPassword: {
    v1: { ...defaults.methods.POST, ...defaults.versions.v1, uri: "/auth/forgot-password" },
  },
  resetPassword: {
    v1: { ...defaults.methods.POST, ...defaults.versions.v1, uri: "/auth/reset-password" },
  },
  changePassword: {
    v1: { ...defaults.methods.PATCH, ...defaults.versions.v1, uri: "/auth/password" },
  },
  verifyEmail: {
    v1: { ...defaults.methods.POST, ...defaults.versions.v1, uri: "/auth/verify-email" },
  },
  resendVerification: {
    v1: { ...defaults.methods.POST, ...defaults.versions.v1, uri: "/auth/resend-verification" },
  },
  logoutAll: {
    v1: { ...defaults.methods.POST, ...defaults.versions.v1, uri: "/auth/logout-all" },
  },
  me: {
    v1: { ...defaults.methods.GET, ...defaults.versions.v1, uri: "/auth/me" },
  },
  changeEmail: {
    v1: { ...defaults.methods.PATCH, ...defaults.versions.v1, uri: "/auth/email" },
  },
};

export default auth;
