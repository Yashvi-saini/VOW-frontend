import { SOCKET_URL } from "../../config.js";

export class SfuSignalingClient {
  constructor(token = null) {
    this.ws = null;
    this.connected = false;
    this.handlers = new Map();

    this.token = token;

    this.participantId = null;
    this.currentRoomId = null;
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
          console.warn("Invalid JSON incoming", e);
          return;
        }

        console.log("[SIGNALING MESSAGE RECEIVED]", data);

        if (data.type === "room-state") {
          this.participantId = data.participantId;
          this.currentRoomId = data.roomId;
          console.log("[SFU] assigned participantId:", this.participantId);
        }

        if (data.type) this.emit(data.type, data);
      };

      this.ws.onerror = (err) => console.warn("[SFU] WS Error", err);

      this.ws.onclose = () => {
        this.connected = false;
        console.log("[SFU] ws closed");
      };
    });
  }

  send(obj) {
    if (!obj || typeof obj !== "object") return;

    if (!obj.roomId && this.currentRoomId) obj.roomId = this.currentRoomId;
    if (!("participantId" in obj) && this.participantId) {
      obj.participantId = this.participantId;
    }

    console.log("[SFU OUTGOING]", obj);

    try {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify(obj));
      } else {
        console.warn("[SFU] WS not open — cannot send", obj);
      }
    } catch (err) {
      console.error("[SFU] send error", err);
    }
  }

  join(roomId, participantName) {
    this.currentRoomId = roomId;

    this.send({
      type: "join",
      roomId,
      data: { participantName },
    });
  }

  leave(roomId, pid) {
    this.send({
      type: "leave",
      roomId,
      participantId: pid || this.participantId,
    });
  }

  sendOffer(roomId, from, to, sdpObj) {
    this.send({
      type: "offer",
      roomId,
      participantId: from || this.participantId,
      targetParticipantId: to,
      data: { sdp: sdpObj.sdp, type: "offer" },
    });
  }

  sendAnswer(roomId, from, to, sdpObj) {
    this.send({
      type: "answer",
      roomId,
      participantId: from || this.participantId,
      targetParticipantId: to,
      data: { sdp: sdpObj.sdp, type: "answer" },
    });
  }

  sendIceCandidate(roomId, from, to, cand) {
    this.send({
      type: "ice-candidate",
      roomId,
      participantId: from || this.participantId,
      targetParticipantId: to,
      data: {
        candidate: cand.candidate,
        sdpMid: cand.sdpMid,
        sdpMLineIndex: cand.sdpMLineIndex,
      },
    });
  }
}

export default SfuSignalingClient;



