import { useEffect, useRef } from "react";
import socket, { connectSocket } from "../chat/socket";
import { RTC_CONFIGURATION } from "@/config/webrtcConfig.js";

export const useVoiceCall = () => {
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteAudioRef = useRef(null);

  useEffect(() => {
    connectSocket();

    const handleOffer = async ({ from, offer }) => {
      await handleReceiveOffer(from, offer);
    };

    const handleAnswer = async ({ answer }) => {
      await peerConnectionRef.current?.setRemoteDescription(answer);
    };

    const handleIceCandidate = async ({ candidate }) => {
      if (candidate && peerConnectionRef.current) {
        try {
          await peerConnectionRef.current.addIceCandidate(candidate);
        } catch (err) {
          console.error("[VoiceCall] Error adding ICE candidate:", err);
        }
      }
    };

    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("ice-candidate", handleIceCandidate);

    return () => {
      socket.off("offer", handleOffer);
      socket.off("answer", handleAnswer);
      socket.off("ice-candidate", handleIceCandidate);
    };
  }, []);

  const setupPeerConnection = () => {
    const pc = new RTCPeerConnection(RTC_CONFIGURATION);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", { candidate: event.candidate });
      }
    };

    pc.ontrack = (event) => {
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

    try {
      const localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStreamRef.current = localStream;

      const pc = setupPeerConnection();
      localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit("offer", { to: remoteUserId, offer });
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

      socket.emit("answer", { to: from, answer });
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
  };

  return { startCall, endCall };
};

export default useVoiceCall;
