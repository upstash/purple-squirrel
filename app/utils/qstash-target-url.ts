const QSTASH_TARGET_URL =
  process.env.NODE_ENV === "production"
    ? `https://${process.env.NEXT_PUBLIC_URL}`
    : process.env.LOCAL_TUNNEL_URL;

export default QSTASH_TARGET_URL;
