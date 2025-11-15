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
      audio: true,
      video: true,
    });
    setLocalStream(stream);
    return stream;
  }, [localStream]);

 
  const syncPeersState = useCallback(() => {
    setPeersState(new Map(peersRef.current));
  }, []);

  const createPeer = useCallback(
    (peerId) => {
   
      const existing = peersRef.current.get(peerId);
      if (existing) return existing;

      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      pc.onicecandidate = (e) => {
        if (e.candidate) {
          try {
            signalingRef.current?.sendIceCandidate(
              roomId,
              participantId,
              peerId,
              e.candidate
            );
          } catch (err) {
            console.warn("[HOOK] sendIceCandidate failed", err);
          }
        }
      };

      pc.ontrack = (e) => {
        // first stream is typical
        const stream = e.streams && e.streams[0] ? e.streams[0] : null;
        if (stream) {
          setRemoteStreams((prev) => {
            const m = new Map(prev);
            m.set(peerId, stream);
            return m;
          });
        }
      };

      // When connection state changes log it (debug)
      pc.onconnectionstatechange = () => {
        console.log(`[HOOK] pc(${peerId}) connectionState`, pc.connectionState);
      };

      peersRef.current.set(peerId, pc);
      syncPeersState();
      return pc;
    },
    [roomId, participantId, syncPeersState]
  );

  // register signaling handlers only once per hook lifecycle
  const registerHandlersOnce = useCallback(
    (s, ridRef) => {
      if (handlersRegisteredRef.current) return;
      handlersRegisteredRef.current = true;

      s.on("room-state", async (msg) => {
        console.log("[HOOK] Got room-state", msg);
        const myId = msg.participantId;
        if (myId) {
          setParticipantId(myId);
          // store in signaling client if it doesn't auto store
          if (!s.participantId) s.participantId = myId;
        }

        // enable publishing
        s.send({
          type: "start-publish",
          roomId: msg.roomId || ridRef.current,
          participantId: myId,
        });

        // create offers to existing participants (except self)
        const media = await ensureLocalMedia();
        const others = (msg.data && msg.data.participants) || [];
        for (const p of others) {
          if (!p || p.id === myId) continue;
          const pc = createPeer(p.id);

          // add local tracks only if sender not already added
          const senders = pc.getSenders().map((s) => s.track).filter(Boolean);
          const tracksToAdd = media.getTracks().filter((t) => !senders.includes(t));
          tracksToAdd.forEach((t) => pc.addTrack(t, media));

          try {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            s.sendOffer(msg.roomId || ridRef.current, myId, p.id, offer);
          } catch (err) {
            console.error("[HOOK] createOffer/sendOffer failed for", p.id, err);
          }
        }
      });

      s.on("participant-joined", (msg) => {
        console.log("[HOOK] NEW peer joined", msg.participantId);
 
      });

      s.on("offer", async (msg) => {
        console.log("[HOOK] OFFER received", msg);
        try {
          const from = msg.participantId;
          if (!from) {
            console.warn("[HOOK] offer missing from participantId");
            return;
          }

          const media = await ensureLocalMedia();
          const pc = peersRef.current.get(from) || createPeer(from);

          // add local tracks only once:
          const senders = pc.getSenders().map((s) => s.track).filter(Boolean);
          const tracksToAdd = media.getTracks().filter((t) => !senders.includes(t));
          tracksToAdd.forEach((t) => pc.addTrack(t, media));

          // msg.data.sdp is expected to be a raw SDP string
          const remoteDesc = {
            type: "offer",
            sdp: msg.data && msg.data.sdp ? msg.data.sdp : msg.data,
          };
          await pc.setRemoteDescription(remoteDesc);

          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);

          // send answer back
          signalingRef.current.sendAnswer(
            msg.roomId || roomId,
            participantId,
            from,
            answer
          );
        } catch (err) {
          console.error("[HOOK] offer handler error", err);
        }
      });

      s.on("answer", async (msg) => {
        console.log("[HOOK] ANSWER received", msg);
        try {
          const from = msg.participantId;
          const pc = peersRef.current.get(from);
          if (!pc) {
            console.warn("[HOOK] answer for unknown pc", from);
            return;
          }
          const remoteDesc = {
            type: "answer",
            sdp: msg.data && msg.data.sdp ? msg.data.sdp : msg.data,
          };
          await pc.setRemoteDescription(remoteDesc);
        } catch (err) {
          console.error("[HOOK] answer handler error", err);
        }
      });

      s.on("ice-candidate", (msg) => {
        try {
          const from = msg.participantId;
          const pc = peersRef.current.get(from);
          if (!pc) {
            console.warn("[HOOK] ice-candidate for unknown pc", from);
            return;
          }
          const d = msg.data || {};
          
          const candidateObj = {
            candidate: d.candidate,
            sdpMid: d.sdpMid,
            sdpMLineIndex: d.sdpMLineIndex,
          };
          
          pc.addIceCandidate(candidateObj).catch((e) => {
            console.warn("[HOOK] addIceCandidate failed", e);
          });
        } catch (err) {
          console.error("[HOOK] ice-candidate handler error", err);
        }
      });

      s.on("error", (err) => {
        console.warn("[SFU] signaling error", err);
      });
    },
    [createPeer, ensureLocalMedia, participantId, roomId]
  );

  const join = useCallback(
    async (rid, name) => {
      const s = await ensureSignaling();
    
      setRoomId(rid);
      const ridRef = { current: rid }; 
  
      registerHandlersOnce(s, ridRef);
      await ensureLocalMedia();
      s.join(rid, name);

    },
    [ensureSignaling, ensureLocalMedia, registerHandlersOnce]
  );

  const leave = useCallback(() => {
    // send leave if possible
    try {
      if (signalingRef.current && roomId && participantId) {
        signalingRef.current.leave(roomId, participantId);
        signalingRef.current.send({
          type: "stop-publish",
          roomId,
          participantId,
        });
      }
    } catch (err) {
      console.warn("[HOOK] leave signaling failed", err);
    }

    // close peer connections
    peersRef.current.forEach((pc) => {
      try {
        pc.getSenders().forEach((s) => {
          try {
            if (s.track) s.track.stop?.();
          } catch {}
        });
        pc.close();
      } catch {}
    });
    peersRef.current.clear();
    syncPeersState();

    setRemoteStreams(new Map());
    if (localStream) {
      localStream.getTracks().forEach((t) => t.stop());
    }
    setLocalStream(null);
    setRoomId(null);
    setParticipantId(null);
    handlersRegisteredRef.current = false;
   
    try {
    
      signalingRef.current = null;
    } catch {}
  }, [localStream, syncPeersState, roomId, participantId]);
  useEffect(() => {
    return () => {
      leave();
    };
 
  }, []);

  return {
    roomId,
    participantId,
    localStream,
    remoteStreams,
    join,
    leave,
    toggleMute: () => {
      localStream?.getAudioTracks().forEach((t) => (t.enabled = !t.enabled));
    },
    toggleVideo: () => {
      const v = localStream?.getVideoTracks()[0];
      if (v) v.enabled = !v.enabled;
    },
    _peersMap: peersRef.current,
  };
};

export default useSfuVideoCall;
