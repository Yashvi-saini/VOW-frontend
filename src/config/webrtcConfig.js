export const DEFAULT_ICE_SERVERS = [
  // Fast Google & Cloudflare STUN servers for direct zero-latency P2P
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
  { urls: "stun:stun.cloudflare.com:3478" },
  { urls: "stun:stun2.l.google.com:19302" },
  { urls: "stun:stun.services.mozilla.com:3478" },
  // OpenRelay STUN & TURN for NAT/firewall traversal
  { urls: "stun:stun.relay.metered.ca:80" },
  {
    urls: "turn:standard.relay.metered.ca:443?transport=tcp",
    username: "openrelayproject",
    credential: "openrelayproject",
  },
  {
    urls: "turn:standard.relay.metered.ca:80",
    username: "openrelayproject",
    credential: "openrelayproject",
  },
  {
    urls: "turn:standard.relay.metered.ca:443",
    username: "openrelayproject",
    credential: "openrelayproject",
  },
];

export const RTC_CONFIGURATION = {
  iceServers: DEFAULT_ICE_SERVERS,
  iceCandidatePoolSize: 10,
  bundlePolicy: "max-bundle",
  rtcpMuxPolicy: "require",
};
