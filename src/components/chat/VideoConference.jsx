import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import Play from "../../assets/Play.svg";
import Link from "../../assets/Link.svg";
import textFields from "../../assets/text_fields.svg";
import KeyIcon from "../../assets/Key.svg";
import mic from "../../assets/mic.svg";
import videocam from "../../assets/videocam.svg";
import leaveMeet from "../../assets/leavemeet.svg";
import useSfuVideoCall from "./useSfuVideoCall.js";
import api from "../../api/axiosConfig.js";

const getItemLayoutClass = (tileCount) => {
  if (tileCount <= 1) {
    return "w-full max-w-3xl aspect-video max-h-[68vh]";
  }
  if (tileCount === 2) {
    return "w-full md:w-[calc(50%_-_12px)] max-w-2xl aspect-video max-h-[38vh] md:max-h-[68vh]";
  }
  if (tileCount === 3) {
    return "w-full sm:w-[calc(50%_-_10px)] lg:w-[calc(33.333%_-_12px)] max-w-xl aspect-video max-h-[32vh] sm:max-h-[44vh] lg:max-h-[62vh]";
  }
  if (tileCount === 4) {
    return "w-[calc(50%_-_8px)] sm:w-[calc(50%_-_10px)] max-w-xl aspect-video max-h-[34vh] sm:max-h-[42vh]";
  }
  if (tileCount <= 6) {
    return "w-[calc(50%_-_8px)] sm:w-[calc(33.333%_-_10px)] md:w-[calc(33.333%_-_12px)] max-w-lg aspect-video max-h-[28vh] sm:max-h-[38vh]";
  }
  if (tileCount <= 9) {
    return "w-[calc(50%_-_8px)] sm:w-[calc(33.333%_-_10px)] max-w-md aspect-video max-h-[24vh] sm:max-h-[34vh]";
  }
  if (tileCount <= 12) {
    return "w-[calc(50%_-_8px)] sm:w-[calc(33.333%_-_10px)] lg:w-[calc(25%_-_12px)] max-w-sm aspect-video max-h-[20vh] sm:max-h-[30vh]";
  }
  return "w-[calc(50%_-_6px)] sm:w-[calc(33.333%_-_8px)] md:w-[calc(25%_-_10px)] lg:w-[calc(20%_-_12px)] max-w-xs aspect-video max-h-[18vh] sm:max-h-[26vh]";
};

const RemoteVideoItem = ({ peerId, name, stream, className }) => {
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
      const active =
        vTracks.length > 0 &&
        vTracks[0].enabled &&
        !vTracks[0].muted &&
        vTracks[0].readyState === "live";
      setHasVideoTrack(active);
    };

    checkTracks();
    stream.onaddtrack = checkTracks;
    stream.onremovetrack = checkTracks;

    const vTracks = stream.getVideoTracks();
    vTracks.forEach((t) => {
      t.addEventListener("mute", checkTracks);
      t.addEventListener("unmute", checkTracks);
      t.addEventListener("ended", checkTracks);
    });

    const playPromise = video.play?.();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        if (err.name !== "AbortError") {
          console.warn("[VideoConference] Remote video play error:", peerId, err);
        }
      });
    }

    return () => {
      vTracks.forEach((t) => {
        t.removeEventListener("mute", checkTracks);
        t.removeEventListener("unmute", checkTracks);
        t.removeEventListener("ended", checkTracks);
      });
    };
  }, [stream, peerId]);

  const displayName =
    name && name.trim() && name !== "Guest" && !name.toLowerCase().startsWith("peer:")
      ? name.trim()
      : `User ${peerId.slice(0, 4)}`;

  const initial = displayName.charAt(0).toUpperCase() || "U";

  return (
    <div
      className={`relative bg-[#180A2E] rounded-xl sm:rounded-2xl overflow-hidden border border-[#3D1B5F] shadow-xl flex items-center justify-center transition-all duration-200 min-h-[6.25rem] sm:min-h-[8.125rem] ${className}`}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          hasVideoTrack ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {!hasVideoTrack && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#15072B] p-2">
          <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-tr from-[#5C0EA4] to-[#7B1FA2] text-white flex items-center justify-center text-lg sm:text-2xl md:text-3xl font-bold shadow-2xl border-2 border-[#AC92CB]/30 mb-1 sm:mb-2">
            {initial}
          </div>
          <span className="text-white/80 text-xs sm:text-sm font-medium truncate max-w-[85%] text-center">
            {displayName}
          </span>
        </div>
      )}

      {/* Participant name badge */}
      <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 bg-black/65 backdrop-blur-md text-white text-[0.6875rem] sm:text-xs md:text-sm px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl font-medium flex items-center gap-1.5 sm:gap-2 border border-white/10 shadow-lg z-10 max-w-[85%]">
        <span className="truncate">{displayName}</span>
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
  const tileCount = remoteStreams.size === 0 ? 2 : totalParticipants;
  const itemClass = getItemLayoutClass(tileCount);

  return (
    <div className="h-full w-full bg-[#0E061A] text-white flex flex-col overflow-hidden select-none">
      {!isCallActive ? (
        <div className="h-full flex flex-col overflow-y-auto px-4 py-8 items-center justify-center">
          <div className="w-full max-w-2xl space-y-6 flex flex-col items-center">
            {/* Start Card */}
            <div className="flex flex-col items-center justify-center rounded-2xl bg-[#EFE7F6] p-6 md:p-8 gap-5 w-full shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-[#5E9BFF]/20 flex items-center justify-center">
                <img src={Play} alt="Start Call" className="w-7 h-7" />
              </div>

              <div className="text-center">
                <h3 className="text-2xl font-bold text-[#0E1219]">Start a New Call</h3>
                <p className="text-gray-600 mt-1 text-sm md:text-base">
                  Instantly create a group video conference.
                </p>
              </div>

              <div className="relative w-full max-w-md">
                <img
                  src={KeyIcon}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-60"
                  alt="Key"
                />
                <input
                  value={callTitle}
                  onChange={(e) => setCallTitle(e.target.value)}
                  type="text"
                  placeholder="Call title (optional)"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-[#D6DAE1] bg-white text-sm text-[#0E1219] focus:outline-none focus:ring-2 focus:ring-[#5E9BFF]"
                />
                <img
                  src={textFields}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-60"
                  alt="Text"
                />
              </div>

              <button
                onClick={startCall}
                className="w-full max-w-md bg-[#5E9BFF] hover:bg-[#4a89ef] text-white font-semibold py-2.5 px-8 rounded-xl cursor-pointer transition-colors shadow-md active:scale-95"
              >
                Start Call Now
              </button>
            </div>

            {/* Join Card */}
            <div className="flex flex-col items-center justify-center rounded-2xl bg-[#EFE7F6] p-6 md:p-8 gap-5 w-full shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-[#5C0EA4]/20 flex items-center justify-center">
                <img src={Link} alt="Join Call" className="w-7 h-7" />
              </div>

              <div className="text-center">
                <h3 className="text-2xl font-bold text-[#0E1219]">Join Existing Call</h3>
                <p className="text-gray-600 mt-1 text-sm md:text-base">
                  Enter the meeting ID shared by your teammate.
                </p>
              </div>

              <div className="relative w-full max-w-md">
                <img
                  src={textFields}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-60"
                  alt="Text"
                />
                <input
                  value={joinInput}
                  onChange={(e) => setJoinInput(e.target.value)}
                  type="text"
                  placeholder="Paste meeting ID here"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#D6DAE1] bg-white text-sm text-[#0E1219] focus:outline-none focus:ring-2 focus:ring-[#5E9BFF]"
                />
              </div>

              <button
                onClick={joinCall}
                className="w-full max-w-md bg-[#5C0EA4] hover:bg-[#4d0c8a] text-white font-semibold py-2.5 px-8 rounded-xl cursor-pointer transition-colors shadow-md active:scale-95"
              >
                Join Call
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div ref={callContainerRef} className="h-full w-full bg-[#0E061A] flex flex-col overflow-hidden">
          {/* Call Header Top Bar */}
          <div className="shrink-0 px-3 sm:px-4 py-2.5 flex items-center justify-between border-b border-[#28114A] bg-[#120722]/90 backdrop-blur-sm z-20">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-white text-xs sm:text-sm font-semibold tracking-wide truncate max-w-[7.5rem] sm:max-w-[12.5rem] md:max-w-xs">
                {callTitle || "Group Video Call"}
              </span>
              <span className="text-[0.6875rem] sm:text-xs text-purple-300/80 bg-[#250F3E] px-2 py-0.5 rounded-full shrink-0 font-medium border border-[#431B7B]/40">
                {totalParticipants} {totalParticipants === 1 ? "participant" : "participants"}
              </span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 text-xs shrink-0">
              <span className="hidden md:inline text-white/50 text-xs">Meeting ID:</span>
              <span className="font-mono bg-[#28114A] text-purple-200 px-2 py-1 rounded-md border border-[#431B7B] text-[0.6875rem] sm:text-xs select-all max-w-[6.875rem] sm:max-w-none truncate">
                {roomId || generatedRoomId}
              </span>
              <button
                onClick={copyMeetingId}
                className="bg-[#5C0EA4] hover:bg-[#6f14c2] text-white text-[0.6875rem] sm:text-xs px-2.5 py-1 rounded-md cursor-pointer transition font-medium active:scale-95 shadow-sm"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          {/* Main Video Scrollable Viewport */}
          <div className="flex-1 min-h-0 w-full overflow-y-auto overflow-x-hidden p-2 sm:p-3 md:p-4 flex flex-col">
            <div className="m-auto w-full max-w-[100rem] flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 md:gap-3">
              {/* Local User Card */}
              <div
                className={`relative bg-[#180A2E] rounded-xl sm:rounded-2xl overflow-hidden border border-[#3D1B5F] shadow-xl flex items-center justify-center transition-all duration-200 min-h-[6.25rem] sm:min-h-[8.125rem] ${itemClass}`}
              >
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
                    isVideoOff ? "opacity-0 pointer-events-none" : "opacity-100"
                  }`}
                />

                {isVideoOff && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#15072B] p-2">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-tr from-[#5C0EA4] to-[#7B1FA2] text-white flex items-center justify-center text-lg sm:text-2xl md:text-3xl font-bold shadow-2xl border-2 border-[#AC92CB]/30 mb-1 sm:mb-2">
                      {myDisplayName.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-white/80 text-xs sm:text-sm font-medium">Camera Off</span>
                  </div>
                )}

                {/* Local user badge */}
                <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 bg-black/65 backdrop-blur-md text-white text-[0.6875rem] sm:text-xs md:text-sm px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl font-medium flex items-center gap-1.5 sm:gap-2 border border-white/10 shadow-lg z-10 max-w-[85%]">
                  <span className="truncate">{myDisplayName} (You)</span>
                  {isMuted && (
                    <span className="text-red-400 text-[0.625rem] ml-1 bg-red-500/20 px-1.5 py-0.5 rounded font-normal">
                      Muted
                    </span>
                  )}
                </div>
              </div>

              {/* Remote Participants */}
              {Array.from(remoteStreams.entries()).map(([peerId, mediaStream]) => (
                <RemoteVideoItem
                  key={peerId}
                  peerId={peerId}
                  name={participantNames.get(peerId) || "Guest"}
                  stream={mediaStream}
                  className={itemClass}
                />
              ))}

              {/* Waiting placeholder when alone */}
              {remoteStreams.size === 0 && (
                <div
                  className={`relative bg-[#180A2E]/60 rounded-xl sm:rounded-2xl overflow-hidden flex flex-col items-center justify-center border-2 border-dashed border-[#3D1B5F] p-4 sm:p-6 text-center transition-all duration-200 min-h-[6.25rem] sm:min-h-[8.125rem] ${itemClass}`}
                >
                  <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-[#5C0EA4]/20 flex items-center justify-center mb-2 sm:mb-3">
                    <img src={Link} className="w-5 h-5 sm:w-6 sm:h-6 opacity-80" alt="Link" />
                  </div>
                  <h4 className="text-sm sm:text-base md:text-lg font-semibold text-white mb-1">
                    Waiting for others to join...
                  </h4>
                  <p className="text-[0.6875rem] sm:text-xs md:text-sm text-[#AC92CB] max-w-xs mb-3 sm:mb-4 px-2">
                    Share the Meeting ID with teammates to start group call.
                  </p>
                  <button
                    onClick={copyMeetingId}
                    className="bg-[#5E9BFF] hover:bg-[#4a89ef] text-white text-xs sm:text-sm font-medium px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl transition-all shadow-md cursor-pointer active:scale-95"
                  >
                    {copied ? "Meeting ID Copied!" : "Copy Meeting ID"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Toolbar */}
          <div className="bg-[#180A2E]/95 backdrop-blur-md border-t border-[#3D1B5F] px-4 py-3 shrink-0 flex items-center justify-center gap-4 sm:gap-6 shadow-2xl z-20">
            <button
              onClick={() => {
                toggleMuteHook();
                setIsMuted((v) => !v);
              }}
              title={isMuted ? "Unmute Microphone" : "Mute Microphone"}
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95 ${
                isMuted
                  ? "bg-red-500 text-white shadow-red-500/30 ring-2 ring-red-400/50"
                  : "bg-[#2D124D] hover:bg-[#3D1969] text-white border border-[#4D237A]"
              }`}
            >
              <img src={mic} className={`w-5 h-5 sm:w-6 sm:h-6 ${isMuted ? "brightness-200" : ""}`} alt="Mic" />
            </button>

            <button
              onClick={() => {
                toggleVideoHook();
                setIsVideoOff((v) => !v);
              }}
              title={isVideoOff ? "Turn Video On" : "Turn Video Off"}
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95 ${
                isVideoOff
                  ? "bg-red-500 text-white shadow-red-500/30 ring-2 ring-red-400/50"
                  : "bg-[#2D124D] hover:bg-[#3D1969] text-white border border-[#4D237A]"
              }`}
            >
              <img
                src={videocam}
                className={`w-5 h-5 sm:w-6 sm:h-6 ${isVideoOff ? "brightness-200" : ""}`}
                alt="Video"
              />
            </button>

            <button
              onClick={endCall}
              className="inline-flex items-center justify-center bg-[#FF3B30] hover:bg-[#e03429] text-white font-semibold px-5 sm:px-6 py-2.5 rounded-2xl cursor-pointer transition-all shadow-lg shadow-red-500/25 gap-2 text-xs sm:text-sm active:scale-95"
            >
              <img src={leaveMeet} className="w-4 h-4" alt="Leave" />
              <span>Leave Call</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoConference;
