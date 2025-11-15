import { SOCKET_URL } from "../../config.js";

export class SfuSignalingClient {
  constructor(token = null) {
    this.ws = null;
    this.connected = false;
    this.handlers = new Map();
    this.token = token;
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
        if (data.type) this.emit(data.type, data);
      };
    });
  }

  send(obj) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(obj));
    }
  }

  // -----------------------------------------
  // FIXED: JOIN REQUIRES participantId STRING
  // -----------------------------------------
  join(roomId, participantName) {
    this.send({
      type: "join",
      roomId,
      participantId: "", // REQUIRED
      data: { participantName },
    });
  }

  leave(roomId, pid) {
    this.send({
      type: "leave",
      roomId,
      participantId: pid || "",
    });
  }

  // -----------------------------------------
  // FIXED: SDP MUST BE FLATTENED
  // -----------------------------------------

  sendOffer(roomId, from, to, sdpObj) {
    this.send({
      type: "offer",
      roomId,
      participantId: from,
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
      participantId: from,
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
      participantId: from,
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


