import React from "react";
import logo from "../assets/logo.png";

const Footer = () => {
  return (
    <footer
      role="contentinfo"
      className="text-[#EFEFEF] bg-gradient-to-b from-[#1B0837] to-[#240A44] px-[60px] py-[60px]"
    >
      {/* Container */}
      <div className="max-w-[1160px] mx-auto flex flex-col lg:flex-row justify-center items-start gap-[48px]">
        {/* Brand / Intro */}
        <section className="w-full max-w-[375px] space-y-4">
          <div className="flex items-center gap-3 mb-[59px]">
            <img
              src={logo}
              alt="VOW logo"
              className="h-[55.574px] w-[68.122px] object-contain select-none "
            />
            <div className="leading-none ml-[38px]">
              <h3 className="text-[32px] font-bold text-[#FEFEFE] pb-[3px]">VOW</h3>
              <p className="text-[26px]font-normal text-[#FEFEFE] ">Virtual Organised World</p>
            </div>
          </div>

          <p className="text-[#969696] leading-[24px] pb-[59px]">
            Experience the most natural way to collaborate remotely.
          </p>

          <div className="flex flex-wrap items-center ">
            <a
              href="#get-started"
              className="px-[36px] py-[10px] rounded-[8px] w-[183px] h-[39px] mr-[8px] text-center font-normal bg-[#5E9BFF] text-[#FEFEFE] border border-[#EFEFEF] "
            >
              Get Started
            </a>
            <a
              href="#watch-demo"
              className="px-[36px] py-[10px] rounded-[8px] w-[183px] h-[39px] font-normal border border-[#EFEFEF] text-[#EDEBFF]"
            >
              Watch Demo
            </a>
          </div>
        </section>

        {/* Quick Links */}
        <nav
          className="w-full max-w-[300px] space-y-4 text-center lg:text-left"
          aria-label="Quick Links"
        >
          <h4 className="text-white font-semibold text-[24px] leading-[1.2] mb-[42px]">
            Quick Links
          </h4>
          <ul className="grid gap-[16px] list-none p-0 m-0">
            <li>
              <a
                className="text-white text-[20px] leading-[1.2] hover:text-[#5E9BFF] transition"
                href="#home"
              >
                Home
              </a>
            </li>
            <li>
              <a
                className="text-white text-[20px] leading-[1.2] hover:text-[#5E9BFF] transition"
                href="#about"
              >
                About
              </a>
            </li>
            <li>
              <a
                className="text-white text-[20px] leading-[1.2] hover:text-[#5E9BFF] transition"
                href="#features"
              >
                Features
              </a>
            </li>
            <li>
              <a
                className="text-white text-[20px] leading-[1.2] hover:text-[#5E9BFF] transition"
                href="#demo"
              >
                Demo video
              </a>
            </li>
            <li>
              <a
                className="text-white text-[20px] leading-[1.2] hover:text-[#5E9BFF] transition"
                href="#roles"
              >
                User roles
              </a>
            </li>
          </ul>
        </nav>

        {/* Subscribe */}
        <section className="w-full max-w-[375px] space-y-4 text-center lg:text-left">
          <h4 className="text-white font-semibold text-[24px] leading-[1.2] mb-[42px]">
            Subscribe
          </h4>
          <p className="text-[#969696] mb-[42px]">
            If you would like to receive daily updates, please write your email.
          </p>

          <form className="flex flex-col w-full">
            <input
              type="email"
              required
              placeholder="Enter your email"
              aria-label="Email address"
              className="w-full text-center h-[39px] px-[36px] rounded-[8px] bg-transparent border border-[#EFEFEF] mb-[8px] text-[#EFEFEF] placeholder:text-[#EDEBFF]/70 outline-none focus:border-[#5E9BFF] transition"
            />
            <button
              type="submit"
              className="w-full px-[36px] py-[10px] rounded-[8px] font-semibold bg-[#5E9BFF] text-[#0B0B15] border border-[#EFEFEF] hover:brightness-105 transition"
            >
              Subscribe
            </button>
          </form>
        </section>
      </div>

      {/* Copyright */}
      <div className="max-w-[1160px] mx-auto mt-[48px] pt-[60px]   text-center text-[#969696] text-[16px] leading-[1.2]">
        <p>© 2025 VOW. All rights reserved.</p>
        <p>Virtual Organised World - Where Remote Teams Connect.</p>
      </div>
    </footer>
  );
};

export default Footer;