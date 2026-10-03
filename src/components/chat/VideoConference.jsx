import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Play from '../../assets/Play.svg';
import Link from '../../assets/Link.svg';
import textFields from '../../assets/text_fields.svg';
import KeyIcon from '../../assets/Key.svg';
import mic from '../../assets/mic.svg';
import videocam from '../../assets/videocam.svg';
import leaveMeet from '../../assets/leavemeet.svg';
import EmojiSelector from './emojipicker.jsx';
import useSfuVideoCall from './useSfuVideoCall.js';
import api from '../../api/axiosConfig.js';

const RemoteVideoItem = ({ peerId, stream }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !stream) return;

    if (video.srcObject !== stream) {
      video.srcObject = stream;
    }

    const playPromise = video.play?.();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        if (err.name !== "AbortError") {
          console.warn("[VideoConference] Error playing remote video:", peerId, err);
        }
      });
    }
  }, [stream, peerId]);

  return (
    <div className="relative bg-gray-800 rounded-xl overflow-hidden shadow-lg">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded font-medium">
        Peer: {peerId.slice(0, 8)}
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
    join,
    leave,
    toggleMute: toggleMuteHook,
    toggleVideo: toggleVideoHook,
  } = useSfuVideoCall();

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
      await join(newRoomId, profile?.username || "Me");
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

      await join(confirmedRoomId, profile?.username || "Me");
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

  return (
    <div className="h-full bg-white text-black flex flex-col">
      
      {!isCallActive ? (
        <div className="h-full flex flex-col">
          <div className="flex-1 w-full overflow-y-auto px-4 py-6 space-y-6 flex flex-col items-center">
            
            <div
              className="flex flex-col items-center justify-center rounded-2xl bg-[#EFE7F6] px-[18px] py-6 gap-6 w-[944px] max-w-[95vw] h-[285px]"
              style={{
                boxShadow:
                  '0 -23px 25px 0 rgba(191, 162, 225, 0.17) inset, 0 -36px 30px 0 rgba(204, 180, 227, 0.15) inset, 0 -79px 40px 0 rgba(204, 180, 227, 0.10) inset, 0 2px 1px 0 rgba(204, 180, 227, 0.06), 0 4px 2px 0 rgba(204, 180, 227, 0.09), 0 8px 4px 0 rgba(204, 180, 227, 0.09), 0 16px 8px 0 rgba(204, 180, 227, 0.09), 0 32px 16px 0 rgba(204, 180, 227, 0.09)',
              }}
            >
              <div className="w-16 h-16 rounded-lg flex items-center justify-center">
                <img src={Play} alt="Start Call" className="w-8 h-8" />
              </div>

              <div className="text-center">
                <h3 className="text-[24px] font-bold text-black">Start a New Call</h3>
                <p className="text-black mt-2 text-[20px]">Instantly create a video conference.</p>
              </div>

              <div className="relative w-full max-w-sm">
                <img src={KeyIcon} className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-70" alt="Key" />

                <input
                  value={callTitle}
                  onChange={(e) => setCallTitle(e.target.value)}
                  type="text"
                  placeholder="Enter title of the call"
                  className="w-full pl-9 pr-10 py-2 rounded-md border border-[#D6DAE1] bg-white text-sm text-[#0E1219]"
                />

                <img src={textFields} className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-70" alt="Text" />
              </div>

              <button
                onClick={startCall}
                className="bg-[#5E9BFF] hover:bg-[#4a89ef] text-white font-medium py-2 px-8 rounded-md cursor-pointer transition-colors"
              >
                Start Call
              </button>
            </div>

            <div
              className="flex flex-col items-center justify-center rounded-2xl bg-[#EFE7F6] px-[18px] py-6 gap-6 w-[944px] max-w-[95vw] h-[285px]"
              style={{
                boxShadow:
                  '0 -23px 25px 0 rgba(191, 162, 225, 0.17) inset, 0 -36px 30px 0 rgba(204, 180, 227, 0.15) inset, 0 -79px 40px 0 rgba(204, 180, 227, 0.10) inset, 0 2px 1px 0 rgba(204, 180, 227, 0.06), 0 4px 2px 0 rgba(204, 180, 227, 0.09), 0 8px 4px 0 rgba(204, 180, 227, 0.09), 0 16px 8px 0 rgba(204, 180, 227, 0.09), 0 32px 16px 0 rgba(204, 180, 227, 0.09)',
              }}
            >
              <div className="w-16 h-16 rounded-lg flex items-center justify-center">
                <img src={Link} alt="Join Call" className="w-8 h-8" />
              </div>

              <div className="text-center">
                <h3 className="text-[24px] font-bold text-black">Join a Call</h3>
                <p className="text-black mt-2 text-[20px]">Enter a meeting ID or paste a link.</p>
              </div>

              <div className="relative w-full max-w-sm">
                <img src={textFields} className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-70" alt="Text" />

                <input
                  value={joinInput}
                  onChange={(e) => setJoinInput(e.target.value)}
                  type="text"
                  placeholder="Enter meeting ID"
                  className="w-full pl-9 pr-3 py-2 rounded-md border border-[#D6DAE1] bg-white text-sm text-[#0E1219]"
                />
              </div>

              <button
                onClick={joinCall}
                className="bg-[#5E9BFF] hover:bg-[#4a89ef] text-white font-medium py-2 px-8 rounded-md cursor-pointer transition-colors"
              >
                Join Now
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div ref={callContainerRef} className="h-full bg-[#1A1A2E] flex flex-col">
          <div className="flex-1 p-4">
            <div className="grid grid-cols-2 gap-4 h-full">
              
              <div className="relative bg-gray-800 rounded-xl overflow-hidden shadow-lg">
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
                  className="w-full h-full object-cover transform scale-x-[-1]"
                />
                <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded font-medium">
                  {profile?.username || "You"} (Me)
                </div>
                {isVideoOff && (
                  <div className="absolute inset-0 bg-gray-900/90 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">Camera Off</span>
                  </div>
                )}
              </div>

              {Array.from(remoteStreams.entries()).map(([peerId, mediaStream]) => (
                <RemoteVideoItem key={peerId} peerId={peerId} stream={mediaStream} />
              ))}


              {remoteStreams.size === 0 && (
                <div className="relative bg-gray-800/80 rounded-xl overflow-hidden flex flex-col items-center justify-center border-2 border-dashed border-gray-600">
                  <div className="text-white/70 text-center p-6">
                    <div className="text-lg font-medium mb-1">Waiting for others to join...</div>
                    <p className="text-sm text-gray-400">Share your Meeting ID with teammates</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#200539] border-t border-[#3D1B5F] px-6 py-3">
            <div className="flex items-center justify-center gap-5">
              <button
                onClick={() => {
                  toggleMuteHook();
                  setIsMuted((v) => !v);
                }}
                title={isMuted ? "Unmute" : "Mute"}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                  isMuted ? "bg-red-600 hover:bg-red-700" : "bg-[#35115A] hover:bg-[#481878]"
                }`}
              >
                <img src={mic} className="w-6 h-6" alt="Mic" />
              </button>

              <button
                onClick={() => {
                  toggleVideoHook();
                  setIsVideoOff((v) => !v);
                }}
                title={isVideoOff ? "Turn Video On" : "Turn Video Off"}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                  isVideoOff ? "bg-red-600 hover:bg-red-700" : "bg-[#35115A] hover:bg-[#481878]"
                }`}
              >
                <img src={videocam} className="w-6 h-6" alt="Video" />
              </button>

              <button
                onClick={endCall}
                className="inline-flex items-center justify-center bg-[#FF3B30] hover:bg-[#e03429] text-white font-medium px-5 py-2 ml-7 rounded-md cursor-pointer transition-colors gap-2"
              >
                <img src={leaveMeet} className="w-4 h-4" alt="Leave" />
                Leave Meet
              </button>
            </div>

            {roomId && (
              <div className="mt-3 flex items-center justify-center gap-3 text-white/80 text-sm">
                <span>Meeting ID: <b className="text-white select-all">{roomId}</b></span>
                <button
                  onClick={copyMeetingId}
                  className="text-xs bg-[#5E9BFF] hover:bg-[#4a89ef] text-white px-3 py-1 rounded cursor-pointer transition-colors font-medium"
                >
                  {copied ? "Copied!" : "Copy ID"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoConference;
