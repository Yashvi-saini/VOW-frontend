import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Play from '../../assets/Play.svg';
import Link from '../../assets/Link.svg';
import textFields from '../../assets/text_fields.svg';
import KeyIcon from '../../assets/Key.svg';
import mic from '../../assets/mic.svg';
import videocam from '../../assets/videocam.svg';

const VideoConference = () => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [stream, setStream] = useState(null);
  const [participants] = useState([
    { id: 1, name: 'John Doe', avatar: null },
    { id: 2, name: 'Jane Smith', avatar: null },
    { id: 3, name: 'Mike Johnson', avatar: null }
  ]);
  const [callTitle, setCallTitle] = useState("");
  const [joinInput, setJoinInput] = useState("");
  
  const localVideoRef = useRef(null);
  const workspaceName = useSelector((state) => state.user.workspaceName);

  const startCall = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      setStream(mediaStream);
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = mediaStream;
      }

      setIsCallActive(true);
    } catch (error) {
      console.error('Error accessing camera/microphone:', error);
      alert('Unable to access camera/microphone. Please check permissions.');
    }
  };

  const endCall = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    setIsCallActive(false);
    setIsMuted(false);
    setIsVideoOff(false);
  };

  const toggleMute = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = isMuted;
        setIsMuted(!isMuted);
      }
    }
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = isVideoOff;
        setIsVideoOff(!isVideoOff);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="h-full bg-white text-black flex flex-col">
      {!isCallActive ? (
        <div className="h-full flex flex-col">
          
          <div className="flex-1 w-full overflow-y-auto px-4 py-6 space-y-6 flex flex-col items-center">
            {/*  New Call Card */}
            <div className="flex flex-col items-center justify-center rounded-2xl bg-[#EEF7F6] px-[18px] py-6 gap-6 w-[944px] max-w-[95vw] h-[285px]" style={{ boxShadow: '0 -23px 25px 0 rgba(191, 191, 191, 0.25)' }}>
              <div className="w-16 h-16  rounded-lg flex items-center justify-center "><img src={Play} alt="Start Call" className="w-8 h-8" /></div>
              <div className="text-center">
                <h3 className="text-[20px] font-semibold text-[#0E1219]">Start a New Call</h3>
                <p className="text-[#4D4D56] mt-2 text-[14px]">Instantly create a video conference for your team or workspace.</p>
              </div>
              <div className="relative w-full max-w-sm">
                <img src={KeyIcon} alt="Title" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-70" />
                <input
                  value={callTitle}
                  onChange={(e) => setCallTitle(e.target.value)}
                  type="text"
                  placeholder="Enter title of the call"
                  className="w-full pl-9 pr-10 py-2 rounded-md border border-[#D6DAE1] bg-white text-sm text-[#0E1219] placeholder:text-[#8B90A0] focus:outline-none focus:ring-2 focus:ring-[#337BFF]"
                />
                <img src={textFields} alt="Text" className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-70" />
              </div>
              <button
                onClick={startCall}
                className="bg-[#5E9BFF]  text-white font-medium py-2 px-8 rounded-md"
              >
                Start Call
              </button>
            </div>

            {/* Join a Call Card */}
            <div className="flex flex-col items-center justify-center rounded-2xl bg-[#EEF7F6] px-[18px] py-6 gap-6 w-[944px] max-w-[95vw] h-[285px]" style={{ boxShadow: '0 -23px 25px 0 rgba(191, 191, 191, 0.25)' }}>
              <div className="w-16 h-16  rounded-lg flex items-center justify-center"><img src={Link} alt="Join Call" className="w-8 h-8" /></div>
              <div className="text-center">
                <h3 className="text-[20px] font-semibold text-[#0E1219]">Join a Call</h3>
                <p className="text-[#4D4D56] mt-2 text-[14px]">Enter a meeting ID or paste a link to join.</p>
              </div>
              <div className="relative w-full max-w-sm">
                <img src={textFields} alt="Input" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-70" />
                <input
                  value={joinInput}
                  onChange={(e) => setJoinInput(e.target.value)}
                  type="text"
                  placeholder="Enter meeting ID or link"
                  className="w-full pl-9 pr-3 py-2 rounded-md border border-[#D6DAE1] bg-white text-sm text-[#0E1219] placeholder:text-[#8B90A0] focus:outline-none focus:ring-2 focus:ring-[#8E3DFF]"
                />
              </div>
              <button
                onClick={startCall}
                className="bg-[#5E9BFF]  text-white font-medium py-2 px-8 rounded-md"
              >
                Join Now
              </button>
            </div>
          </div>
        </div>
      ) : (
       
        <div className="h-full bg-gray-900 flex flex-col">
          {/* Main video grid */}
          <div className="flex-1 p-4">
            <div className="grid grid-cols-2 gap-4 h-full">
              {/* Your video */}
              <div className="relative bg-gray-800 rounded-xl overflow-hidden">
                {!isVideoOff ? (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover transform scale-x-[-1]"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">You</span>
                    </div>
                  </div>
                )}
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 px-3 py-1 rounded-lg">
                  <span className="text-sm font-medium text-white">You {isMuted && '(Muted)'}</span>
                </div>
                {isMuted && (
                  <div className="absolute top-4 right-4 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                    </svg>
                  </div>
                )}
              </div>

              {/* Other participants */}
              {participants.slice(0, 3).map((participant) => (
                <div key={participant.id} className="relative bg-gray-800 rounded-xl overflow-hidden">
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">
                        {participant.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 px-3 py-1 rounded-lg">
                    <span className="text-sm font-medium text-white">{participant.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white border-t border-gray-200 px-6 py-4">
            <div className="flex items-center justify-center gap-6">
              {/* Mute button */}
              <button
                onClick={toggleMute}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  isMuted 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                <img 
                  src={mic} 
                  alt="Microphone" 
                  className={`w-5 h-5 ${isMuted ? 'opacity-70' : ''}`}
                />
              </button>

              {/* Video button */}
              <button
                onClick={toggleVideo}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  isVideoOff 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
                title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
              >
                <img 
                  src={videocam} 
                  alt="Video Camera" 
                  className={`w-5 h-5 ${isVideoOff ? 'opacity-70' : ''}`}
                />
              </button>

              {/* Leave Meet button (text) */}
              <button
                onClick={endCall}
                className="inline-flex items-center justify-center bg-[#FF3B30] hover:bg-[#E2332A] text-white font-medium px-4 py-2 rounded-md"
                title="Leave Meet"
              >
                Leave Meet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoConference;