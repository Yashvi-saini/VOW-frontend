import React, { useEffect } from 'react';
import Navbar from '../components/navbar';
import FeatureCards from '../components/featurecard';
import Footer from '../components/footer';
import notes from "../assets/notes.svg";
import arrow from "../assets/right arrow.svg";
import one from "../assets/01.svg";
import two from "../assets/02.svg";
import three from "../assets/03.svg";
const Home = () => {
  return (
    <>
      <Navbar />

      <section className="relative bg-green-50 md:bg-white overflow-hidden py-12 sm:py-16 lg:py-24 px-4 sm:px-6 md:px-20">
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center gap-6">
          <div className='text-center font-medium mb-2'>
            <h1 className='pb-2.5 text-4xl sm:text-5xl md:text-6xl lg:text-7xl'>Meet</h1>
            <h1 className='pb-2.5 text-4xl sm:text-5xl md:text-6xl lg:text-7xl'>Collaborate</h1>
            <h1 className='pb-2.5 text-4xl sm:text-5xl md:text-6xl lg:text-7xl'>Create</h1>
          </div>
          <div className='flex flex-col sm:flex-row gap-3 sm:gap-4'>
            <button className="bg-[#5E9BFF] text-white px-6 sm:px-8 py-2 rounded-lg border border-[#1F2937]/20 text-base sm:text-lg font-normal cursor-pointer hover:brightness-105 transition">
              Get Started
            </button>
            <button className="bg-white text-[#4A0B83] px-6 sm:px-8 py-2 rounded-lg border border-[#1F2937]/20 text-base sm:text-lg font-normal cursor-pointer hover:bg-gray-50 transition">
              Watch Demo
            </button>
          </div>
        </div>



        {/* Decorative notes (do not affect layout) */}
        <img src={notes} alt="" aria-hidden className="hidden md:block pointer-events-none select-none absolute right-6 top-40 w-10 opacity-30" />
        <img src={notes} alt="" aria-hidden className="hidden md:block pointer-events-none select-none absolute left-6 top-4 w-10 opacity-30 -scale-x-100" />
        <img src={notes} alt="" aria-hidden className="hidden md:block pointer-events-none select-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 opacity-20" />
      </section>

      <section className="bg-gray-50 py-16 px-6 md:px-20 text-center">
        <h2 className="text-2xl font-bold mb-10">All Your Work-In One Virtual Place</h2>
        <FeatureCards />
      </section>

      <section className="py-16 px-6 md:px-20 mb-24 ">
        <h2 className="text-5xl font-semibold text-center text-[#0B0E13] [text-shadow:0_4px_4px_rgba(0,0,0,0.25)]">Build For Every Team Member</h2>
        <div className='flex justify-between mt-20 flex-wrap-reverse '>
          <div className='w-full max-w-2xl'>
          <h3 className='text-3xl font-medium mb-3'> Managers-Lead with visibility</h3>
          <p className='text-xl font-normal mb-6'>Create and manage digital offices, assign roles, and customize rooms to fit your organization’s structure.<br/>Monitor performance, schedule meetings, and track every project — all from one dashboard.</p>
           <button className="flex text-xl bg-[#5E9BFF] text-white px-5 py-2 rounded-lg cursor-pointer">
             Join as Manager<img src={arrow} alt="arrow" className='pl-3'  />
           </button>
           </div>
          <div className="relative w-full max-w-[6rem] h-35 overflow-hidden pt-5">
            <img src={one} alt="Illustration 01" className="block w-full h-auto" />
            <div className="pointer-events-none absolute inline  inset-0 bg-[linear-gradient(180deg,rgba(253,253,253,0)_0.25%,#FDFDFD_43.41%)]" />
         
         </div>
        </div>
        <hr className=" border-[#EBE2F6] border-b-4 border-t-0 mt-16" />


        <div className='flex justify-between  mt-16 flex-wrap-reverse'>
          <div className='w-full max-w-2xl'>
          <h3 className='text-3xl font-medium mb-3'> Supervisor — Guide with Insight</h3>
          <p className='text-xl font-normal mb-6'>Stay on top of your team’s activity and progress with real-time insights.<br/>Assign individual tasks, monitor workspace attendance, and give feedback instantly — all while keeping communication open.</p>
           <button className="flex text-xl bg-[#5E9BFF] text-white px-5 py-2 rounded-lg cursor-pointer">
             Join as Supervisor <img src={arrow} alt="arrow" className='pl-3'  />
           </button>
           </div>
          <div className="relative w-full max-w-[6rem] h-35 overflow-hidden pt-5">
            <img src={two} alt="Illustration 01" className="block w-full h-auto" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(253,253,253,0)_0.25%,#FDFDFD_40.41%)]" />
         
         </div>
        </div>
        <hr className=" border-[#EBE2F6] border-b-4 border-t-0 mt-16" />
         <div className='flex justify-between  mt-16 flex-wrap-reverse'>
          <div className='w-full max-w-2xl'>
          <h3 className='text-3xl font-medium mb-3'> Team Member — Collaborate with Freedom</h3>
          <p className='text-xl font-normal mb-6'>Join your virtual office from anywhere and connect with your team through real-time chat, video calls, or collaborative rooms.<br/>Share ideas, track progress, and contribute without missing the energy of a real workspace.</p>
           <button className="flex text-xl bg-[#5E9BFF] text-white px-5 py-2 rounded-lg cursor-pointer">
             Join as Team Member<img src={arrow} alt="arrow" className='pl-3'  />
           </button>
           </div>
          <div className="relative w-full max-w-[6rem] h-35 overflow-hidden pt-5">
            <img src={three} alt="Illustration 01" className="block w-full h-auto" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(253,253,253,0)_0.25%,#FDFDFD_37.41%)]" />
         
         </div>
        </div>
      </section>

       <section className="px-6 md:px-20 ">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-semibold text-center text-[#0B0E13] [text-shadow:0_4px_4px_rgba(0,0,0,0.25)]">
            See How VOW Transforms Your Workday
          </h2>

          {/* Responsive media placeholder */}
          <div className="w-full bg-[#D9D9D9] rounded-xl mt-10 sm:mt-12 h-56 sm:h-72 md:h-96"></div>

          {/* Text + actions */}
          <div className="mt-8 md:mt-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6 md:gap-8">
            <p className="max-w-2xl text-base sm:text-lg md:text-xl text-center md:text-left">
              Take a quick tour of how teams connect, collaborate, and create inside their virtual office.
            </p>

            <div className="flex gap-4 justify-center md:justify-end">
              <button className="inline-flex items-center whitespace-nowrap shrink-0 bg-[#5E9BFF] text-white px-6 sm:px-8 py-2 rounded-lg border border-[#1F2937]/20 text-base sm:text-lg font-normal cursor-pointer hover:brightness-105 transition">
                Watch Demo
              </button>
              <button className="inline-flex items-center whitespace-nowrap shrink-0 bg-white text-[#4A0B83] px-6 sm:px-8 py-2 rounded-lg border border-[#1F2937]/20 text-base sm:text-lg font-normal cursor-pointer hover:bg-gray-50 transition">
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
