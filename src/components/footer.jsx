import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

const Footer = () => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });

  // Smooth trailing effect
  useEffect(() => {
    let animationFrame;
    const lerp = (start, end, amt) => start + (end - start) * amt;

    const animate = () => {
      setGlowPos((prev) => ({
        x: lerp(prev.x, mouse.x, 0.1),
        y: lerp(prev.y, mouse.y, 0.1),
      }));
      animationFrame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [mouse]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMouse({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <footer
      className="relative text-[#EFEFEF] bg-gradient-to-b from-[#1B0837] to-[#240A44] px-[60px] py-[60px] overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Hover Glow + Grid */}
      <div
        className="absolute inset-[-5%] pointer-events-none"
        style={{
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.3s ease",
          maskImage: `radial-gradient(circle 180px at ${glowPos.x}px ${glowPos.y}px, white 30%, transparent 90%)`,
          WebkitMaskImage: `radial-gradient(circle 180px at ${glowPos.x}px ${glowPos.y}px, white 30%, transparent 90%)`,
        }}
      >
        {/* Soft Glow Orb */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="150"
          height="84"
          viewBox="0 0 150 84"
          fill="none"
          className="absolute"
          style={{
            left: glowPos.x - 185,
            top: glowPos.y - 185,
            opacity: 0.18, // softer light
            transition: "all 0.15s ease-out",
          }}
        >
          <g filter="url(#filter0_f_1103_3018)">
            <circle
              cx="25"
              cy="25"
              r="25"
              transform="matrix(1 0 0 -1 90 70)"
              fill="white"
            />
          </g>
          <defs>
            <filter
              id="filter0_f_1103_3018"
              x="-70"
              y="-140"
              width="370"
              height="370"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="100"
                result="effect1_foregroundBlur_1103_3018"
              />
            </filter>
          </defs>
        </svg>

        {/* Soft Grid Lines */}
        <div
          className="grid w-full h-full"
          style={{
            gridTemplateRows: "repeat(12, 1fr)",
            gridTemplateColumns: "repeat(28, 1fr)",
          }}
        >
          {Array.from({ length: 12 * 28 }).map((_, i) => (
            <div
              key={i}
              className="border border-white"
              style={{
                opacity: 0.06, 
                transition: "opacity 0.3s ease",
                filter: "blur(0.5px)", 
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Footer Content */}
      <div className="max-w-[1160px] mx-auto flex flex-col lg:flex-row justify-center items-start gap-[164px] relative z-10">
        {/* Intro */}
        <section className="w-full max-w-[375px] space-y-4">
          <div className="flex items-center gap-3 mb-[59px]">
            <img
              src={logo}
              alt="VOW logo"
              className="h-[55.574px] w-[68.122px] object-contain select-none"
            />
            <div className="leading-none ml-[38px]">
              <h3 className="text-[32px] font-bold text-[#FEFEFE] pb-[3px]">
                VOW
              </h3>
              <p className="text-[24px] font-normal text-[#FEFEFE]">
                Virtual Organised World
              </p>
            </div>
          </div>

          <p className="text-[#969696] leading-[24px] pb-[59px]">
            Experience the most natural way to collaborate remotely.
          </p>

          <div className="flex flex-nowrap items-center">
            <Link
              to="/signup"
              className="px-9 py-[10px] rounded-[8px] w-[183px] h-[39px] mr-[8px] text-center font-normal bg-[#5E9BFF] text-[#FEFEFE] border border-[#EFEFEF]"
            >
              Get Started
            </Link>
            <a
              href="#watch-demo"
              className="px-9 py-[10px] rounded-[8px] w-[183px] h-[39px] font-normal border border-[#EFEFEF] text-[#EDEBFF]"
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
            {["Home", "About", "Features", "Demo video", "User roles"].map(
              (link, idx) => (
                <li key={idx}>
                  <a
                    className="text-white text-[20px] leading-[1.2] hover:text-[#5E9BFF] transition"
                    href={`#${link.toLowerCase().replace(" ", "-")}`}
                  >
                    {link}
                  </a>
                </li>
              )
            )}
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
      <div className="max-w-[1160px] mx-auto mt-[48px] pt-[60px] text-center text-[#969696] text-[16px] leading-[1.2] relative z-10">
        <p>© 2025 VOW. All rights reserved.</p>
        <p>Virtual Organised World - Where Remote Teams Connect.</p>
      </div>
    </footer>
  );
};

export default Footer;
