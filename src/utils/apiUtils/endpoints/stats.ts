import defaults from "./defaults";

const stats = {
  overview: {
    v1: { ...defaults.methods.GET, ...defaults.versions.v1, uri: "/stats/overview" },
  },
};

export default stats;
