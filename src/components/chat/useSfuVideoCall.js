/* FULL UPDATED useSfuVideoCall HOOK */

import { useCallback, useEffect, useRef, useState } from "react";
import { SfuSignalingClient } from "./sfuSignaling.js";

export const useSfuVideoCall = () => {
  const signalingRef = useRef(null);
  const leaveRef = useRef(() => {});
  const [roomId, setRoomId] = useState(null);
  const [participantId, setParticipantId] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [peers, setPeers] = useState(new Map());
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
      audio: true,
      video: true,
    });
    setLocalStream(stream);
    return stream;
  }, [localStream]);

  const getOrCreatePc = useCallback(
    (peerId) => {
      if (peers.has(peerId)) return peers.get(peerId);

      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      pc.onicecandidate = (e) => {
        if (e.candidate)
          signalingRef.current.sendIceCandidate(roomId, participantId, peerId, e.candidate);
      };

      pc.ontrack = (e) => {
        const stream = e.streams[0];
        setRemoteStreams((prev) => new Map(prev).set(peerId, stream));
      };

      setPeers((prev) => new Map(prev).set(peerId, pc));
      return pc;
    },
    [peers, roomId, participantId]
  );

  const join = useCallback(
    async (rid, displayName) => {
      const s = await ensureSignaling();
      await ensureLocalMedia();
      setRoomId(rid);

      s.on("ROOM_STATE", async (msg) => {
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

      s.on("OFFER", async (msg) => {
        const pc = getOrCreatePc(msg.participantId);
        const stream = await ensureLocalMedia();

        stream.getTracks().forEach((t) => pc.addTrack(t, stream));
        await pc.setRemoteDescription(msg.data.sdp);

        const ans = await pc.createAnswer();
        await pc.setLocalDescription(ans);

        signalingRef.current.sendAnswer(rid, participantId, msg.participantId, ans);
      });

      s.on("ANSWER", async (msg) => {
        const pc = peers.get(msg.participantId);
        if (pc) await pc.setRemoteDescription(msg.data.sdp);
      });

      s.on("ICE_CANDIDATE", async (msg) => {
        const pc = peers.get(msg.participantId);
        if (pc) await pc.addIceCandidate(msg.data.candidate);
      });

      s.join(rid, displayName);
    },
    [ensureSignaling, ensureLocalMedia, getOrCreatePc, peers]
  );

  const leave = () => {
    for (const pc of peers.values()) pc.close();
    setPeers(new Map());
    setRemoteStreams(new Map());
    if (localStream) localStream.getTracks().forEach((t) => t.stop());
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
    toggleMute: () => {
      localStream && localStream.getAudioTracks().forEach((t) => (t.enabled = !t.enabled));
    },
    toggleVideo: async () => {
      if (!localStream) return;
      const video = localStream.getVideoTracks()[0];
      video.enabled = !video.enabled;
    },
  };
};

export default useSfuVideoCall;

