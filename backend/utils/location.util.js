import geoip from "geoip-lite";

export const getClientIp = (req) => {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress
  );
};

export const getCountryCodeFromRequest = (req) => {
  // 1️⃣ Cloudflare (best case)
  if (req.headers["cf-ipcountry"]) {
    return req.headers["cf-ipcountry"];
  }

  // 2️⃣ GeoIP fallback
  const ip = getClientIp(req);
  const geo = geoip.lookup(ip);

  return geo?.country || null;
};
