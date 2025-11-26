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
    if (peersRef.current.has(peerId)) {
      console.log("[SFU] Peer already exists for:", peerId);
      return peersRef.current.get(peerId);
    }

    console.log("[SFU] Creating new peer connection for:", peerId);

    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" }
      ],
    });

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        console.log("[SFU] Sending ICE candidate to peer:", peerId);
        signalingRef.current.sendIceCandidate(
          roomId,
          participantId,
          peerId,
          e.candidate
        );
      } else {
        console.log("[SFU] ICE gathering complete for peer:", peerId);
      }
    };

    pc.ontrack = (e) => {
      console.log("[SFU]  Remote track received from peer:", peerId, "kind:", e.track.kind, "streams:", e.streams.length);
      const stream = e.streams?.[0] || new MediaStream([e.track]);
      
      // Log track details
      stream.getTracks().forEach(track => {
        console.log("[SFU] Track:", track.kind, "enabled:", track.enabled, "readyState:", track.readyState);
      });

      setRemoteStreams((prev) => {
        const m = new Map(prev);
        m.set(peerId, stream);
        console.log("[SFU] Remote streams updated, total peers:", m.size);
        return m;
      });
    };

    pc.oniceconnectionstatechange = () => {
      console.log("[SFU] ICE connection state:", peerId, pc.iceConnectionState);
    };

    pc.onconnectionstatechange = () => {
      console.log("[SFU] Connection state:", peerId, pc.connectionState);
      if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
        console.warn("[SFU] Peer connection failed/disconnected:", peerId);
      }
      if (pc.connectionState === 'connected') {
        console.log("[SFU] Peer connected successfully:", peerId);
      }
    };

    pc.onsignalingstatechange = () => {
      console.log("[SFU] Signaling state:", peerId, pc.signalingState);
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
      console.log("[SFU] Local media tracks:", media.getTracks().map(t => `${t.kind}:${t.enabled}`));

      for (const p of msg.data.participants) {
        if (p.id === msg.participantId) continue;

        console.log("[SFU] Creating offer for existing participant:", p.id);
        const pc = createPeer(p.id);

        // Add all local tracks to peer connection
        media.getTracks().forEach((track) => {
          const sender = pc.addTrack(track, media);
          console.log("[SFU] Added track to peer:", track.kind, "enabled:", track.enabled);
        });

        const offer = await pc.createOffer();
        console.log("[SFU] Offer created for peer:", p.id, "type:", offer.type);
        await pc.setLocalDescription(offer);

        signalingRef.current.sendOffer(msg.roomId, msg.participantId, p.id, offer);
      }
    });

    s.on("offer", async (msg) => {
      const from = msg.participantId;
      console.log("[SFU] Received offer from peer:", from);
      
      const pc = createPeer(from);

      const media = await ensureLocalMedia();
      console.log("[SFU] Adding local tracks to answer peer connection");
      
      // Add all local tracks before setting remote description
      media.getTracks().forEach((track) => {
        const sender = pc.addTrack(track, media);
        console.log("[SFU] Added track to answer:", track.kind, "enabled:", track.enabled);
      });

      console.log("[SFU] Setting remote description (offer)");
      await pc.setRemoteDescription({
        type: msg.data.type,
        sdp: msg.data.sdp
      });

      console.log("[SFU] Creating answer");
      const ans = await pc.createAnswer();
      console.log("[SFU] Answer created, type:", ans.type);
      await pc.setLocalDescription(ans);

      signalingRef.current.sendAnswer(msg.roomId, participantId, from, ans);
      console.log("[SFU] Answer sent to peer:", from);
    });

    s.on("answer", async (msg) => {
      const pc = peersRef.current.get(msg.participantId);
      if (!pc) {
        console.warn("[SFU] No peer connection found for answer from:", msg.participantId);
        return;
      }
      
      console.log("[SFU] Received answer from peer:", msg.participantId);
      
      try {
        await pc.setRemoteDescription({
          type: msg.data.type,
          sdp: msg.data.sdp,
        });
        console.log("[SFU] Answer applied successfully for peer:", msg.participantId);
      } catch (err) {
        console.error("[SFU] Error setting remote description (answer):", err, "peer:", msg.participantId);
      }
    });

    s.on("ice-candidate", async (msg) => {
      const pc = peersRef.current.get(msg.participantId);
      if (!pc) {
        console.warn("[SFU] No peer connection found for ICE candidate from:", msg.participantId);
        return;
      }

      try {
        await pc.addIceCandidate({
          candidate: msg.data.candidate,
          sdpMid: msg.data.sdpMid,
          sdpMLineIndex: msg.data.sdpMLineIndex,
        });
        console.log("[SFU] ICE candidate added for peer:", msg.participantId);
      } catch (err) {
        console.error("[SFU] Error adding ICE candidate:", err, "peer:", msg.participantId);
      }
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

  const toggleMute = useCallback(() => {
    if (!localStream) return;
    const audioTrack = localStream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      console.log("[SFU] Audio track enabled:", audioTrack.enabled);
    }
  }, [localStream]);

  const toggleVideo = useCallback(() => {
    if (!localStream) return;
    const videoTrack = localStream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      console.log("[SFU] Video track enabled:", videoTrack.enabled);
    }
  }, [localStream]);

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
