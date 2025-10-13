
import React from 'react';
import Navbar from '../components/navbar';
import FeatureCards from '../components/featurecard';

const Home = () => {
  return (
    <>
      <Navbar />

      <section className="bg-white py-16 px-6 md:px-20 flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-4xl font-bold text-000000">
            Your Office, Reimagined <span className="text-5C0EA4">– Virtually.</span>
          </h1>
          <p className="text-gray-600">
            Meet, collaborate, and create in a virtual space. Vow connects distributed teams through real-time video, chat, and interactive workspaces – all in one place.
          </p>
          <div className="space-x-4">
            <button className="bg-purple-600 text-white px-6 py-2 rounded-md font-semibold">Get Started</button>
            <button className="border-2 border-purple-600 text-purple-600 px-6 py-2 rounded-md font-semibold">Watch Demo</button>
          </div>
        </div>

        <div className="md:w-1/2 mt-10 md:mt-0">
          <img src="/assets/illustration.svg" alt="illustration" className="w-full" />
        </div>
      </section>

      <section className="bg-gray-50 py-16 px-6 md:px-20 text-center">
        <h2 className="text-2xl font-bold mb-10">Work Together – From Anywhere</h2>
        <FeatureCards />
      </section>

      <section className="py-16 px-6 md:px-20 text-center">
        <h2 className="text-2xl font-bold">Designed for Every Role</h2>
        
      </section>
    </>
  );
};

export default Home;
