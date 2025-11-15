// sfuSignaling.js
import { SOCKET_URL } from "../../config.js";

export default class SfuSignalingClient {
  constructor(token = null) {
    this.ws = null;
    this.connected = false;
    this.handlers = new Map();
    this.token = token;
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
        let data = null;
        try {
          data = JSON.parse(msg.data);
        } catch (e) {
          console.warn("Invalid JSON", e);
          return;
        }

        console.log("[SIGNALING MESSAGE RECEIVED]", data);

        if (data.type === "room-state" && data.participantId) {
          this.participantId = data.participantId;
          console.log("[SFU] assigned participantId:", this.participantId);
        }

        if (data.type) this.emit(data.type, data);
      };

      this.ws.onerror = (e) => console.warn("[SFU] ws error", e);
      this.ws.onclose = () => console.log("[SFU] ws closed");
    });
  }

  send(obj) {
    if (!obj || typeof obj !== "object") return;

    if (!obj.participantId && this.participantId)
      obj.participantId = this.participantId;

    try {
      console.log("[SFU OUT] ->", obj);
      this.ws?.readyState === WebSocket.OPEN && this.ws.send(JSON.stringify(obj));
    } catch (e) {
      console.error("[SFU] send error", e, obj);
    }
  }

  join(roomId, name) {
    this.send({
      type: "join",
      roomId,
      data: { participantName: name }
    });
  }

  leave(roomId, pid) {
    this.send({
      type: "leave",
      roomId,
      participantId: pid || this.participantId
    });
  }

  // -----------------------------
  // FIXED: CORRECT SDP FORMAT
  // -----------------------------
  sendOffer(roomId, from, to, sdp) {
    this.send({
      type: "offer",
      roomId,
      participantId: from,
      targetParticipantId: to,
      data: {
        type: sdp.type,
        sdp: sdp.sdp
      }
    });
  }

  sendAnswer(roomId, from, to, sdp) {
    this.send({
      type: "answer",
      roomId,
      participantId: from,
      targetParticipantId: to,
      data: {
        type: sdp.type,
        sdp: sdp.sdp
      }
    });
  }

  sendIceCandidate(roomId, from, to, candidate) {
    this.send({
      type: "ice-candidate",
      roomId,
      participantId: from,
      targetParticipantId: to,
      data: {
        candidate: candidate.candidate,
        sdpMid: candidate.sdpMid,
        sdpMLineIndex: candidate.sdpMLineIndex
      }
    });
  }
}



