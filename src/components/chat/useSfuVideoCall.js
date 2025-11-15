import { useCallback, useEffect, useRef, useState } from "react";
import { SfuSignalingClient } from "./sfuSignaling.js";

export const useSfuVideoCall = () => {
  const signalingRef = useRef(null);
  const participantIdRef = useRef(null);
  const peersRef = useRef(new Map());
  const remoteStreamsRef = useRef(new Map()); 

  const [roomId, setRoomId] = useState(null);
  const [participantId, setParticipantId] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState(new Map()); 
  const [connected, setConnected] = useState(false);

  
  const ensureSignaling = useCallback(async () => {
    if (signalingRef.current) return signalingRef.current;
    const s = new SfuSignalingClient();
    await s.connect();
    signalingRef.current = s;

    // Register global handlers ONCE
    s.on("ROOM_STATE", async (msg) => {
      // ROOM_STATE arrives when we join -> msg.participantId is our id
      console.log("[Signaling] ROOM_STATE", msg);
      participantIdRef.current = msg.participantId;
      setParticipantId(msg.participantId);

      // Create connections and offer to existing participants
      const others = (msg.data?.participants || []).filter((p) => p.id !== msg.participantId);
      const stream = await ensureLocalMedia();

      for (const p of others) {
        const pc = getOrCreatePc(p.id);
        
        addLocalTracksToPc(pc, stream);

        try {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
         
          signalingRef.current.sendOffer(msg.roomId, msg.participantId, p.id, pc.localDescription);
        } catch (err) {
          console.error("[Signaling] OFFER creation error for", p.id, err);
        }
      }
    });

    s.on("OFFER", async (msg) => {
      // Someone offered to us (msg.participantId is the sender)
      console.log("[Signaling] OFFER from", msg.participantId);
      const fromId = msg.participantId;
      const pc = getOrCreatePc(fromId);
      const stream = await ensureLocalMedia();
      addLocalTracksToPc(pc, stream);

      try {
        await pc.setRemoteDescription(msg.data.sdp);
      } catch (err) {
        console.error("[Signaling] setRemoteDescription (offer) failed:", err, msg.data);
        return;
      }

      try {
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        // Use participantIdRef.current as 'from'
        signalingRef.current.sendAnswer(msg.roomId, participantIdRef.current, fromId, pc.localDescription);
      } catch (err) {
        console.error("[Signaling] create/send ANSWER failed:", err);
      }
    });

    s.on("ANSWER", async (msg) => {
      // An answer to our earlier offer (msg.participantId is the responder)
      console.log("[Signaling] ANSWER from", msg.participantId);
      const pc = peersRef.current.get(msg.participantId);
      if (!pc) {
        console.warn("[Signaling] ANSWER for unknown pc", msg.participantId);
        return;
      }
      try {
        await pc.setRemoteDescription(msg.data.sdp);
      } catch (err) {
        console.error("[Signaling] setRemoteDescription (answer) failed:", err);
      }
    });

    s.on("ICE_CANDIDATE", async (msg) => {
      // Incoming ICE candidate from someone
      const from = msg.participantId;
      const candidate = msg.data?.candidate;
      if (!candidate) return;
      const pc = peersRef.current.get(from);
      if (!pc) {
        console.warn("[Signaling] ICE candidate for unknown pc", from);
        return;
      }
      try {
        await pc.addIceCandidate(candidate);
      } catch (err) {
        console.error("[Signaling] addIceCandidate failed:", err);
      }
    });

    
    s.on("open", () => setConnected(true));
    s.on("close", () => setConnected(false));

    return s;
  }, []);

  // Local media
  const ensureLocalMedia = useCallback(async () => {
    if (localStream) return localStream;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      setLocalStream(stream);
      return stream;
    } catch (err) {
      console.error("[Media] getUserMedia failed:", err);
      throw err;
    }
  }, [localStream]);

  
  const addLocalTracksToPc = (pc, stream) => {
    // avoid adding duplicate senders for same track
    const existingSenders = pc.getSenders().map((s) => s.track).filter(Boolean);
    for (const t of stream.getTracks()) {
      if (!existingSenders.includes(t)) {
        try {
          pc.addTrack(t, stream);
        } catch (err) {
          console.warn("[PC] addTrack failed:", err);
        }
      }
    }
  };

  
  const getOrCreatePc = useCallback((peerId) => {
    const existing = peersRef.current.get(peerId);
    if (existing) return existing;

    const pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });

    pc.onicecandidate = (e) => {
      if (e.candidate && signalingRef.current && roomId && participantIdRef.current) {
        signalingRef.current.sendIceCandidate(roomId, participantIdRef.current, peerId, e.candidate);
      }
    };

    pc.ontrack = (e) => {
    
      const stream = e.streams && e.streams[0];
      if (!stream) {
        console.warn("[PC] ontrack but no streams[0]", e);
        return;
      }
      remoteStreamsRef.current.set(peerId, stream);
      // update react state copy so UI re-renders
      setRemoteStreams(new Map(remoteStreamsRef.current));
    };

    pc.onconnectionstatechange = () => {
      console.log(`[PC:${peerId}] connectionState:`, pc.connectionState);
      if (pc.connectionState === "failed" || pc.connectionState === "closed") {
        // cleanup
        peersRef.current.delete(peerId);
        remoteStreamsRef.current.delete(peerId);
        setRemoteStreams(new Map(remoteStreamsRef.current));
      }
    };

    peersRef.current.set(peerId, pc);
    return pc;
  }, [roomId]);

  // Public join
  const join = useCallback(
    async (rid, displayName) => {
      setRoomId(rid);
      const s = await ensureSignaling();
      await ensureLocalMedia();

      // call join after handlers are in place
      s.join(rid, displayName);
    },
    [ensureSignaling, ensureLocalMedia]
  );

  // Public leave
  const leave = useCallback(() => {
    // send LEAVE if needed
    try {
      if (signalingRef.current && roomId && participantIdRef.current) {
        signalingRef.current.leave(roomId, participantIdRef.current);
      }
    } catch (err) {
      console.warn("[Signaling] leave error", err);
    }

    // close all peers
    for (const pc of peersRef.current.values()) {
      try {
        pc.close();
      } catch {}
    }
    peersRef.current.clear();
    remoteStreamsRef.current.clear();
    setRemoteStreams(new Map());
    setRoomId(null);
    setParticipantId(null);
    participantIdRef.current = null;

    if (localStream) {
      localStream.getTracks().forEach((t) => t.stop());
    }
    setLocalStream(null);
  }, [localStream, roomId]);

  // toggles
  const toggleMute = useCallback(() => {
    if (!localStream) return;
    localStream.getAudioTracks().forEach((t) => (t.enabled = !t.enabled));
  }, [localStream]);

  const toggleVideo = useCallback(() => {
    if (!localStream) return;
    const v = localStream.getVideoTracks()[0];
    if (v) v.enabled = !v.enabled;
  }, [localStream]);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      try {
        leave();
      } catch {}
    };
  }, []);

  return {
    roomId,
    participantId,
    localStream,
    remoteStreams,
    join,
    leave,
    toggleMute,
    toggleVideo,
    connected,
  };
};

export default useSfuVideoCall;


