import React, { useState, useRef } from "react";
import socket from "./socket.jsx";
import down from "../../assets/down.svg";
import add from "../../assets/add.svg"; // reserved if later adding invite
import right from "../../assets/right arrow.svg";
import { useSelector } from "react-redux";
import { useMembers } from "../useMembers";

const MembersSection = ({ onSelectChannel, onOpenChat }) => {
  const { workspaceId } = useSelector((state) => state.user);
  const { members, loading, error, fetchMembers } = useMembers(workspaceId);
  const [isCollapsed, setIsCollapsed] = useState(false);
const profile = useSelector((state) => state.user.profile);
  const toggle = () => setIsCollapsed((p) => !p);
  const pcRef = useRef(null); // single peer connection per active chat
  const localStreamRef = useRef(null);
  const [activePeer, setActivePeer] = useState(null); // target userId
  const [callStatus, setCallStatus] = useState("idle"); // idle | calling | ringing | in-call | ended | error

  // Remote audio playback for incoming media
  const remoteAudioRef = useRef(null);

  // Join a personal signaling room named by our user id
  React.useEffect(() => {
    if (!profile?._id) return;
    socket.emit("joinRoom", profile._id);
    return () => {
      socket.emit("leaveRoom", profile._id);
    };
  }, [socket, profile?._id]);

  const cleanupPeer = () => {
    try { pcRef.current?.close(); } catch (_) {}
    pcRef.current = null;
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(t => t.stop());
      localStreamRef.current = null;
    }
  };

  const startLocalMedia = async () => {
    if (localStreamRef.current) return localStreamRef.current;
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    localStreamRef.current = stream;
    return stream;
  };

  const createPeerConnection = (targetUserId) => {
    console.log('[p2p] createPeerConnection target=', targetUserId);
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
      ],
    });
    pc.onicecandidate = (e) => {
      if (e.candidate) {
        console.log('[p2p] local ICE candidate', e.candidate);
        socket.emit("ice-candidate", { to: targetUserId, candidate: e.candidate, fromUserId: profile._id });
      } else {
        console.log('[p2p] ICE gathering complete');
      }
    };
    pc.ontrack = (e) => {
      const [remoteStream] = e.streams;
      if (remoteAudioRef.current && remoteStream) {
        remoteAudioRef.current.srcObject = remoteStream;
        console.log('[p2p] remote stream received tracks=', remoteStream.getTracks().map(t=>t.kind));
      }
    };
    pc.onconnectionstatechange = () => {
      console.log('[p2p] connectionState=', pc.connectionState);
      if (pc.connectionState === "failed" || pc.connectionState === "disconnected") {
        setCallStatus("ended");
        cleanupPeer();
      }
    };
    pc.onsignalingstatechange = () => console.log('[p2p] signalingState=', pc.signalingState);
    pc.oniceconnectionstatechange = () => console.log('[p2p] iceConnectionState=', pc.iceConnectionState);
    pc.onnegotiationneeded = () => console.log('[p2p] negotiationneeded');
    return pc;
  };

  const initiatePeerChat = async (targetUserId) => {
    if (!profile?._id || !targetUserId || profile._id === targetUserId) return;
    setActivePeer(targetUserId);
    setCallStatus("calling");
    // Derive deterministic 1:1 channel id (sorted pair) and notify parent to switch chat
    const channelId = [profile._id, targetUserId].sort().join("-");
    onSelectChannel?.(channelId);
    onOpenChat?.();
    cleanupPeer();
    pcRef.current = createPeerConnection(targetUserId);
    try {
      const stream = await startLocalMedia();
      console.log('[p2p] local media tracks=', stream.getTracks().map(t=>t.kind));
      stream.getTracks().forEach(t => pcRef.current.addTrack(t, stream));
      const offer = await pcRef.current.createOffer();
      console.log('[p2p] created offer type=', offer.type, 'sdp length=', offer.sdp?.length);
      await pcRef.current.setLocalDescription(offer);
      console.log('[p2p] setLocalDescription(offer) signalingState=', pcRef.current.signalingState);
      socket.emit("call-user", { to: targetUserId, offer, fromUserId: profile._id });
      console.log('[p2p] emitted call-user to=', targetUserId);
    } catch (err) {
      console.error("Failed to start call", err);
      setCallStatus("error");
      cleanupPeer();
    }
  };

  // Socket signaling listeners
  React.useEffect(() => {
    if (!socket) return;
    const onIncoming = async ({ from, fromUserId, offer }) => {
      // Ignore if it's our own
      if (fromUserId === profile._id) return;
      setActivePeer(fromUserId);
      setCallStatus("ringing");
      // Auto switch chat to the incoming peer channel
      const channelId = [profile._id, fromUserId].sort().join("-");
      onSelectChannel?.(channelId);
      onOpenChat?.();
      cleanupPeer();
      pcRef.current = createPeerConnection(fromUserId);
      try {
        const stream = await startLocalMedia();
        console.log('[p2p] (answer) local media tracks=', stream.getTracks().map(t=>t.kind));
        stream.getTracks().forEach(t => pcRef.current.addTrack(t, stream));
        await pcRef.current.setRemoteDescription(offer);
        console.log('[p2p] setRemoteDescription(offer) signalingState=', pcRef.current.signalingState);
        const answer = await pcRef.current.createAnswer();
        console.log('[p2p] created answer type=', answer.type, 'sdp length=', answer.sdp?.length);
        await pcRef.current.setLocalDescription(answer);
        console.log('[p2p] setLocalDescription(answer) signalingState=', pcRef.current.signalingState);
        socket.emit("answer-call", { to: fromUserId, answer, fromUserId: profile._id });
        console.log('[p2p] emitted answer-call to=', fromUserId);
      } catch (err) {
        console.error("Error answering call", err);
        setCallStatus("error");
        cleanupPeer();
      }
    };
    const onAnswered = async ({ fromUserId, answer }) => {
      if (fromUserId !== activePeer) return;
      try {
        console.log('[p2p] received call-answered from', fromUserId, 'answer len=', answer?.sdp?.length);
        await pcRef.current.setRemoteDescription(answer);
        console.log('[p2p] setRemoteDescription(answer) signalingState=', pcRef.current.signalingState);
        setCallStatus("in-call");
      } catch (err) {
        console.error("Failed setting remote answer", err);
        setCallStatus("error");
      }
    };
    const onCandidate = async ({ fromUserId, candidate }) => {
      if (fromUserId !== activePeer) return;
      try { await pcRef.current?.addIceCandidate(new RTCIceCandidate(candidate)); } catch (err) {
        console.error("ICE add error", err);
      }
      console.log('[p2p] added remote candidate from', fromUserId, candidate);
    };
    const onEnded = ({ fromUserId }) => {
      if (fromUserId !== activePeer) return;
      console.log('[p2p] received end-call from', fromUserId);
      setCallStatus("ended");
      cleanupPeer();
    };
    socket.on("incoming-call", onIncoming);
    socket.on("call-answered", onAnswered);
    socket.on("ice-candidate", onCandidate);
    socket.on("call-ended", onEnded);
    return () => {
      socket.off("incoming-call", onIncoming);
      socket.off("call-answered", onAnswered);
      socket.off("ice-candidate", onCandidate);
      socket.off("call-ended", onEnded);
    };
  }, [socket, activePeer, profile?._id]);

  const endActiveCall = () => {
    if (activePeer) {
      socket.emit("end-call", { to: activePeer, fromUserId: profile._id });
      console.log('[p2p] emitted end-call to=', activePeer);
    }
    setCallStatus("ended");
    cleanupPeer();
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between text-white bg-[#200539] py-2 px-4">
        <div className="flex items-center gap-2 cursor-pointer" onClick={toggle}>
          <img
            src={isCollapsed ? right : down}
            alt="toggle arrow"
            className="mt-2.5 w-6 transition-transform"
          />
          <h3 className="text-xl">Members</h3>
        </div>
        <button
          type="button"
          onClick={fetchMembers}
          className="text-xs bg-[#BFA2E1] text-[#0E1219] px-2 py-1 rounded-md font-medium hover:opacity-90"
        >
          Refresh
        </button>
      </div>
      {!isCollapsed && (
        <div className="max-h-64 overflow-y-auto scrollbar-hide">
          <style>{`.scrollbar-hide{ -ms-overflow-style:none; scrollbar-width:none; }.scrollbar-hide::-webkit-scrollbar{display:none;}`}</style>
          {loading && (
            <p className="text-[#BCBCBC] text-sm px-4 py-2">Loading members…</p>
          )}
          {error && (
            <p className="text-red-400 text-sm px-4 py-2">Failed to load members</p>
          )}
            {members.map((m) => {
              const isSelf = m._id === profile?._id;
              const isActive = activePeer === m._id && ["calling","ringing","in-call"].includes(callStatus);
              return (
                <div
                  key={m._id}
                  className={`flex items-center justify-between text-white px-4 py-2 cursor-${isSelf ? 'default' : 'pointer'} ${isActive ? 'bg-[#3A0E70]' : 'bg-[#200539] hover:bg-[#2A0C52]'}`}
                  onClick={() => !isSelf && initiatePeerChat(m._id)}
                >
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-3 h-3 rounded-full bg-[#2DB3FF]"></span>
                    <h4 className="text-[#BCBCBC] text-base">{m.fullName || m.username}{isSelf ? ' (You)' : ''}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    {isActive && (
                      <button
                        onClick={(e) => { e.stopPropagation(); endActiveCall(); }}
                        className="text-[10px] bg-red-600 hover:bg-red-700 px-2 py-0.5 rounded"
                      >End</button>
                    )}
                    <span className="text-[12px] text-[#BCBCBC] bg-[#2F0A5C] px-2 py-0.5 rounded-md">{m.role || ""}</span>
                  </div>
                </div>
              );
            })}
            {(!loading && members.length === 0) && (
              <p className="text-[#BCBCBC] text-sm px-4 py-2">No members yet</p>
            )}
            {activePeer && (
              <div className="px-4 py-2 text-[11px] text-[#BCBCBC] italic">
                Status: {callStatus}{callStatus === 'ringing' && ' (incoming...)'}
              </div>
            )}
        </div>
      )}
      {/* Hidden audio element for remote stream playback */}
      <audio ref={remoteAudioRef} autoPlay playsInline style={{ display: 'none' }} />
    </div>
  );
};

export default MembersSection;
