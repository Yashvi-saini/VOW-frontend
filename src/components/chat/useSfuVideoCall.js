import { useCallback, useRef, useState } from "react";
import { SfuSignalingClient } from "./sfuSignaling.js";

export const useSfuVideoCall = () => {
  const signalingRef = useRef(null);
  const peers = useRef(new Map());

  const [roomId, setRoomId] = useState(null);
  const [participantId, setParticipantId] = useState(null);

  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState(new Map());

  // SIGNALING

  const ensureSignaling = useCallback(async () => {
    if (signalingRef.current) return signalingRef.current;
    const s = new SfuSignalingClient();
    await s.connect();
    signalingRef.current = s;
    return s;
  }, []);

  // LOCAL MEDIA
 
  const ensureLocalMedia = useCallback(async () => {
    if (localStream) return localStream;

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    setLocalStream(stream);
    return stream;
  }, [localStream]);


  // PEER CONNECTION


  const getOrCreatePc = useCallback(
    (peerId) => {
      if (peers.current.has(peerId)) return peers.current.get(peerId);

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
        const stream = e.streams[0];
        setRemoteStreams((prev) => {
          const updated = new Map(prev);
          updated.set(peerId, stream);
          return updated;
        });
      };

      peers.current.set(peerId, pc);
      return pc;
    },
    [roomId, participantId]
  );

  // JOIN ROOM


  const join = useCallback(
    async (rid, name) => {
      const s = await ensureSignaling();
      const stream = await ensureLocalMedia();

      setRoomId(rid);

      // room state
      s.on("room-state", async (msg) => {
        setParticipantId(msg.participantId);

        const others = msg.data.participants.filter(
          (p) => p.id !== msg.participantId
        );

        for (const p of others) {
          const pc = getOrCreatePc(p.id);
          stream.getTracks().forEach((t) => pc.addTrack(t, stream));

          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);

          s.sendOffer(rid, msg.participantId, p.id, offer);
        }
      });

      // OFFER
      s.on("offer", async (msg) => {
        const pc = getOrCreatePc(msg.participantId);
        stream.getTracks().forEach((t) => pc.addTrack(t, stream));

        await pc.setRemoteDescription({
          type: "offer",
          sdp: msg.data.sdp,
        });

        const ans = await pc.createAnswer();
        await pc.setLocalDescription(ans);

        signalingRef.current.sendAnswer(
          rid,
          participantId,
          msg.participantId,
          ans
        );
      });

      // ANSWER
      s.on("answer", async (msg) => {
        const pc = peers.current.get(msg.participantId);
        if (pc) {
          await pc.setRemoteDescription({
            type: "answer",
            sdp: msg.data.sdp,
          });
        }
      });

      // ICE
      s.on("ice-candidate", async (msg) => {
        const pc = peers.current.get(msg.participantId);
        if (pc) {
          try {
            await pc.addIceCandidate({
              candidate: msg.data.candidate,
              sdpMid: msg.data.sdpMid,
              sdpMLineIndex: msg.data.sdpMLineIndex,
            });
          } catch (e) {
            console.warn("ICE Error:", e);
          }
        }
      });

      s.join(rid, name);
    },
    [ensureSignaling, ensureLocalMedia, getOrCreatePc, participantId]
  );

  // LEAVE ROOM

  const leave = () => {
    if (localStream) {
      localStream.getTracks().forEach((t) => t.stop());
    }

    peers.current.forEach((pc) => pc.close());
    peers.current.clear();

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
  };
};

export default useSfuVideoCall;

