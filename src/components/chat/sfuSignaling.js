import { SOCKET_URL } from "../../config.js";

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

  // --------------------------
  // Event Handling
  // --------------------------
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
      try {
        fn(payload);
      } catch (err) {
        console.error("[Signaling:handler-error]", err);
      }
    }
  }

  // --------------------------
  // Build WebSocket URL (fixed)
  // --------------------------
  _buildWsUrl() {
    let base = SOCKET_URL.trim();

    // Force WSS for HTTPS apps
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

  // --------------------------
  // Connect to SFU Signaling
  // --------------------------
  connect() {
    return new Promise((resolve, reject) => {
      const url = this._buildWsUrl();

      console.log("[SFU] Connecting:", url);

      try {
        this.ws = new WebSocket(url);
      } catch (err) {
        console.error("[SFU] Constructor error", err);
        return reject(err);
      }

      this.ws.onopen = () => {
        console.log("[SFU] Connected (WS OPEN)");
        this.connected = true;
        this._retryCount = 0;
        this.emit("open");

        // Heartbeat every 25 seconds
        if (this._heartbeatInterval) clearInterval(this._heartbeatInterval);
        this._heartbeatInterval = setInterval(() => {
          if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type: "PING" }));
          }
        }, 25000);

        resolve();
      };

      this.ws.onerror = (err) => {
        console.error("[SFU] WS error:", err);
      };

      this.ws.onclose = (ev) => {
        console.warn("[SFU] WS closed:", ev.code, ev.reason);
        this.connected = false;

        if (this._heartbeatInterval) {
          clearInterval(this._heartbeatInterval);
          this._heartbeatInterval = null;
        }

        if (!this._closing) {
          this._retryCount++;
          if (this._retryCount <= this._maxRetries) {
            const delay = this._baseDelay * Math.pow(1.5, this._retryCount);
            console.log(`[SFU] Reconnecting in ${Math.round(delay)}ms...`);
            setTimeout(() => this.connect(), delay);
          }
        }
      };

      this.ws.onmessage = (msg) => {
        try {
          const data =
            typeof msg.data === "string" ? JSON.parse(msg.data) : msg.data;

          if (data?.type) {
            this.emit(data.type, data);
          }
          this.emit("message", data);
        } catch (err) {
          console.warn("[SFU] Parse error:", err);
        }
      };
    });
  }

  // --------------------------
  // Close connection
  // --------------------------
  close() {
    this._closing = true;
    if (this._heartbeatInterval) {
      clearInterval(this._heartbeatInterval);
      this._heartbeatInterval = null;
    }
    try {
      this.ws?.close();
    } catch {}
  }

  // --------------------------
  // Send primitives
  // --------------------------
  send(obj) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn("[SFU] send() ignored - WS NOT OPEN");
      return;
    }
    this.ws.send(JSON.stringify(obj));
  }

  // --------------------------
  // Signaling Helpers
  // --------------------------

  join(roomId, participantName) {
    this.send({
      type: "JOIN",
      roomId,
      data: { participantName },
    });
  }

  leave(roomId, participantId) {
    this.send({
      type: "LEAVE",
      roomId,
      participantId,
    });
  }

  sendOffer(roomId, from, to, sdp) {
    this.send({
      type: "OFFER",
      roomId,
      participantId: from,
      targetParticipantId: to,
      data: { sdp },
    });
  }

  sendAnswer(roomId, from, to, sdp) {
    this.send({
      type: "ANSWER",
      roomId,
      participantId: from,
      targetParticipantId: to,
      data: { sdp },
    });
  }

  sendIceCandidate(roomId, from, to, candidate) {
    this.send({
      type: "ICE_CANDIDATE",
      roomId,
      participantId: from,
      targetParticipantId: to,
      data: { candidate },
    });
  }
}

export default SfuSignalingClient;
