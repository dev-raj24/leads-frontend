const methods = {
  GET: { method: "GET" as const },
  POST: { method: "POST" as const },
  PUT: { method: "PUT" as const },
  DELETE: { method: "DELETE" as const },
  PATCH: { method: "PATCH" as const },
};

const versions = {
  v1: { version: "/api" }, // Base path for leadworks API
};

const defaults = {
  methods,
  versions,
};

export default defaults;
