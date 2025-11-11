import { useEffect, useRef } from "react";
export const useVoiceCall = (SOCKET_URL) => {
  const socketRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteAudioRef = useRef(null);

  useEffect(() => {
    if (!SOCKET_URL) return;
    import("socket.io-client").then(({ io }) => {
      socketRef.current = io(SOCKET_URL, {
        transports: ["websocket"],
        withCredentials: true,
      });

      socketRef.current.on("connect", () => {
        console.log("[VoiceCall] Connected to signaling server");
      });

      socketRef.current.on("offer", async ({ from, offer }) => {
        console.log("[VoiceCall] Received offer from:", from);
        await handleReceiveOffer(from, offer);
      });

      socketRef.current.on("answer", async ({ from, answer }) => {
        console.log("[VoiceCall] Received answer from:", from);
        await peerConnectionRef.current?.setRemoteDescription(answer);
      });

      socketRef.current.on("ice-candidate", async ({ candidate }) => {
        if (candidate && peerConnectionRef.current) {
          try {
            await peerConnectionRef.current.addIceCandidate(candidate);
          } catch (err) {
            console.error("[VoiceCall] Error adding ICE candidate:", err);
          }
        }
      });
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [SOCKET_URL]);

  const setupPeerConnection = () => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current?.emit("ice-candidate", { candidate: event.candidate });
      }
    };

    pc.ontrack = (event) => {
      console.log("[VoiceCall] Remote track received");
      if (!remoteAudioRef.current) {
        const audio = document.createElement("audio");
        audio.autoplay = true;
        audio.srcObject = event.streams[0];
        document.body.appendChild(audio);
        remoteAudioRef.current = audio;
      }
    };

    peerConnectionRef.current = pc;
    return pc;
  };

  const startCall = async (remoteUserId) => {
    console.log("[VoiceCall] Starting call to:", remoteUserId);

    try {
      const localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStreamRef.current = localStream;

      const pc = setupPeerConnection();
      localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socketRef.current?.emit("offer", { to: remoteUserId, offer });
    } catch (err) {
      console.error("[VoiceCall] Error starting call:", err);
    }
  };

  const handleReceiveOffer = async (from, offer) => {
    try {
      const pc = setupPeerConnection();
      const localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStreamRef.current = localStream;
      localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

      await pc.setRemoteDescription(offer);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socketRef.current?.emit("answer", { to: from, answer });
    } catch (err) {
      console.error("[VoiceCall] Error handling offer:", err);
    }
  };

  const endCall = () => {
    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
    }
    if (remoteAudioRef.current) {
      remoteAudioRef.current.remove();
      remoteAudioRef.current = null;
    }
    console.log("[VoiceCall] Call ended");
  };

  return { startCall, endCall };
};
