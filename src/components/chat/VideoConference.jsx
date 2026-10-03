import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Play from "../../assets/Play.svg";
import Link from "../../assets/Link.svg";
import textFields from "../../assets/text_fields.svg";
import KeyIcon from "../../assets/Key.svg";
import mic from "../../assets/mic.svg";
import videocam from "../../assets/videocam.svg";
import leaveMeet from "../../assets/leavemeet.svg";
import useSfuVideoCall from './useSfuVideoCall.js';
import api from "../../api/axiosConfig.js";

const RemoteVideoItem = ({ peerId, name, stream }) => {
  const videoRef = useRef(null);
  const [hasVideoTrack, setHasVideoTrack] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !stream) return;

    if (video.srcObject !== stream) {
      video.srcObject = stream;
    }

    const checkTracks = () => {
      const vTracks = stream.getVideoTracks();
      setHasVideoTrack(vTracks.length > 0 && vTracks[0].enabled);
    };

    checkTracks();
    stream.onaddtrack = checkTracks;
    stream.onremovetrack = checkTracks;

    const playPromise = video.play?.();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        if (err.name !== "AbortError") {
          console.warn("[VideoConference] Remote video play error:", peerId, err);
        }
      });
    }
  }, [stream, peerId]);

  const displayName = name || "Participant";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="relative bg-[#180A2E] rounded-2xl overflow-hidden border border-[#3D1B5F] shadow-2xl flex items-center justify-center w-full h-full min-h-[200px] sm:min-h-[260px] md:min-h-[300px]">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          hasVideoTrack ? "opacity-100" : "opacity-0"
        }`}
      />

      {!hasVideoTrack && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#15072B]">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-tr from-[#5C0EA4] to-[#7B1FA2] text-white flex items-center justify-center text-3xl md:text-4xl font-bold shadow-2xl border-2 border-[#AC92CB]/30 mb-2">
            {initial}
          </div>
          <span className="text-white/80 text-sm font-medium">{displayName}</span>
        </div>
      )}

      {/* Name badge */}
      <div className="absolute bottom-3 left-3 bg-black/65 backdrop-blur-md text-white text-xs md:text-sm px-3 py-1.5 rounded-xl font-medium flex items-center gap-2 border border-white/10 shadow-lg z-10">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span className="max-w-[130px] sm:max-w-[180px] truncate">{displayName}</span>
      </div>
    </div>
  );
};

const VideoConference = () => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [copied, setCopied] = useState(false);
  const callContainerRef = useRef(null);

  const [generatedRoomId, setGeneratedRoomId] = useState("");
  const [callTitle, setCallTitle] = useState("");
  const [joinInput, setJoinInput] = useState("");
  const localVideoRef = useRef(null);
  const profile = useSelector((state) => state.user.profile);

  const {
    roomId,
    localStream,
    remoteStreams,
    participantNames,
    join,
    leave,
    toggleMute: toggleMuteHook,
    toggleVideo: toggleVideoHook,
  } = useSfuVideoCall();

  const myDisplayName = profile?.username || profile?.fullName || "You";

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      if (localVideoRef.current.srcObject !== localStream) {
        localVideoRef.current.srcObject = localStream;
        localVideoRef.current.play?.().catch((err) => {
          console.error("[VideoConference] Error playing local video:", err);
        });
      }
    }
  }, [localStream, isCallActive]);

  useEffect(() => {
    return () => {
      leave();
    };
  }, [leave]);

  const startCall = async () => {
    try {
      const title = callTitle.trim();
      const res = await api.post("/videochat/start", { name: title || undefined });

      const newRoomId = res.data?.roomId;
      if (!newRoomId) {
        return alert("Failed to create call");
      }

      setGeneratedRoomId(newRoomId);
      await join(newRoomId, myDisplayName);
      setIsCallActive(true);
    } catch (err) {
      console.error("[VideoConference] Create call error:", err);
      const msg =
        err.response?.data?.error ||
        err.response?.data?.msg ||
        err.message ||
        "Unable to create meeting.";
      alert(`Unable to create meeting: ${msg}`);
    }
  };

  const joinCall = async () => {
    const targetRoomId = joinInput.trim();
    if (!targetRoomId) return alert("Enter meeting ID");

    try {
      const res = await api.post("/videochat/join", { roomId: targetRoomId });
      const confirmedRoomId = res.data?.roomId || targetRoomId;

      await join(confirmedRoomId, myDisplayName);
      setIsCallActive(true);
    } catch (err) {
      console.error("[VideoConference] Join call error:", err);
      const msg =
        err.response?.data?.error ||
        err.response?.data?.msg ||
        err.message ||
        "Error joining room.";
      alert(`Error joining room: ${msg}`);
    }
  };

  const endCall = () => {
    leave();
    setIsCallActive(false);
    setGeneratedRoomId("");
    setCallTitle("");
    setJoinInput("");
    setIsMuted(false);
    setIsVideoOff(false);
  };

  const copyMeetingId = () => {
    const idToCopy = roomId || generatedRoomId;
    if (idToCopy) {
      navigator.clipboard.writeText(idToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const totalParticipants = 1 + remoteStreams.size;
  const gridClasses =
    totalParticipants === 1
      ? "grid grid-cols-1 max-w-3xl w-full h-full max-h-[75vh] mx-auto"
      : totalParticipants === 2
      ? "grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 w-full h-full max-h-[78vh] max-w-5xl mx-auto"
      : totalParticipants <= 4
      ? "grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 w-full h-full max-h-[82vh] max-w-5xl mx-auto"
      : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 w-full h-full max-h-[85vh] mx-auto";

  return (
    <div className="h-full w-full bg-[#0E061A] text-white flex flex-col overflow-hidden">
      {!isCallActive ? (
        <div className="h-full flex flex-col overflow-y-auto px-4 py-8 items-center justify-center">
          <div className="w-full max-w-2xl space-y-6 flex flex-col items-center">
            {/* Start Card */}
            <div
              className="flex flex-col items-center justify-center rounded-2xl bg-[#EFE7F6] p-6 md:p-8 gap-5 w-full shadow-xl"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#5E9BFF]/20 flex items-center justify-center">
                <img src={Play} alt="Start Call" className="w-7 h-7" />
              </div>

              <div className="text-center">
                <h3 className="text-2xl font-bold text-[#0E1219]">Start a New Call</h3>
                <p className="text-gray-600 mt-1 text-sm md:text-base">Instantly create a group video conference.</p>
              </div>

              <div className="relative w-full max-w-md">
                <img src={KeyIcon} className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-60" alt="Key" />
                <input
                  value={callTitle}
                  onChange={(e) => setCallTitle(e.target.value)}
                  type="text"
                  placeholder="Call title (optional)"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-[#D6DAE1] bg-white text-sm text-[#0E1219] focus:outline-none focus:ring-2 focus:ring-[#5E9BFF]"
                />
                <img src={textFields} className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-60" alt="Text" />
              </div>

              <button
                onClick={startCall}
                className="w-full max-w-md bg-[#5E9BFF] hover:bg-[#4a89ef] text-white font-semibold py-2.5 px-8 rounded-xl cursor-pointer transition-colors shadow-md"
              >
                Start Call Now
              </button>
            </div>

            {/* Join Card */}
            <div
              className="flex flex-col items-center justify-center rounded-2xl bg-[#EFE7F6] p-6 md:p-8 gap-5 w-full shadow-xl"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#5C0EA4]/20 flex items-center justify-center">
                <img src={Link} alt="Join Call" className="w-7 h-7" />
              </div>

              <div className="text-center">
                <h3 className="text-2xl font-bold text-[#0E1219]">Join Existing Call</h3>
                <p className="text-gray-600 mt-1 text-sm md:text-base">Enter the meeting ID shared by your teammate.</p>
              </div>

              <div className="relative w-full max-w-md">
                <img src={textFields} className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-60" alt="Text" />
                <input
                  value={joinInput}
                  onChange={(e) => setJoinInput(e.target.value)}
                  type="text"
                  placeholder="Paste meeting ID here"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#D6DAE1] bg-white text-sm text-[#0E1219] focus:outline-none focus:ring-2 focus:ring-[#5C0EA4]"
                />
              </div>

              <button
                onClick={joinCall}
                className="w-full max-w-md bg-[#5C0EA4] hover:bg-[#4d0c8a] text-white font-semibold py-2.5 px-8 rounded-xl cursor-pointer transition-colors shadow-md"
              >
                Join Call
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div ref={callContainerRef} className="h-full w-full bg-[#0E061A] flex flex-col overflow-hidden">
          {/* Main Video Grid */}
          <div className="flex-1 p-2 sm:p-4 md:p-6 overflow-y-auto flex items-center justify-center">
            <div className={gridClasses}>
              {/* Local User Card */}
              <div className="relative bg-[#180A2E] rounded-2xl overflow-hidden border border-[#3D1B5F] shadow-2xl flex items-center justify-center w-full h-full min-h-[200px] sm:min-h-[260px] md:min-h-[300px]">
                <video
                  ref={(el) => {
                    localVideoRef.current = el;
                    if (el && localStream && el.srcObject !== localStream) {
                      el.srcObject = localStream;
                      el.play?.().catch(() => {});
                    }
                  }}
                  autoPlay
                  muted
                  playsInline
                  className={`w-full h-full object-cover transform scale-x-[-1] transition-opacity duration-300 ${
                    isVideoOff ? "opacity-0" : "opacity-100"
                  }`}
                />

                {isVideoOff && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#15072B]">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-tr from-[#5C0EA4] to-[#7B1FA2] text-white flex items-center justify-center text-3xl md:text-4xl font-bold shadow-2xl border-2 border-[#AC92CB]/30 mb-2">
                      {myDisplayName.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-white/80 text-sm font-medium">Camera Off</span>
                  </div>
                )}

                {/* Local user badge */}
                <div className="absolute bottom-3 left-3 bg-black/65 backdrop-blur-md text-white text-xs md:text-sm px-3 py-1.5 rounded-xl font-medium flex items-center gap-2 border border-white/10 shadow-lg z-10">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="max-w-[130px] sm:max-w-[180px] truncate">{myDisplayName} (You)</span>
                </div>
              </div>

              {/* Remote Participants */}
              {Array.from(remoteStreams.entries()).map(([peerId, mediaStream]) => (
                <RemoteVideoItem
                  key={peerId}
                  peerId={peerId}
                  name={participantNames.get(peerId) || "Guest"}
                  stream={mediaStream}
                />
              ))}

              {/* Waiting placeholder when alone */}
              {remoteStreams.size === 0 && (
                <div className="relative bg-[#180A2E]/60 rounded-2xl overflow-hidden flex flex-col items-center justify-center border-2 border-dashed border-[#3D1B5F] p-6 text-center w-full h-full min-h-[200px] sm:min-h-[260px] md:min-h-[300px]">
                  <div className="w-14 h-14 rounded-full bg-[#5C0EA4]/20 flex items-center justify-center mb-3">
                    <img src={Link} className="w-6 h-6 opacity-80" alt="Link" />
                  </div>
                  <h4 className="text-base md:text-lg font-semibold text-white mb-1">Waiting for others to join...</h4>
                  <p className="text-xs md:text-sm text-[#AC92CB] max-w-xs mb-4">
                    Share your Meeting ID with teammates to start group conversation.
                  </p>
                  <button
                    onClick={copyMeetingId}
                    className="bg-[#5E9BFF] hover:bg-[#4a89ef] text-white text-xs md:text-sm font-medium px-4 py-2 rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    {copied ? "Meeting ID Copied!" : "Copy Meeting ID"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Toolbar */}
          <div className="bg-[#180A2E]/95 backdrop-blur-md border-t border-[#3D1B5F] px-4 py-3 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xl z-20">
            {/* Meeting ID pill */}
            <div className="flex items-center gap-2 order-2 sm:order-1 text-xs text-purple-200">
              <span className="hidden md:inline text-white/60">Meeting ID:</span>
              <span className="font-mono bg-[#28114A] px-2.5 py-1 rounded-lg border border-[#431B7B] select-all truncate max-w-[150px] sm:max-w-none">
                {roomId || generatedRoomId}
              </span>
              <button
                onClick={copyMeetingId}
                className="bg-[#5C0EA4] hover:bg-[#6f14c2] text-white text-xs px-2.5 py-1 rounded-lg cursor-pointer transition font-medium"
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            {/* Main Action Buttons */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 order-1 sm:order-2">
              <button
                onClick={() => {
                  toggleMuteHook();
                  setIsMuted((v) => !v);
                }}
                title={isMuted ? "Unmute Microphone" : "Mute Microphone"}
                className={`w-11 h-11 md:w-12 md:h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-md ${
                  isMuted
                    ? "bg-red-500 text-white shadow-red-500/30"
                    : "bg-[#2D124D] hover:bg-[#3D1969] text-white border border-[#4D237A]"
                }`}
              >
                <img src={mic} className={`w-5 h-5 md:w-6 md:h-6 ${isMuted ? "brightness-200" : ""}`} alt="Mic" />
              </button>

              <button
                onClick={() => {
                  toggleVideoHook();
                  setIsVideoOff((v) => !v);
                }}
                title={isVideoOff ? "Turn Video On" : "Turn Video Off"}
                className={`w-11 h-11 md:w-12 md:h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-md ${
                  isVideoOff
                    ? "bg-red-500 text-white shadow-red-500/30"
                    : "bg-[#2D124D] hover:bg-[#3D1969] text-white border border-[#4D237A]"
                }`}
              >
                <img src={videocam} className={`w-5 h-5 md:w-6 md:h-6 ${isVideoOff ? "brightness-200" : ""}`} alt="Video" />
              </button>

              <button
                onClick={endCall}
                className="inline-flex items-center justify-center bg-[#FF3B30] hover:bg-[#e03429] text-white font-semibold px-4 md:px-6 py-2.5 rounded-2xl cursor-pointer transition-all shadow-lg shadow-red-500/25 gap-2 text-xs md:text-sm"
              >
                <img src={leaveMeet} className="w-4 h-4" alt="Leave" />
                <span>Leave</span>
              </button>
            </div>

            {/* Participant count pill */}
            <div className="hidden sm:flex items-center gap-2 order-3 text-xs text-white/70">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>{totalParticipants} {totalParticipants === 1 ? "participant" : "participants"}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoConference;
