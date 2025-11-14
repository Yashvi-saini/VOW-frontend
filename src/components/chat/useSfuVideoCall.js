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

  
  // Ensure Signaling WS Connected
  
  const ensureSignaling = useCallback(async () => {
    if (signalingRef.current) return signalingRef.current;
    const s = new SfuSignalingClient();
    await s.connect();
    signalingRef.current = s;
    return s;
  }, []);

  // Ensure Camera / Mic
  
  const ensureLocalMedia = useCallback(async () => {
    if (localStream) return localStream;

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true },
      video: { facingMode: "user" },
    });

    setLocalStream(stream);
    return stream;
  }, [localStream]);

 
  // Get or create RTCPeerConnection
 
  const getOrCreatePc = useCallback(
    (peerId) => {
      if (!peerId) return null;

      const existing = peers.get(peerId);
      if (existing) return existing;

      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      pc.onicecandidate = (e) => {
        if (e.candidate && signalingRef.current && roomId && participantId) {
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
          const next = new Map(prev);
          next.set(peerId, stream);
          return next;
        });
      };

      setPeers((prev) => {
        const next = new Map(prev);
        next.set(peerId, pc);
        return next;
      });

      return pc;
    },
    [peers, roomId, participantId]
  );

  // -----------------------------
  // Attach local audio/video
  // -----------------------------
  const addLocalTracks = useCallback((pc, stream) => {
    const senders = pc.getSenders();

    stream.getTracks().forEach((t) => {
      const ex = senders.find((s) => s.track && s.track.kind === t.kind);
      if (ex) ex.replaceTrack(t);
      else pc.addTrack(t, stream);
    });
  }, []);

 
  // When ROOM_STATE arrives → dial others

  const dialPeersFromRoomState = useCallback(
    async (state) => {
      if (!state || !state.participants) return;

      const others = state.participants.filter(
        (p) =>
          p.id !== participantId &&
          p.participantId !== participantId &&
          p.socketId !== participantId
      );

      const stream = await ensureLocalMedia();

      for (const p of others) {
        const pid = p.id || p.participantId || p.socketId;
        if (!pid) continue;

        const pc = getOrCreatePc(pid);
        addLocalTracks(pc, stream);

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        signalingRef.current?.sendOffer(
          roomId,
          participantId,
          pid,
          pc.localDescription
        );
      }
    },
    [participantId, roomId, ensureLocalMedia, getOrCreatePc, addLocalTracks]
  );


  // MAIN JOIN FUNCTION (IMPORTANT)
 
  const join = useCallback(
    async (rid, displayName) => {
      console.log("[VC] Joining room:", rid);

      const s = await ensureSignaling();
      await ensureLocalMedia();

      setRoomId(rid);

      // ---- ROOM_STATE HANDLER ----
      const offRoom = s.on("ROOM_STATE", async (msg) => {
        console.log("[VC] ROOM_STATE:", msg);

        setParticipantId(msg.participantId);
        await dialPeersFromRoomState(msg.data || msg.roomState);
      });

      // ---- OFFER HANDLER ----
      const offOffer = s.on("OFFER", async (msg) => {
        const from = msg.participantId;
        const desc = msg.data?.sdp;
        if (!from || !desc) return;

        const pc = getOrCreatePc(from);
        const stream = await ensureLocalMedia();

        addLocalTracks(pc, stream);
        await pc.setRemoteDescription(desc);

        const ans = await pc.createAnswer();
        await pc.setLocalDescription(ans);

        signalingRef.current.sendAnswer(rid, participantId, from, ans);
      });

      // ---- ANSWER HANDLER ----
      const offAnswer = s.on("ANSWER", async (msg) => {
        const from = msg.participantId;
        const desc = msg.data?.sdp;
        const pc = peers.get(from);
        if (pc && desc) await pc.setRemoteDescription(desc);
      });

      // ---- ICE HANDLER ----
      const offIce = s.on("ICE_CANDIDATE", async (msg) => {
        const from = msg.participantId;
        const cand = msg.data?.candidate;
        const pc = peers.get(from);
        if (pc && cand) await pc.addIceCandidate(cand);
      });

      if (!s.connected) await s.connect();
      s.join(rid, displayName || "Guest");

      return () => {
        offRoom();
        offOffer();
        offAnswer();
        offIce();
      };
    },
    [
      ensureSignaling,
      ensureLocalMedia,
      dialPeersFromRoomState,
      getOrCreatePc,
      addLocalTracks,
      peers,
    ]
  );

  
  // Leave Room
 
  const leave = useCallback(() => {
    const s = signalingRef.current;

    if (s && roomId && participantId) s.leave(roomId, participantId);

    for (const pc of peers.values()) pc.close();

    setPeers(new Map());
    setRemoteStreams(new Map());

    if (localStream) {
      localStream.getTracks().forEach((t) => t.stop());
      setLocalStream(null);
    }

    setRoomId(null);
    setParticipantId(null);
  }, [roomId, participantId, peers, localStream]);


  // Mute / Unmute
 
  const toggleMute = useCallback(() => {
    if (!localStream) return;
    localStream.getAudioTracks().forEach((t) => (t.enabled = !t.enabled));
  }, [localStream]);

 
  // Hide Video / Show Video
  
  const toggleVideo = useCallback(async () => {
    if (!localStream) return;

    const active = localStream
      .getVideoTracks()
      .some((t) => t.enabled && !t.muted);

    if (active) {
      // turning off
      localStream.getVideoTracks().forEach((t) => t.stop());

      const newStream = new MediaStream(localStream.getAudioTracks());
      setLocalStream(newStream);

      for (const pc of peers.values()) {
        const sender = pc.getSenders().find(
          (s) => s.track && s.track.kind === "video"
        );
        if (sender) await sender.replaceTrack(null);
      }
    } else {
      // turning on
      const v = await navigator.mediaDevices.getUserMedia({ video: true });
      const track = v.getVideoTracks()[0];

      const newStream = new MediaStream([
        ...localStream.getAudioTracks(),
        track,
      ]);
      setLocalStream(newStream);

      for (const pc of peers.values()) {
        const sender = pc.getSenders().find(
          (s) => s.track && s.track.kind === "video"
        );
        if (sender) await sender.replaceTrack(track);
        else pc.addTrack(track, newStream);
      }
    }
  }, [localStream, peers]);

 
  // Cleanup on unmount
 
  useEffect(() => {
    leaveRef.current = leave;
  }, [leave]);

  useEffect(() => {
    return () => {
      try {
        leaveRef.current?.();
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
  };
};

export default useSfuVideoCall;
