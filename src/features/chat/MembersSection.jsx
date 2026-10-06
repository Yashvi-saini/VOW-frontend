import React, { useState, useRef } from "react";
import socket from "./socket.jsx";
import down from "@/assets/down.svg";
import right from "@/assets/right arrow.svg";
import { useDispatch, useSelector } from "react-redux";
import { useMembers } from "@/hooks/useMembers";
import { setUserProfile } from "@/features/auth";
import { getProfileInfo } from "@/api/profileapi";
import { getWorkspaceForUsers } from "@/api/authApi";

const MembersSection = ({ onSelectChannel, onOpenChat, onStartDM, unreadDMs = {} }) => {

  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user);
  const { workspaceId, profile } = userState;
  const { members, loading, error, fetchMembers } = useMembers(workspaceId);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const storedId = (() => {
    try { return localStorage.getItem('selfUserId'); } catch (_) { return null; }
  })();
  const selfUserId = profile?._id || profile?.id || userState.userId || userState.id || storedId || null;

  React.useEffect(() => {
    let cancelled = false;
    const primeProfile = async () => {
      if (selfUserId) return; 
      try {
        const res = await getProfileInfo();
        const data = res?.data?.data;
        if (!cancelled && data) {
          dispatch(setUserProfile(data));
          const id = data?._id || data?.id || null;
          if (id) {
            try { localStorage.setItem('selfUserId', id); } catch (_) {}
          }
      return;
    }
    socket.emit('joinRoom', selfUserId);
        socket.emit('ice-candidate', {
          toUserId: targetUserId,
          candidate: event.candidate,
          fromUserId: selfUserId,
        });
      } else {
      }
    };

    pc.ontrack = (event) => {
      const [stream] = event.streams;
      const remoteStream = stream || (() => {
        const s = new MediaStream();
        s.addTrack(event.track);
        return s;
      })();
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = remoteStream;
      }
      const tracks = remoteStream.getTracks ? remoteStream.getTracks() : [event.track];
    };

    pc.onconnectionstatechange = () => {
        cleanupPeer();
      }
    };
    pc.onsignalingstatechange = () =>    return pc;
  };

  const initiatePeerChat = async (targetUserId) => {
      return;
    }
    if (!targetUserId) {
      console.warn('[p2p] abort: no targetUserId');
      return;
    }
    if (selfUserId === targetUserId) {
      console.warn('[p2p] abort: clicked self');
      return;
    }
    setActivePeer(targetUserId);
    setCallStatus("calling");
   
    let channelId = null;
    try {
      const res = await getWorkspaceForUsers(selfUserId, targetUserId);
      const data = res?.data || {};
      channelId = data.channelId
        || data.channel?._id
        || data.workspace?.channelId
        || data.workspaceId
        || data.workspace?._id
        || null;
      if (!channelId) {
        
        channelId = [selfUserId, targetUserId].sort().join("-");
        console.warn('[p2p] using synthetic DM channel id; server did not return a channelId');
      } else {
return; }
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
  }, [socket, activePeer, selfUserId]);

  const endActiveCall = () => {
    if (activePeer) {
      socket.emit("end-call", { to: activePeer, fromUserId: selfUserId });
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
          {!selfUserId && (
            <p className="text-[0.6875rem] text-yellow-300 bg-[#3A0E70] px-4 py-1">Loading your identity… please wait a moment before starting a call.</p>
          )}
          {loading && (
            <p className="text-[#BCBCBC] text-sm px-4 py-2">Loading members…</p>
          )}
          {error && (
            <p className="text-red-400 text-sm px-4 py-2">Failed to load members</p>
          )}
            {members.map((m) => {
              const isSelf = m._id === selfUserId;
              const isActive = activePeer === m._id && ["calling","ringing","in-call"].includes(callStatus);
              const unreadCount = unreadDMs[m._id] || 0;
              if (!m._id) {
                console.warn('[p2p] member missing _id', m);
              }
              return (
                <div
                  key={m._id}
                  className={`flex items-center justify-between text-white px-4 py-2 ${isActive ? 'bg-[#3A0E70]' : 'bg-[#200539] hover:bg-[#2A0C52]'}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-3 h-3 rounded-full bg-[#2DB3FF]"></span>
                    <h4 className="text-[#BCBCBC] text-base">{m.fullName || m.username}{isSelf ? ' (You)' : ''}</h4>
                    {unreadCount > 0 && (
                      <span className="inline-flex items-center justify-center min-w-[1.125rem] h-[1.125rem] bg-red-500 text-white text-[0.625rem] font-bold rounded-full px-1">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {!isSelf && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onStartDM?.(m._id, m.username || m.fullName);
                        }}
                        className="text-[0.625rem] bg-[#5E9BFF] hover:bg-[#4A8AEE] px-2 py-0.5 rounded font-medium"
                      >
                        DM
                      </button>
                    )}
                    {isActive && (
                      <button
                        onClick={(e) => { e.stopPropagation(); endActiveCall(); }}
                        className="text-[0.625rem] bg-red-600 hover:bg-red-700 px-2 py-0.5 rounded"
                      >End</button>
                    )}
                    <span className="text-[0.75rem] text-[#BCBCBC] bg-[#2F0A5C] px-2 py-0.5 rounded-md">{m.role || ""}</span>
                  </div>
                </div>
              );
            })}
            {(!loading && members.length === 0) && (
              <p className="text-[#BCBCBC] text-sm px-4 py-2">No members yet</p>
            )}
            {activePeer && (
              <div className="px-4 py-2 text-[0.6875rem] text-[#BCBCBC] italic">
                Status: {callStatus}{callStatus === 'ringing' && ' (incoming...)'}
              </div>
            )}
        </div>
      )}
      
      <audio ref={remoteAudioRef} autoPlay playsInline style={{ display: 'none' }} />
    </div>
  );
};

export default MembersSection;
