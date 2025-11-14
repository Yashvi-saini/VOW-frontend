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
    return () => this.off(type, fn);
  }

  off(type, fn) {
    if (!this.handlers.has(type)) return;
    this.handlers.get(type).delete(fn);
  }

  emit(type, payload) {
    if (!this.handlers.has(type)) return;
    for (const fn of this.handlers.get(type)) fn(payload);
  }

  _buildWsUrl() {
    let base = SOCKET_URL.trim();
    if (base.startsWith("https://")) base = base.replace("https://", "wss://");
    else if (base.startsWith("http://")) base = base.replace("http://", "ws://");
    else if (!base.startsWith("ws")) base = "wss://" + base;

    return base.replace(/\/+$/, "") + "/signaling";
  }

  connect() {
    return new Promise((resolve, reject) => {
      const url = this._buildWsUrl();
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        console.log("[SFU] Connected");
        this.connected = true;
        this.emit("open");
        resolve();
      };

      this.ws.onmessage = (msg) => {
        let data;
        try {
          data = JSON.parse(msg.data);
        } catch {
          return console.warn("Invalid JSON");
        }

        console.log("[SIGNALING MESSAGE RECEIVED]", data);
        if (data?.type) this.emit(data.type, data);
      };

      this.ws.onerror = reject;
    });
  }

  send(obj) {
    if (this.ws?.readyState === WebSocket.OPEN)
      this.ws.send(JSON.stringify(obj));
  }

  // FIXED: MUST include participantId as empty string
  join(roomId, participantName) {
    this.send({
      type: "join",
      roomId,
      participantId: "",
      data: { participantName },
    });
  }

  leave(roomId, participantId) {
    this.send({
      type: "leave",
      roomId,
      participantId: participantId || "",
    });
  }

  sendOffer(roomId, from, to, sdp) {
    this.send({
      type: "offer",
      roomId,
      participantId: from,
      targetParticipantId: to,
      data: { sdp },
    });
  }

  sendAnswer(roomId, from, to, sdp) {
    this.send({
      type: "answer",
      roomId,
      participantId: from,
      targetParticipantId: to,
      data: { sdp },
    });
  }

  sendIceCandidate(roomId, from, to, candidate) {
    this.send({
      type: "ice-candidate",
      roomId,
      participantId: from,
      targetParticipantId: to,
      data: { candidate },
    });
  }
}

export default SfuSignalingClient;

