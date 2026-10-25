import defaults from "./defaults";

const offers = {
  list: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: "/offers",
    },
  },
  create: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: "/offers",
    },
  },
  update: {
    v1: {
      ...defaults.methods.PATCH,
      ...defaults.versions.v1,
      uri: "/offers/:id",
    },
  },
  delete: {
    v1: {
      ...defaults.methods.DELETE,
      ...defaults.versions.v1,
      uri: "/offers/:id",
    },
  },
};

export default offers;
