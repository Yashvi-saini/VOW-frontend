
import { useCallback, useEffect, useRef, useState } from "react";
import SfuSignalingClient from "./sfuSignaling.js";

export const useSfuVideoCall = () => {
  const signalingRef = useRef(null);
  const peersRef = useRef(new Map()); 
  const remoteStreamsRef = useRef(new Map()); 
  const pendingCandidatesRef = useRef(new Map()); 
  const localStreamRef = useRef(null);
  const roomIdRef = useRef(null);
  const participantIdRef = useRef(null);
  const heartbeatTimerRef = useRef(null);

  const [roomId, setRoomId] = useState(null);
  const [participantId, setParticipantId] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState(new Map());

  const ensureLocalMedia = useCallback(async () => {
    if (localStreamRef.current) return localStreamRef.current;
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { ideal: 24 },
        },
      });
      localStreamRef.current = s;
      setLocalStream(s);
      return s;
    } catch (err) {
      console.error("[SFU] Error accessing media devices:", err);
      throw err;
    }
  }, []);

  const drainPendingCandidates = useCallback(async (peerId, pc) => {
    const pending = pendingCandidatesRef.current.get(peerId);
    if (pending && pending.length > 0) {
      console.log(`[SFU] Draining ${pending.length} queued ICE candidates for peer: ${peerId}`);
      for (const cand of pending) {
        try {
          await pc.addIceCandidate(
            new RTCIceCandidate({
              candidate: cand.candidate,
              sdpMid: cand.sdpMid,
              sdpMLineIndex: cand.sdpMLineIndex,
            })
          );
        } catch (err) {
          console.error("[SFU] Error applying queued ICE candidate:", err);
        }
      }
      pendingCandidatesRef.current.delete(peerId);
    }
  }, []);

  const createPeer = useCallback((peerId) => {
    if (peersRef.current.has(peerId)) {
      console.log("[SFU] Peer connection already exists for:", peerId);
      return peersRef.current.get(peerId);
    }

    console.log("[SFU] Creating new RTCPeerConnection for peer:", peerId);

    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" },
      ],
    });

    pc.onicecandidate = (e) => {
      if (e.candidate && signalingRef.current) {
        console.log("[SFU] Sending ICE candidate to peer:", peerId);
        signalingRef.current.sendIceCandidate(
          roomIdRef.current,
          participantIdRef.current,
          peerId,
          e.candidate
        );
      }
    };

    pc.ontrack = (e) => {
      console.log("[SFU] Remote track received from peer:", peerId, "kind:", e.track.kind);
      let stream = remoteStreamsRef.current.get(peerId);
      if (!stream) {
        stream = e.streams?.[0] || new MediaStream([e.track]);
        remoteStreamsRef.current.set(peerId, stream);
      } else {
        if (!stream.getTracks().some((t) => t.id === e.track.id)) {
          stream.addTrack(e.track);
        }
      }

      setRemoteStreams(new Map(remoteStreamsRef.current));
    };

    pc.onconnectionstatechange = () => {
      console.log("[SFU] Connection state for peer:", peerId, pc.connectionState);
      if (pc.connectionState === "failed" || pc.connectionState === "closed") {
        console.warn("[SFU] Peer connection ended:", peerId);
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log("[SFU] ICE state for peer:", peerId, pc.iceConnectionState);
    };

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current);
        console.log("[SFU] Added local track to peer:", peerId, track.kind);
      });
    }

    peersRef.current.set(peerId, pc);
    return pc;
  }, []);

  const registerHandlers = useCallback((s) => {
    s.on("room-state", async (msg) => {
      console.log("[SFU] Received room-state:", msg);
      const pid = msg.participantId;
      const rid = msg.roomId;

      participantIdRef.current = pid;
      roomIdRef.current = rid;
      setParticipantId(pid);
      setRoomId(rid);

      s.send({
        type: "start-publish",
        roomId: rid,
        participantId: pid,
      });

      const media = await ensureLocalMedia();

      if (Array.isArray(msg.data?.participants)) {
        for (const p of msg.data.participants) {
          if (p.id === pid) continue;

          console.log("[SFU] Creating offer for existing participant:", p.id);
          const pc = createPeer(p.id);

          try {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            s.sendOffer(rid, pid, p.id, offer);
            console.log("[SFU] Sent offer to peer:", p.id);
          } catch (err) {
            console.error("[SFU] Error creating offer for peer:", p.id, err);
          }
        }
      }
    });

    s.on("offer", async (msg) => {
      const from = msg.participantId;
      console.log("[SFU] Received offer from peer:", from);

      await ensureLocalMedia();
      const pc = createPeer(from);

      try {
        await pc.setRemoteDescription(
          new RTCSessionDescription({
            type: msg.data.type,
            sdp: msg.data.sdp,
          })
        );

        await drainPendingCandidates(from, pc);

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        s.sendAnswer(
          roomIdRef.current || msg.roomId,
          participantIdRef.current || s.participantId,
          from,
          answer
        );
        console.log("[SFU] Answer created and sent to peer:", from);
      } catch (err) {
        console.error("[SFU] Error processing offer from peer:", from, err);
      }
    });

    s.on("answer", async (msg) => {
      const from = msg.participantId;
      console.log("[SFU] Received answer from peer:", from);

      const pc = peersRef.current.get(from);
      if (!pc) {
        console.warn("[SFU] No peer connection found for answer from:", from);
        return;
      }

      try {
        await pc.setRemoteDescription(
          new RTCSessionDescription({
            type: msg.data.type,
            sdp: msg.data.sdp,
          })
        );

        await drainPendingCandidates(from, pc);
        console.log("[SFU] Answer set successfully for peer:", from);
      } catch (err) {
        console.error("[SFU] Error setting answer for peer:", from, err);
      }
    });

    s.on("ice-candidate", async (msg) => {
      const from = msg.participantId;
      const candidateData = msg.data;
      const pc = peersRef.current.get(from);

      if (pc && pc.remoteDescription && pc.remoteDescription.type) {
        try {
          await pc.addIceCandidate(
            new RTCIceCandidate({
              candidate: candidateData.candidate,
              sdpMid: candidateData.sdpMid,
              sdpMLineIndex: candidateData.sdpMLineIndex,
            })
          );
        } catch (err) {
          console.error("[SFU] Error adding ICE candidate for peer:", from, err);
        }
      } else {

        if (!pendingCandidatesRef.current.has(from)) {
          pendingCandidatesRef.current.set(from, []);
        }
        pendingCandidatesRef.current.get(from).push(candidateData);
        console.log("[SFU] Buffered ICE candidate for peer:", from);
      }
    });

    s.on("participant-left", (msg) => {
      const peerId = msg.participantId;
      console.log("[SFU] Participant left:", peerId);
      const pc = peersRef.current.get(peerId);
      if (pc) {
        pc.close();
        peersRef.current.delete(peerId);
      }
      remoteStreamsRef.current.delete(peerId);
      pendingCandidatesRef.current.delete(peerId);
      setRemoteStreams(new Map(remoteStreamsRef.current));
    });
  }, [createPeer, drainPendingCandidates, ensureLocalMedia]);

  const join = useCallback(
    async (rid, name) => {
      roomIdRef.current = rid;
      setRoomId(rid);

      await ensureLocalMedia();

      if (!signalingRef.current) {
        const s = new SfuSignalingClient();
        registerHandlers(s);
        await s.connect();
        signalingRef.current = s;
      }

      signalingRef.current.join(rid, name);
    },
    [ensureLocalMedia, registerHandlers]
  );

  const leave = useCallback(() => {
    if (heartbeatTimerRef.current) {
      clearInterval(heartbeatTimerRef.current);
      heartbeatTimerRef.current = null;
    }

    if (signalingRef.current) {
      try {
        signalingRef.current.leave(roomIdRef.current, participantIdRef.current);
      } catch (e) {
        console.warn("[SFU] Error leaving signaling room:", e);
      }
      signalingRef.current.disconnect();
      signalingRef.current = null;
    }

    peersRef.current.forEach((pc) => {
      try {
        pc.close();
      } catch (e) {}
    });
    peersRef.current.clear();
    pendingCandidatesRef.current.clear();

    remoteStreamsRef.current.clear();
    setRemoteStreams(new Map());

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }
    setLocalStream(null);

    roomIdRef.current = null;
    participantIdRef.current = null;
    setRoomId(null);
    setParticipantId(null);
  }, []);

  const toggleMute = useCallback(() => {
    const stream = localStreamRef.current;
    if (!stream) return;
    const audioTrack = stream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      console.log("[SFU] Audio track enabled:", audioTrack.enabled);
      return !audioTrack.enabled;
    }
  }, []);

  const toggleVideo = useCallback(() => {
    const stream = localStreamRef.current;
    if (!stream) return;
    const videoTrack = stream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      console.log("[SFU] Video track enabled:", videoTrack.enabled);
      return !videoTrack.enabled;
    }
  }, []);

  useEffect(() => {
    return () => {
      leave();
    };
  }, [leave]);

  return {
    roomId,
    participantId,
    localStream,
    remoteStreams,
    join,
    leave,
    toggleMute,
    toggleVideo,
  };
};

export default useSfuVideoCall;
