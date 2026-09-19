import defaults from "./defaults";

const followups = {
  list: {
    v1: { ...defaults.methods.GET, ...defaults.versions.v1, uri: "/followups" },
  },
};

export default followups;
