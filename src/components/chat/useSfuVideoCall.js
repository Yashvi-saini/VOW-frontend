import { useCallback, useEffect, useRef, useState } from "react";
import { SfuSignalingClient } from "./sfuSignaling.js";

export const useSfuVideoCall = () => {

  const signalingRef = useRef(null);
  const [roomId, setRoomId] = useState(null);
  const [participantId, setParticipantId] = useState(null);

  const [localStream, setLocalStream] = useState(null);

  const peersRef = useRef(new Map());
  const [remoteStreams, setRemoteStreams] = useState(new Map());

  // ----------------------------------------
  // SIGNALING INIT
  // ----------------------------------------

  const ensureSignaling = useCallback(async () => {
    if (signalingRef.current) return signalingRef.current;

    const s = new SfuSignalingClient();
    await s.connect();
    signalingRef.current = s;

    return s;
  }, []);

  // ----------------------------------------
  // LOCAL MEDIA
  // ----------------------------------------

  const ensureLocalMedia = useCallback(async () => {
    if (localStream) return localStream;

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    setLocalStream(stream);
    return stream;
  }, [localStream]);

  // ----------------------------------------
  // GET OR CREATE PEER
  // ----------------------------------------

  const getOrCreatePc = useCallback(
    (peerId) => {
      if (peersRef.current.has(peerId)) return peersRef.current.get(peerId);

      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          signalingRef.current.sendIceCandidate(roomId, participantId, peerId, event.candidate);
        }
      };

      pc.ontrack = (event) => {
        const stream = event.streams[0];
        setRemoteStreams((prev) => {
          const updated = new Map(prev);
          updated.set(peerId, stream);
          return updated;
        });
      };

      peersRef.current.set(peerId, pc);
      return pc;
    },
    [roomId, participantId]
  );

  // ----------------------------------------
  // JOIN
  // ----------------------------------------

  const join = useCallback(
    async (rid, displayName) => {
      const s = await ensureSignaling();
      await ensureLocalMedia();

      setRoomId(rid);

      // ----------------------------
      // FIXED EVENT NAMES (lowercase)
      // ----------------------------

      // ROOM STATE
      s.on("room-state", async (msg) => {
        setParticipantId(msg.participantId);

        const others = msg.data.participants.filter(
          (p) => p.id !== msg.participantId
        );

        const stream = await ensureLocalMedia();

        for (const p of others) {
          const pc = getOrCreatePc(p.id);

          stream.getTracks().forEach((t) => pc.addTrack(t, stream));

          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);

          s.sendOffer(rid, msg.participantId, p.id, offer);
        }
      });

      // Participant joined (optional handling)
      s.on("participant-joined", (msg) => {
        console.log("NEW participant joined:", msg.participantId);
      });

      // OFFER
      s.on("offer", async (msg) => {
        const pc = getOrCreatePc(msg.participantId);
        const stream = await ensureLocalMedia();

        stream.getTracks().forEach((t) => pc.addTrack(t, stream));

        await pc.setRemoteDescription(msg.data.sdp);

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        signalingRef.current.sendAnswer(rid, participantId, msg.participantId, answer);
      });

      // ANSWER
      s.on("answer", async (msg) => {
        const pc = peersRef.current.get(msg.participantId);
        if (pc) {
          await pc.setRemoteDescription(msg.data.sdp);
        }
      });

      // ICE CANDIDATE
      s.on("ice-candidate", async (msg) => {
        const pc = peersRef.current.get(msg.participantId);
        if (pc) {
          try {
            await pc.addIceCandidate(msg.data.candidate);
          } catch (e) {
            console.warn("ICE add error", e);
          }
        }
      });

      // NOW SEND JOIN (with empty participantId, required by backend)
      s.join(rid, displayName);
    },
    [ensureSignaling, ensureLocalMedia, getOrCreatePc, participantId]
  );

  // ----------------------------------------
  // LEAVE CALL
  // ----------------------------------------

  const leave = () => {
    const s = signalingRef.current;
    if (s && roomId && participantId) s.leave(roomId, participantId);

    peersRef.current.forEach((pc) => pc.close());
    peersRef.current.clear();

    if (localStream) {
      localStream.getTracks().forEach((t) => t.stop());
    }

    setRemoteStreams(new Map());
    setLocalStream(null);
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
    toggleMute: () =>
      localStream?.getAudioTracks().forEach((t) => (t.enabled = !t.enabled)),
    toggleVideo: () =>
      localStream?.getVideoTracks().forEach((t) => (t.enabled = !t.enabled)),
  };
};

export default useSfuVideoCall;

