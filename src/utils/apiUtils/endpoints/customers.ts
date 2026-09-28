import defaults from "./defaults";

const customers = {
  list: {
    v1: { ...defaults.methods.GET, ...defaults.versions.v1, uri: "/customers" },
  },
  get: {
    v1: { ...defaults.methods.GET, ...defaults.versions.v1, uri: "/customers/:contact" },
  },
};

export default customers;
