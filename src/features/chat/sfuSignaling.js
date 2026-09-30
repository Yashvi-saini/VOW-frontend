const BASE_URL = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL || "http://localhost:5000";

export default class SfuSignalingClient {
  constructor(token = null) {
    this.ws = null;
    this.connected = false;
    this.handlers = new Map();
    this.token = token || localStorage.getItem("accessToken");
    this.participantId = null;
    this.roomId = null;
  }

  on(type, fn) {
    if (!this.handlers.has(type)) this.handlers.set(type, new Set());
    this.handlers.get(type).add(fn);
  }

  off(type, fn) {
    if (this.handlers.has(type)) {
      this.handlers.get(type).delete(fn);
    }
  }

  emit(type, data) {
    if (!this.handlers.has(type)) return;
    this.handlers.get(type).forEach((fn) => fn(data));
  }

  _buildWsUrl() {
    let base = BASE_URL?.trim();

    if (!base) {
      base = typeof window !== "undefined" && window.location.origin
        ? window.location.origin
        : "http://localhost:5000";
    }

    if (base.startsWith("https://")) base = base.replace("https://", "wss://");
    else if (base.startsWith("http://")) base = base.replace("http://", "ws://");
    else if (!base.startsWith("ws://") && !base.startsWith("wss://")) base = `wss://${base}`;

    base = base.replace(/\/+$/, "").replace(/\/signaling$/, "");
    return base + "/signaling";
  }

  connect() {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      try {
        const url = this._buildWsUrl();
        console.log("[SFU] Connecting to signaling server at:", url);

        this.ws = new WebSocket(url);

        this.ws.onopen = () => {
          this.connected = true;
          console.log("[SFU] WebSocket connected to signaling server");
          resolve();
        };

        this.ws.onmessage = (msg) => {
          let data = null;
          try {
            data = JSON.parse(msg.data);
          } catch (e) {
            console.warn("[SFU] Received invalid JSON:", e);
            return;
          }

          if (data.type === "room-state") {
            if (data.participantId) this.participantId = data.participantId;
            if (data.roomId) this.roomId = data.roomId;
          }

          if (data.type) this.emit(data.type, data);
        };

        this.ws.onerror = (e) => {
          console.warn("[SFU] WebSocket error:", e);
          reject(e);
        };

        this.ws.onclose = (event) => {
          this.connected = false;
          console.log("[SFU] WebSocket closed, code:", event.code, "reason:", event.reason);
        };
      } catch (err) {
        reject(err);
      }
    });
  }

  send(obj) {
    if (!obj || typeof obj !== "object") return;

    if (!obj.roomId && this.roomId) {
      obj.roomId = this.roomId;
    }
    if (!obj.participantId && this.participantId) {
      obj.participantId = this.participantId;
    }

    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(obj));
    } else {
      console.warn("[SFU] Cannot send message, WebSocket is not OPEN. State:", this.ws?.readyState);
    }
  }

  join(roomId, name) {
    this.roomId = roomId;
    this.send({
      type: "join",
      roomId,
      data: { participantName: name },
    });
  }

  leave(roomId, pid) {
    this.send({
      type: "leave",
      roomId: roomId || this.roomId,
      participantId: pid || this.participantId,
    });
  }

  sendOffer(roomId, from, to, sdp) {
    this.send({
      type: "offer",
      roomId: roomId || this.roomId,
      participantId: from || this.participantId,
      targetParticipantId: to,
      data: {
        type: sdp.type,
        sdp: sdp.sdp,
      },
    });
  }

  sendAnswer(roomId, from, to, sdp) {
    this.send({
      type: "answer",
      roomId: roomId || this.roomId,
      participantId: from || this.participantId,
      targetParticipantId: to,
      data: {
        type: sdp.type,
        sdp: sdp.sdp,
      },
    });
  }

  sendIceCandidate(roomId, from, to, candidate) {
    this.send({
      type: "ice-candidate",
      roomId: roomId || this.roomId,
      participantId: from || this.participantId,
      targetParticipantId: to,
      data: {
        candidate: candidate.candidate,
        sdpMid: candidate.sdpMid,
        sdpMLineIndex: candidate.sdpMLineIndex,
      },
    });
  }

  disconnect() {
    if (this.ws) {
      try {
        this.ws.close();
      } catch (e) {
        console.warn("[SFU] Error closing WebSocket:", e);
      }
      this.ws = null;
    }
    this.connected = false;
    this.participantId = null;
    this.roomId = null;
    this.handlers.clear();
  }
}