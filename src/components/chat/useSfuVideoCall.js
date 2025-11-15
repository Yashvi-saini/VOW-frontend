import { useCallback, useEffect, useRef, useState } from "react";
import SfuSignalingClient from "./sfuSignaling.js";

export const useSfuVideoCall = () => {
  const signalingRef = useRef(null);
  const handlersRegisteredRef = useRef(false);

  const peersRef = useRef(new Map());
  const [peersState, setPeersState] = useState(new Map());

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
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setLocalStream(stream);
    return stream;
  }, [localStream]);

  const syncPeersState = () => {
    setPeersState(new Map(peersRef.current));
  };

  const createPeer = useCallback(
    (peerId) => {
      const existing = peersRef.current.get(peerId);
      if (existing) return existing;

      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      pc.onicecandidate = (ev) => {
        if (ev.candidate && signalingRef.current) {
          signalingRef.current.sendIceCandidate(
            signalingRef.current.currentRoomId,
            signalingRef.current.participantId,
            peerId,
            ev.candidate
          );
        }
      };

      pc.ontrack = (ev) => {
        const stream = ev.streams[0];
        if (stream) {
          setRemoteStreams((prev) => {
            const m = new Map(prev);
            m.set(peerId, stream);
            return m;
          });
        }
      };

      pc.onconnectionstatechange = () => {
        console.log(`pc(${peerId}) state:`, pc.connectionState);
      };

      peersRef.current.set(peerId, pc);
      syncPeersState();
      return pc;
    },
    []
  );

  const registerHandlersOnce = useCallback(
    (s) => {
      if (handlersRegisteredRef.current) return;
      handlersRegisteredRef.current = true;

      // PHONE RINGS HERE
      s.on("room-state", async (msg) => {
        console.log("[HOOK] room-state", msg);

        const myId = msg.participantId;
        setParticipantId(myId);

        s.participantId = myId;
        s.currentRoomId = msg.roomId;

        await ensureLocalMedia();

        // START PUBLISH
        s.send({ type: "start-publish", roomId: msg.roomId, participantId: myId });

        // Create offer to existing participants
        const participants = msg.data.participants || [];
        const media = localStream;

        for (const p of participants) {
          if (p.id === myId) continue;

          const pc = createPeer(p.id);

          media.getTracks().forEach((t) => pc.addTrack(t, media));

          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);

          s.sendOffer(msg.roomId, myId, p.id, offer);
        }
      });

      s.on("offer", async (msg) => {
        console.log("[HOOK] OFFER", msg);

        const from = msg.participantId;
        const to = s.participantId;

        const pc = createPeer(from);

        const media = localStream;
        media.getTracks().forEach((t) => pc.addTrack(t, media));

        await pc.setRemoteDescription({ type: "offer", sdp: msg.data.sdp });

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        s.sendAnswer(msg.roomId, to, from, answer);
      });

      s.on("answer", async (msg) => {
        const from = msg.participantId;
        console.log("[HOOK] ANSWER from ", from);

        const pc = peersRef.current.get(from);
        if (!pc) return;

        await pc.setRemoteDescription({
          type: "answer",
          sdp: msg.data.sdp,
        });
      });

      s.on("ice-candidate", async (msg) => {
        const from = msg.participantId;
        const pc = peersRef.current.get(from);

        if (!pc) return;

        await pc.addIceCandidate({
          candidate: msg.data.candidate,
          sdpMid: msg.data.sdpMid,
          sdpMLineIndex: msg.data.sdpMLineIndex,
        });
      });

      s.on("participant-left", (msg) => {
        console.log("peer left", msg.participantId);

        const pc = peersRef.current.get(msg.participantId);
        if (pc) pc.close();

        peersRef.current.delete(msg.participantId);
        syncPeersState();
      });

      s.on("error", (err) => {
        console.warn("[SFU ERROR]", err);
      });
    },
    [createPeer, ensureLocalMedia, localStream]
  );

  const join = useCallback(
    async (rid, name) => {
      const s = await ensureSignaling();

      setRoomId(rid);
      s.currentRoomId = rid;

      registerHandlersOnce(s);

      await ensureLocalMedia();

      s.join(rid, name);
    },
    [ensureSignaling, ensureLocalMedia, registerHandlersOnce]
  );

  const leave = useCallback(() => {
    try {
      if (signalingRef.current && roomId && participantId) {
        signalingRef.current.leave(roomId, participantId);
      }
    } catch {}

    peersRef.current.forEach((pc) => pc.close());
    peersRef.current.clear();
    setRemoteStreams(new Map());

    if (localStream) {
      localStream.getTracks().forEach((t) => t.stop());
    }

    setLocalStream(null);
    setRoomId(null);
    setParticipantId(null);
    handlersRegisteredRef.current = false;
    signalingRef.current = null;
  }, [localStream, roomId, participantId]);

  useEffect(() => {
    return () => leave();
  }, []);

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
