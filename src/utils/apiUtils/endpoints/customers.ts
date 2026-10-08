import defaults from "./defaults";

const customers = {
  list: {
    v1: { ...defaults.methods.GET, ...defaults.versions.v1, uri: "/customers" },
  },
  export: {
    v1: { ...defaults.methods.GET, ...defaults.versions.v1, uri: "/customers/:contact/export" },
  },
  erase: {
    v1: { ...defaults.methods.DELETE, ...defaults.versions.v1, uri: "/customers/:contact" },
  },
  get: {
    v1: { ...defaults.methods.GET, ...defaults.versions.v1, uri: "/customers/:contact" },
  },
};

export default customers;
