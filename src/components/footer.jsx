import React, { useState, useEffect, useRef, useCallback } from "react";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

const Footer = () => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });
  const animationFrameRef = useRef(null);
  const lastMouseMoveRef = useRef(0);

  // Throttled mouse move handler
  const handleMouseMove = useCallback((e) => {
    const now = Date.now();
    if (now - lastMouseMoveRef.current < 16) return; // ~60fps throttle
    lastMouseMoveRef.current = now;

    const rect = e.currentTarget.getBoundingClientRect();
    setMouse({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const handleTouchMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    setMouse({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    });
    setHovered(true);
  }, []);

  // Optimized animation loop
  useEffect(() => {
    if (!hovered) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const lerp = (start, end, amt) => start + (end - start) * amt;

    const animate = () => {
      setGlowPos((prev) => ({
        x: lerp(prev.x, mouse.x, 0.1),
        y: lerp(prev.y, mouse.y, 0.1),
      }));
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [hovered, mouse]);

  // Generate grid cells once (memoized)
  const gridCells = useRef(
    Array.from({ length: 500 }, (_, i) => ({ id: i }))
  ).current;

  return (
    <footer
      className="relative text-[#EFEFEF] bg-gradient-to-b from-[#1B0837] to-[#240A44] px-4 sm:px-6 md:px-8 lg:px-[60px] py-8 sm:py-10 md:py-12 lg:py-[60px] overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchMove={handleTouchMove}
      onTouchStart={() => setHovered(true)}
      onTouchEnd={() => setHovered(false)}
    >
      {/* Grid Effect */}
      {hovered && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            opacity: 1,
            maskImage: `radial-gradient(circle 180px at ${glowPos.x}px ${glowPos.y}px, white 30%, transparent 90%)`,
            WebkitMaskImage: `radial-gradient(circle 180px at ${glowPos.x}px ${glowPos.y}px, white 30%, transparent 90%)`,
          }}
        >
          {/* Optimized Grid */}
          <div
            className="absolute inset-0 grid pointer-events-none"
            style={{
              gridTemplateColumns: 'repeat(25, 50px)',
              gridTemplateRows: 'repeat(20, 50px)',
              width: '100%',
              height: '100%',
            }}
          >
            {gridCells.map((cell) => (
              <div
                key={cell.id}
                className="border-[0.5px] border-white/[0.06]"
                style={{
                  filter: 'blur(0.5px)',
                  transform: 'translate3d(0, 0, 0)',
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Footer Content */}
      <div className="max-w-[1160px] mx-auto flex flex-col items-center lg:flex-row lg:justify-center lg:items-start gap-8 sm:gap-10 md:gap-12 lg:gap-[164px] relative z-10">
        {/* Intro */}
        <section className="w-full max-w-[375px] space-y-4 text-center lg:text-left">
          <div className="flex flex-row items-center justify-center lg:justify-start gap-2 sm:gap-2.5 lg:gap-3 mb-6 sm:mb-8 lg:mb-[59px]">
            <img
              src={logo}
              alt="VOW logo"
              className="h-[40px] w-[49px] sm:h-[48px] sm:w-[59px] lg:h-[55.574px] lg:w-[68.122px] object-contain select-none"
            />
            <div className="leading-none text-left">
              <h3 className="text-[24px] sm:text-[28px] lg:text-[32px] font-bold text-[#FEFEFE] mb-0.5">
                VOW
              </h3>
              <p className="text-[16px] sm:text-[20px] lg:text-[24px] font-normal text-[#FEFEFE]">
                Virtual Organised World
              </p>
            </div>
          </div>

          <p className="text-[#969696] text-[14px] sm:text-[16px] leading-[20px] sm:leading-[24px] pb-6 sm:pb-8 lg:pb-[59px] px-4 lg:px-0">
            Experience the most natural way to collaborate remotely.
          </p>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-[8px] items-center justify-center lg:justify-start px-4 lg:px-0">
            <Link
              to="/signup"
              className="w-full sm:w-[160px] lg:w-[183px] h-[39px] flex items-center justify-center rounded-[8px] text-[14px] sm:text-[16px] font-normal bg-[#5E9BFF] text-[#FEFEFE] border border-[#EFEFEF] hover:brightness-105 transition"
            >
              Get Started
            </Link>
            <a
              href="#watch-demo"
              className="w-full sm:w-[160px] lg:w-[183px] h-[39px] flex items-center justify-center rounded-[8px] text-[14px] sm:text-[16px] font-normal border border-[#EFEFEF] text-[#EDEBFF] hover:bg-white/5 transition"
            >
              Watch Demo
            </a>
          </div>
        </section>

        {/* Quick Links */}
        <nav
          className="w-full max-w-[300px] space-y-4 text-center"
          aria-label="Quick Links"
        >
          <h4 className="text-white font-semibold text-[20px] sm:text-[22px] lg:text-[24px] leading-[1.2] mb-6 sm:mb-8 lg:mb-[42px]">
            Quick Links
          </h4>
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-3 sm:gap-4 lg:gap-[16px] list-none p-0 m-0">
            {["Home", "About", "Features", "Demo video", "User roles"].map(
              (link, idx) => (
                <li key={idx}>
                  <a
                    className="text-white text-[16px] sm:text-[18px] lg:text-[20px] leading-[1.2] hover:text-[#5E9BFF] transition"
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
        <section className="w-full max-w-[375px] space-y-4 text-center lg:text-left px-4 lg:px-0">
          <h4 className="text-white font-semibold text-[20px] sm:text-[22px] lg:text-[24px] leading-[1.2] mb-6 sm:mb-8 lg:mb-[42px]">
            Subscribe
          </h4>
          <p className="text-[#969696] text-[14px] sm:text-[16px] mb-6 sm:mb-8 lg:mb-[42px]">
            If you would like to receive daily updates, please write your email.
          </p>

          <form className="flex flex-col w-full gap-2 sm:gap-[8px]">
            <input
              type="email"
              required
              placeholder="Enter your email"
              aria-label="Email address"
              className="w-full text-center h-[39px] px-4 sm:px-6 lg:px-[36px] rounded-[8px] bg-transparent border border-[#EFEFEF] text-[14px] sm:text-[16px] text-[#EFEFEF] placeholder:text-[#EDEBFF]/70 outline-none focus:border-[#5E9BFF] transition"
            />
            <button
              type="submit"
              className="w-full px-4 sm:px-6 lg:px-[36px] py-[10px] h-[39px] rounded-[8px] text-[14px] sm:text-[16px] font-semibold bg-[#5E9BFF] text-[#0B0B15] border border-[#EFEFEF] hover:brightness-105 transition"
            >
              Subscribe
            </button>
          </form>
        </section>
      </div>

      {/* Copyright */}
      <div className="max-w-[1160px] mx-auto mt-8 sm:mt-10 md:mt-12 lg:mt-[48px] pt-8 sm:pt-10 md:pt-12 lg:pt-[60px] text-center text-[#969696] text-[12px] sm:text-[14px] lg:text-[16px] leading-[1.2] relative z-10 px-4">
        <p>© 2025 VOW. All rights reserved.</p>
        <p className="mt-1">Virtual Organised World - Where Remote Teams Connect.</p>
      </div>
    </footer>
  );
};

export default Footer;