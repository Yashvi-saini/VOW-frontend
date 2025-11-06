import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

export const useVoiceCall = (serverUrl) => {
  const socketRef = useRef(null);
  const peerRef = useRef(null);
  const localStreamRef = useRef(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [inCall, setInCall] = useState(false);

  useEffect(() => {
    socketRef.current = io(serverUrl);

    socketRef.current.on("incoming-call", async ({ from, offer }) => {
      peerRef.current = createPeer(false, from);
      await peerRef.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerRef.current.createAnswer();
      await peerRef.current.setLocalDescription(answer);
      socketRef.current.emit("answer-call", { to: from, answer });
      setInCall(true);
    });

    socketRef.current.on("call-answered", async ({ answer }) => {
      await peerRef.current.setRemoteDescription(new RTCSessionDescription(answer));
      setInCall(true);
    });

    socketRef.current.on("ice-candidate", ({ candidate }) => {
      peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
    });

    socketRef.current.on("call-ended", () => {
      endCall();
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [serverUrl]);

  const startCall = async (to) => {
    peerRef.current = createPeer(true, to);
    localStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
    localStreamRef.current.getTracks().forEach((track) => {
      peerRef.current.addTrack(track, localStreamRef.current);
    });

    const offer = await peerRef.current.createOffer();
    await peerRef.current.setLocalDescription(offer);
    socketRef.current.emit("call-user", { to, offer });
  };

  const createPeer = (initiator, remoteId) => {
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit("ice-candidate", { to: remoteId, candidate: event.candidate });
      }
    };

    peer.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    return peer;
  };

  const endCall = () => {
    peerRef.current?.close();
    peerRef.current = null;
    setRemoteStream(null);
    setInCall(false);
  };

  return { startCall, endCall, remoteStream, inCall };
};