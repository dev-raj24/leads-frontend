export const hostname = () => {
  let host = "";
  if (typeof window === "undefined") {
    host = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4001";
  } else {
    switch (window.location.hostname) {
      case "localhost":
      case "127.0.0.1":
        host = "http://localhost:4001";
        break;
      default:
        host = process.env.NEXT_PUBLIC_API_URL || "https://api.yourlivebackend.com";
    }
  }
  return host;
};
