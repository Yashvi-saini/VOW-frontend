// useSfuVideoCall.js
import { useCallback, useEffect, useRef, useState } from "react";
import SfuSignalingClient from "./sfuSignaling.js";

export const useSfuVideoCall = () => {
  const signalingRef = useRef(null);
  const handlersRegisteredRef = useRef(false);
  const peersRef = useRef(new Map());

  const [roomId, setRoomId] = useState(null);
  const [participantId, setParticipantId] = useState(null);

  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState(new Map());

  const ensureSignaling = useCallback(async () => {
    if (signalingRef.current) return signalingRef.current;
    const s = new SfuSignalingClient();
    await s.connect();
    signalingRef.current = s;
    return s;
  }, []);

  const ensureLocalMedia = useCallback(async () => {
    if (localStream) return localStream;
    const s = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setLocalStream(s);
    return s;
  }, [localStream]);

  const createPeer = useCallback((peerId) => {
    if (peersRef.current.has(peerId)) return peersRef.current.get(peerId);

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        signalingRef.current.sendIceCandidate(
          roomId,
          participantId,
          peerId,
          e.candidate
        );
      }
    };

    pc.ontrack = (e) => {
      const stream = e.streams?.[0] || new MediaStream([e.track]);
      setRemoteStreams((prev) => {
        const m = new Map(prev);
        m.set(peerId, stream);
        return m;
      });
    };

    pc.onconnectionstatechange = () => {
      console.log("PC state:", peerId, pc.connectionState);
    };

    peersRef.current.set(peerId, pc);
    return pc;
  }, [roomId, participantId]);

  const registerHandlers = useCallback((s) => {
    if (handlersRegisteredRef.current) return;
    handlersRegisteredRef.current = true;

    s.on("room-state", async (msg) => {
      console.log("[HOOK] room-state", msg);

      setParticipantId(msg.participantId);
      s.participantId = msg.participantId;

      s.send({
        type: "start-publish",
        roomId: msg.roomId,
        participantId: msg.participantId,
      });

      const media = await ensureLocalMedia();

      for (const p of msg.data.participants) {
        if (p.id === msg.participantId) continue;

        const pc = createPeer(p.id);

        media.getTracks().forEach((t) => pc.addTrack(t, media));

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        signalingRef.current.sendOffer(msg.roomId, msg.participantId, p.id, offer);
      }
    });

    s.on("offer", async (msg) => {
      const from = msg.participantId;
      const pc = createPeer(from);

      const media = await ensureLocalMedia();
      media.getTracks().forEach((t) => pc.addTrack(t, media));

      await pc.setRemoteDescription({
        type: msg.data.type,
        sdp: msg.data.sdp
      });

      const ans = await pc.createAnswer();
      await pc.setLocalDescription(ans);

      signalingRef.current.sendAnswer(msg.roomId, participantId, from, ans);
    });

    s.on("answer", async (msg) => {
      const pc = peersRef.current.get(msg.participantId);
      await pc?.setRemoteDescription({
        type: msg.data.type,
        sdp: msg.data.sdp,
      });
    });

    s.on("ice-candidate", (msg) => {
      const pc = peersRef.current.get(msg.participantId);
      if (!pc) return;

      pc.addIceCandidate({
        candidate: msg.data.candidate,
        sdpMid: msg.data.sdpMid,
        sdpMLineIndex: msg.data.sdpMLineIndex,
      });
    });
  }, [createPeer, ensureLocalMedia, participantId]);

  const join = useCallback(async (rid, name) => {
    setRoomId(rid);

    const s = await ensureSignaling();
    registerHandlers(s);

    await ensureLocalMedia();
    s.join(rid, name);
  }, [ensureSignaling, registerHandlers, ensureLocalMedia]);

  const leave = () => {
    peersRef.current.forEach((pc) => pc.close());
    peersRef.current.clear();
    setRemoteStreams(new Map());

    if (localStream)
      localStream.getTracks().forEach((t) => t.stop());

    setRoomId(null);
    setParticipantId(null);
  };

  return {
    roomId,
    participantId,
    localStream,
    remoteStreams,
    join,
    leave,
  };
};

export default useSfuVideoCall;
