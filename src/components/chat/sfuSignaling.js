import { SOCKET_URL } from "../../config.js";

export class SfuSignalingClient {
  constructor(token = null) {
    this.ws = null;
    this.connected = false;
    this.handlers = new Map();
    this.token = token;

    // store assigned participant id here once server returns room-state
    this.participantId = null;
  }

  on(type, fn) {
    if (!this.handlers.has(type)) this.handlers.set(type, new Set());
    this.handlers.get(type).add(fn);
  }

  emit(type, data) {
    if (!this.handlers.has(type)) return;
    this.handlers.get(type).forEach((fn) => fn(data));
  }

  _buildWsUrl() {
    let base = SOCKET_URL.trim();
    if (base.startsWith("https://")) base = base.replace("https://", "wss://");
    else if (base.startsWith("http://")) base = base.replace("http://", "ws://");
    else if (!base.startsWith("ws")) base = "wss://" + base;
    return base.replace(/\/+$/, "") + "/signaling";
  }

  connect() {
    return new Promise((resolve) => {
      const url = this._buildWsUrl();
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        console.log("[SFU] Connected");
        this.connected = true;
        resolve();
      };

      this.ws.onmessage = (msg) => {
        let data;
        try {
          data = JSON.parse(msg.data);
        } catch (e) {
          console.warn("Invalid message", e);
          return;
        }
        console.log("[SIGNALING MESSAGE RECEIVED]", data);

        // auto-capture participantId from server-sent room-state
        if (data.type === "room-state" && data.participantId) {
          this.participantId = data.participantId;
          console.log("[SFU] assigned participantId:", this.participantId);
        }

        if (data.type) this.emit(data.type, data);
      };

      this.ws.onerror = (err) => {
        console.warn("[SFU] ws error", err);
      };

      this.ws.onclose = () => {
        this.connected = false;
        console.log("[SFU] ws closed");
      };
    });
  }

  send(obj) {
    if (!obj || typeof obj !== "object") return;

    // if participantId isn't explicitly provided and we have it, inject it
    if (!("participantId" in obj) && this.participantId) {
      obj.participantId = this.participantId;
    }

    try {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify(obj));
      } else {
        console.warn("[SFU] ws not open — cannot send", obj);
      }
    } catch (err) {
      console.error("[SFU] send error", err, obj);
    }
  }
  join(roomId, participantName) {
    const payload = {
      type: "join",
      roomId,

      data: { participantName },
    };
    this.send(payload);
  }

  leave(roomId, pid) {
    this.send({
      type: "leave",
      roomId,
      participantId: pid || this.participantId || undefined,
    });
  }

  sendOffer(roomId, from, to, sdpObj) {
    this.send({
      type: "offer",
      roomId,
      participantId: from || this.participantId || undefined,
      targetParticipantId: to,
      data: {
        sdp: sdpObj.sdp,
        type: "offer",
      },
    });
  }

  sendAnswer(roomId, from, to, sdpObj) {
    this.send({
      type: "answer",
      roomId,
      participantId: from || this.participantId || undefined,
      targetParticipantId: to,
      data: {
        sdp: sdpObj.sdp,
        type: "answer",
      },
    });
  }

  sendIceCandidate(roomId, from, to, candidate) {
    this.send({
      type: "ice-candidate",
      roomId,
      participantId: from || this.participantId || undefined,
      targetParticipantId: to,
      data: {
        candidate: candidate.candidate,
        sdpMid: candidate.sdpMid,
        sdpMLineIndex: candidate.sdpMLineIndex,
      },
    });
  }
}

export default SfuSignalingClient;



