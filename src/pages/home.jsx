import React, { useEffect, useState } from 'react';
import Navbar from '../components/navbar';
import FeatureCards from '../components/featurecard';
import Footer from '../components/footer';
import notes from "../assets/notes.svg";
import arrow from "../assets/right arrow.svg";
import one from "../assets/01.svg";
import two from "../assets/02.svg";
import three from "../assets/03.svg";
import yellowImg from "../assets/yellow.svg";
import orangeImg from "../assets/orange.svg";
import greenImg from "../assets/green.svg";
import pinkImg from "../assets/pink.svg";
import { useNavigate } from 'react-router-dom';
import vector from "../assets/vector.svg";
import img from "../assets/Rectangle 9.svg";
import demoVideo from "../assets/demovideo.mp4";

// Animated "Collaborate" heading with sequenced image highlights
const CollaborateAnimation = ({ className = "" }) => {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % 6), 1200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={`relative inline-block ${className}`}>
      <style>{`@keyframes vibrate{0%{transform:translate(0,0) rotate(0)}20%{transform:translate(1px,-1px) rotate(-0.5deg)}40%{transform:translate(-1px,1px) rotate(0.5deg)}60%{transform:translate(1px,1px) rotate(0)}80%{transform:translate(-1px,-1px) rotate(0.5deg)}100%{transform:translate(0,0) rotate(0)}}`}</style>

      <div className={`pointer-events-none select-none absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-50 sm:w-60 md:w-86 opacity-0 transition-opacity duration-500 ${step === 1 ? 'opacity-90' : ''}`}>
        <img src={yellowImg} alt="" className="w-full h-auto" style={{ animation: step === 1 ? 'vibrate 0.9s linear infinite' : 'none' }} />
      </div>
      <div className={`pointer-events-none select-none absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-50 sm:w-60 md:w-86 opacity-0 transition-opacity duration-500 ${step === 2 ? 'opacity-90' : ''}`}>
        <img src={orangeImg} alt="" className="w-full h-auto" style={{ animation: step === 2 ? 'vibrate 0.9s linear infinite' : 'none' }} />
      </div>
      <div className={`pointer-events-none select-none absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-50 sm:w-60 md:w-86 opacity-0 transition-opacity duration-500 ${step === 3 ? 'opacity-90' : ''}`}>
        <img src={greenImg} alt="" className="w-full h-auto" style={{ animation: step === 3 ? 'vibrate 0.9s linear infinite' : 'none' }} />
      </div>
      <div className={`pointer-events-none select-none absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-50 sm:w-60 md:w-86 opacity-0 transition-opacity duration-500 ${step === 4 ? 'opacity-90' : ''}`}>
        <img src={pinkImg} alt="" className="w-full h-auto" style={{ animation: step === 4 ? 'vibrate 0.9s linear infinite' : 'none' }} />
      </div>

      <span className={`block origin-bottom transition-all duration-700 ${step === 0 ? 'opacity-100 -rotate-6 scale-95' : 'opacity-0 rotate-0'}`}>Collaborate</span>
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayOpaque, setOverlayOpaque] = useState(false);
  const [showDemo, setShowDemo] = useState(false); // ✅ State for showing video

  const goToSignupWithOverlay = () => {
    setShowOverlay(true);
    requestAnimationFrame(() => setOverlayOpaque(true));
    setTimeout(() => {
      navigate('/signup', { state: { entryOverlay: true } });
    }, 500);
  };

  return (
    <>
      <Navbar />

      {/* HERO SECTION */}
      <section id="home" className="relative bg-green-50 md:bg-white overflow-hidden px-4 sm:px-6 md:px-20 min-h-150 flex items-center">
        <div className="relative z-10 max-w-7xl my-55 w-full flex flex-col items-center gap-6">
          <div className='text-center font-medium mb-2'>
            <h1 className='text-[40px] h-13 md:h-20 sm:text-5xl md:text-6xl lg:text-7xl'>Meet</h1>
            <CollaborateAnimation className='h-13 md:h-20 text-[40px] sm:text-5xl md:text-6xl lg:text-7xl' />
            <h1 className='text-[40px] h-13 sm:text-5xl md:text-6xl lg:text-7xl'>Create</h1>
          </div>
          <div className='flex flex-col sm:flex-row gap-3 sm:gap-4'>
            <button onClick={goToSignupWithOverlay} className="bg-[#5E9BFF] text-white px-6 sm:px-8 py-2 rounded-lg border border-[#1F2937]/20 text-base sm:text-lg font-normal cursor-pointer hover:brightness-105 transition">
              Get Started
            </button>
            <button onClick={() => setShowDemo(true)} className="bg-white text-[#4A0B83] px-6 sm:px-8 py-2 rounded-lg border border-[#1F2937]/20 text-base sm:text-lg font-normal cursor-pointer hover:bg-gray-50 transition">
              Watch Demo
            </button>
          </div>
        </div>

        <img src={notes} alt="" className="md:block pointer-events-none select-none absolute right-0 top-25 w-35 md:top-50 sm:w-30 md:w-50" />
        <img src={notes} alt="" className="md:block pointer-events-none select-none absolute left-0 top-10 w-35 sm:w-30 md:w-50 -scale-x-100" />
        <img src={notes} alt="" className="md:block pointer-events-none select-none absolute left-1/2 top-148 -translate-x-1/2 -translate-y-1/2 w-35 md:left-[25vw] sm:w-30 md:w-50" />
        <img src={img} className="md:block pointer-events-none select-none absolute left-15 top-130 -translate-x-1/2 -translate-y-1/2 sm:top-120 md:left-[70vw] md:top-[8em] w-20 sm:w-10 md:w-35" />
        <img src={img} className="md:block pointer-events-none select-none absolute left-12 top-70 -translate-x-1/2 -translate-y-1/2 w-20 md:top-90 md:left-[6vw] sm:w-10 md:w-25" />
        <img src={img} className="md:block pointer-events-none select-none absolute -right-5 top-90 -translate-x-1/2 -translate-y-1/2 w-20 md:left-[75vw] md:top-[33em] sm:w-10 md:w-30" />
      </section>

      {/* FEATURE CARDS */}
      <section id="features" className="bg-gray-50 py-12 sm:py-16 px-4 sm:px-6 md:px-20 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[48px] font-semibold mb-12 md:mb-16 lg:mb-24 max-w-[1160px] text-[#0B0E13] [text-shadow:0_4px_4px_rgba(0,0,0,0.25)] mx-auto leading-snug px-4">
          All Your Work — In One Virtual Space
        </h2>
        <FeatureCards />
      </section>

     

      <section id="user-roles" className="py-16 px-6 md:px-20 mb-24 ">
        <h2 className="text-[32px] sm:text-5xl font-semibold text-center text-[#0B0E13] [text-shadow:0_4px_4px_rgba(0,0,0,0.25)]">Build For Every Team Member</h2>
        <div className='flex justify-between mt-24 flex-col-reverse items-end sm:flex-row sm:justify-between'>
          <div className='w-full max-w-2xl'>
          <h3 className='text-[24px] sm:text-[32px] font-medium mb-3'> Managers-Lead with visibility</h3>
          <p className='text-[16px] sm:text-xl font-normal mb-6'>Create and manage digital offices, assign roles, and customize rooms to fit your organization’s structure.<br/>Monitor performance, schedule meetings, and track every project — all from one dashboard.</p>
           <button className="flex text-xl bg-[#5E9BFF] text-white px-5 py-2 rounded-lg cursor-pointer" onClick={goToSignupWithOverlay}>
             Join as Manager<img src={arrow} alt="arrow" className='pl-3'  />
           </button>
           </div>
           <div className='flex flex-col justify-center h-full sm:h-60'>
          <div className="relative w-full max-w-24 h-30 overflow-hidden pt-5">
            <img src={one} alt="Illustration 01" className="block w-full h-auto" />
            <div className="pointer-events-none absolute inline  inset-0 bg-[linear-gradient(180deg,rgba(253,253,253,0)_0.25%,#FDFDFD_77.41%)]" />
         
         </div></div>
        </div>
        <hr className=" border-[#EBE2F6] border-b-4 border-t-0 mt-16" />


        <div className='flex justify-between  mt-16 flex-col-reverse items-end sm:flex-row sm:justify-between'>
          <div className='w-full max-w-2xl'>
          <h3 className='text-[24px] sm:text-[32px] font-medium mb-3'> Supervisor — Guide with Insight</h3>
          <p className='text-[16px] sm:text-xl font-normal mb-6'>Stay on top of your team’s activity and progress with real-time insights.<br/>Assign individual tasks, monitor workspace attendance, and give feedback instantly — all while keeping communication open.</p>
           <button className="flex text-xl bg-[#5E9BFF] text-white px-5 py-2 rounded-lg cursor-pointer" onClick={goToSignupWithOverlay}>
             Join as Supervisor <img src={arrow} alt="arrow" className='pl-3'  />
           </button>
           </div>
           <div className='flex flex-col justify-center h-full sm:h-50'>
          <div className="relative w-full max-w-24 h-30 overflow-hidden pt-5">
            <img src={two} alt="Illustration 01" className="block w-full h-auto" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(253,253,253,0)_0.25%,#FDFDFD_63.41%)]" />
         
         </div></div>
        </div>
        <hr className=" border-[#EBE2F6] border-b-4 border-t-0 mt-16" />
         <div className='flex justify-between  mt-16 flex-col-reverse items-end sm:flex-row sm:justify-between'>
          <div className='w-full max-w-2xl'>
          <h3 className='text-[24px] sm:text-[32px] font-medium mb-3'> Team Member — Collaborate with Freedom</h3>
          <p className='text-[16px] sm:text-xl font-normal mb-6'>Join your virtual office from anywhere and connect with your team through real-time chat, video calls, or collaborative rooms.<br/>Share ideas, track progress, and contribute without missing the energy of a real workspace.</p>
           <button className="flex text-xl bg-[#5E9BFF] text-white px-5 py-2 rounded-lg cursor-pointer" onClick={goToSignupWithOverlay}>
             Join as Team Member<img src={arrow} alt="arrow" className='pl-3'  />
           </button>
           </div>
           <div className='flex flex-col justify-center h-full sm:h-57'>
          <div className="relative w-full max-w-24 h-30 overflow-hidden pt-5 ">
            <img src={three} alt="Illustration 01" className="block w-full h-auto" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(253,253,253,0)_0.25%,#FDFDFD_68.41%)]" />
         
         </div>
        </div></div>
      </section>
      <div
        aria-hidden
        className={`fixed inset-0 z-60 bg-[#450B7B] transition-opacity duration-500 ${overlayOpaque ? 'opacity-100' : 'opacity-0'} ${showOverlay ? '' : 'pointer-events-none'}`}
      />

      {/* DEMO VIDEO SECTION */}
      <section id="demo-video" className="px-6 md:px-20 mb-40">
        <div className="relative max-w-4xl mx-auto">
          <h2 className="text-[32px] sm:text-5xl font-semibold text-center text-[#0B0E13] [text-shadow:0_4px_4px_rgba(0,0,0,0.25)]">
            See How VOW Transforms Your Workday
          </h2>

          {/* ✅ Video Section */}
          <div className="w-full rounded-xl mt-10 sm:mt-12 overflow-hidden shadow-lg">
            {showDemo ? (
              <video
                src={demoVideo}
                controls
                autoPlay
                muted
                loop
                className="w-full h-56 sm:h-72 md:h-96 object-cover rounded-xl"
              />
            ) : (
              <div className="w-full bg-[#D9D9D9] flex items-center justify-center h-56 sm:h-72 md:h-96 text-gray-600 text-xl rounded-xl">
                Click “Watch Demo” to play video
              </div>
            )}
          </div>

          <img src={vector} alt="arrow" className='h-15 w-8 -rotate-15 -translate-x-1/2' />

          <div className="mt-0 md:mt-0 flex flex-col md:flex-row items-center md:items-start justify-between gap-6 md:gap-8">
            <p className="max-w-2xl text-base sm:text-xl md:text-xl text-center md:text-left">
              Take a quick tour of how teams connect, collaborate, and create inside their virtual office.
            </p>
            <div className="flex gap-4 justify-center md:justify-end">
              <button
                onClick={() => setShowDemo(true)}
                className="inline-flex items-center whitespace-nowrap shrink-0 bg-[#5E9BFF] text-white px-6 sm:px-8 py-2 rounded-lg border border-[#1F2937]/20 text-base sm:text-lg font-normal cursor-pointer hover:brightness-105 transition"
              >
                Watch Demo
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="inline-flex items-center whitespace-nowrap shrink-0 bg-white text-[#4A0B83] px-6 sm:px-8 py-2 rounded-lg border border-[#1F2937]/20 text-base sm:text-lg font-normal cursor-pointer hover:bg-gray-50 transition"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Home;

