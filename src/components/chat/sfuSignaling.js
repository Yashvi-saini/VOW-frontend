import { SOCKET_URL } from "../../config.js";
const MSG = {
  JOIN: "join",
  LEAVE: "leave",
  OFFER: "offer",
  ANSWER: "answer",
  ICE: "ice-candidate",
};

export class SfuSignalingClient {
  constructor(token = null) {
    this.ws = null;
    this.connected = false;

    this.handlers = new Map();
    this.token = token;

    this._closing = false;
    this._retryCount = 0;
    this._maxRetries = 8;
    this._baseDelay = 800;
    this._heartbeatInterval = null;
  }

  on(type, fn) {
    if (!this.handlers.has(type)) this.handlers.set(type, new Set());
    this.handlers.get(type).add(fn);
    return () => this.off(type, fn);
  }

  off(type, fn) {
    if (!this.handlers.has(type)) return;
    this.handlers.get(type).delete(fn);
  }

  emit(type, payload) {
    if (!this.handlers.has(type)) return;
    for (const fn of this.handlers.get(type)) {
      try { fn(payload); } catch (err) {
        console.error("[Signaling handler error]", err);
      }
    }
  }

  _buildWsUrl() {
    let base = SOCKET_URL.trim();

    if (base.startsWith("https://")) base = base.replace("https://", "wss://");
    else if (base.startsWith("http://")) base = base.replace("http://", "ws://");
    else if (!base.startsWith("ws")) base = "wss://" + base;

    base = base.replace(/\/+$/, "");

    let url = `${base}/signaling`;

    if (this.token) {
      url += `?token=${encodeURIComponent(this.token)}`;
    }

    console.log("[SFU] WS URL =", url);
    return url;
  }

  connect() {
    return new Promise((resolve, reject) => {
      const url = this._buildWsUrl();

      try {
        this.ws = new WebSocket(url);
      } catch (err) {
        console.error("[SFU] Constructor error", err);
        return reject(err);
      }

      this.ws.onopen = () => {
        console.log("[SFU] Connected");
        this.connected = true;
        this.emit("open");

        this._heartbeatInterval = setInterval(() => {
          if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type: "PING" }));
          }
        }, 25000);

        resolve();
      };

      this.ws.onmessage = (msg) => {
        try {
          const data = typeof msg.data === "string"
            ? JSON.parse(msg.data)
            : msg.data;

          console.log("[SIGNALING MESSAGE RECEIVED]", data);

          if (data?.type) this.emit(data.type, data);
        } catch (err) {
          console.warn("[SFU] Parse error:", err);
        }
      };

      this.ws.onerror = (err) => {
        console.error("[SFU] WS error:", err);
      };

      this.ws.onclose = () => {
        console.warn("[SFU] WS closed");
        this.connected = false;
      };
    });
  }

  send(obj) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn("[SFU] Cannot send, WS not open");
      return;
    }
    this.ws.send(JSON.stringify(obj));
  }

  // FIXED: EXACT MATCH WITH BACKEND TYPES
 
  join(roomId, participantName) {
    this.send({
      type: MSG.JOIN,
      roomId,
      data: { participantName },
    });
  }

  leave(roomId, participantId) {
    this.send({
      type: MSG.LEAVE,
      roomId,
      participantId,
    });
  }

  sendOffer(roomId, from, to, sdp) {
    this.send({
      type: MSG.OFFER,
      roomId,
      participantId: from,
      targetParticipantId: to,
      data: { sdp },
    });
  }

  sendAnswer(roomId, from, to, sdp) {
    this.send({
      type: MSG.ANSWER,
      roomId,
      participantId: from,
      targetParticipantId: to,
      data: { sdp },
    });
  }

  sendIceCandidate(roomId, from, to, candidate) {
    this.send({
      type: MSG.ICE,
      roomId,
      participantId: from,
      targetParticipantId: to,
      data: { candidate },
    });
  }
}

export default SfuSignalingClient;

