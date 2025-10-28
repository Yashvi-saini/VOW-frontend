import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import logo from '../assets/logo.png';
import hamburgerIcon from '../assets/hamburger.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="w-full fixed top-0 left-0 right-0 flex justify-center py-2 sm:py-2.5 md:py-[10px] px-4 sm:px-5 md:px-[20px] lg:px-[60px] bg-transparent z-50">
      <div className="w-full max-w-[1660px] border border-[#DDDFE1] rounded-[12px] sm:rounded-[14px] md:rounded-[16px] bg-white shadow-sm">
        <nav className="flex justify-between items-center h-[52px] sm:h-[56px] md:h-[60px] lg:h-[64px] w-full px-4 sm:px-5 md:px-[16px] lg:px-[20px]">
        
          {/* Logo */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <img src={logo} alt="Logo" className="h-[24px] sm:h-[28px] md:h-[32px] lg:h-[40px] w-auto" />
            <span className="text-[#5C0EA4] text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] font-bold leading-none">VOW</span>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden lg:flex items-center gap-[30px] xl:gap-[60px] 2xl:gap-[90px]">
            <li className="text-[#969696] font-inter text-[14px] xl:text-[15px] 2xl:text-[16px] leading-[19.2px] font-normal hover:text-[#5C0EA4] cursor-pointer transition-colors whitespace-nowrap">
              Home
            </li>
            <li className="text-[#969696] font-inter text-[14px] xl:text-[15px] 2xl:text-[16px] leading-[19.2px] font-normal hover:text-[#5C0EA4] cursor-pointer transition-colors whitespace-nowrap">
              Features
            </li>
            <li className="text-[#969696] font-inter text-[14px] xl:text-[15px] 2xl:text-[16px] leading-[19.2px] font-normal hover:text-[#5C0EA4] cursor-pointer transition-colors whitespace-nowrap">
              About
            </li>
            <li className="text-[#969696] font-inter text-[14px] xl:text-[15px] 2xl:text-[16px] leading-[19.2px] font-normal hover:text-[#5C0EA4] cursor-pointer transition-colors whitespace-nowrap">
              Contact
            </li>
          </ul>

          {/* Desktop Buttons */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-[10px]">
            <Link
              to="/login"
              className="w-[100px] xl:w-[140px] 2xl:w-[160px] h-[38px] xl:h-[42px] 2xl:h-[44px] flex items-center justify-center rounded-[8px] border border-[#5C0EA4] text-[#5C0EA4] text-[14px] xl:text-[18px] 2xl:text-[20px] font-normal hover:bg-[#5C0EA4] hover:text-white transition-all whitespace-nowrap"
            >
              Log in
            </Link>

            <Link
              to="/signup"
              className="w-[100px] xl:w-[140px] 2xl:w-[160px] h-[38px] xl:h-[42px] 2xl:h-[44px] flex items-center justify-center rounded-[8px] bg-[#450B7B] text-white text-[14px] xl:text-[18px] 2xl:text-[20px] font-normal hover:bg-[#5C0EA4] transition-all whitespace-nowrap"
            >
              Sign up
            </Link>
          </div>

          {/* Mobile Hamburger Menu */}
          <button 
            className="lg:hidden flex items-center justify-center focus:outline-none flex-shrink-0"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <img src={hamburgerIcon} alt="Menu" className="w-[24px] h-[24px] sm:w-[28px] sm:h-[28px] md:w-[32px] md:h-[32px]" />
          </button>
        </nav>

        {/* Mobile Menu Dropdown */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="border-t border-[#DDDFE1] py-3 sm:py-4 md:py-[16px] px-4 sm:px-5 md:px-[20px] bg-white rounded-b-[12px] sm:rounded-b-[14px] md:rounded-b-[16px]">
            <ul className="flex flex-col gap-2 sm:gap-3 md:gap-[12px] mb-3 sm:mb-4 md:mb-[16px]">
              <li 
                className="text-[#969696] font-inter text-[14px] sm:text-[15px] md:text-[16px] font-normal hover:text-[#5C0EA4] cursor-pointer transition-colors py-1.5 sm:py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </li>
              <li 
                className="text-[#969696] font-inter text-[14px] sm:text-[15px] md:text-[16px] font-normal hover:text-[#5C0EA4] cursor-pointer transition-colors py-1.5 sm:py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </li>
              <li 
                className="text-[#969696] font-inter text-[14px] sm:text-[15px] md:text-[16px] font-normal hover:text-[#5C0EA4] cursor-pointer transition-colors py-1.5 sm:py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </li>
              <li 
                className="text-[#969696] font-inter text-[14px] sm:text-[15px] md:text-[16px] font-normal hover:text-[#5C0EA4] cursor-pointer transition-colors py-1.5 sm:py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </li>
            </ul>

            <div className="flex flex-col gap-2 sm:gap-2.5 md:gap-[12px] pt-2">
              <Link
                to="/login"
                className="w-full h-[42px] sm:h-[44px] md:h-[48px] flex items-center justify-center rounded-[8px] border border-[#5C0EA4] text-[#5C0EA4] text-[15px] sm:text-[16px] md:text-[18px] font-normal hover:bg-[#5C0EA4] hover:text-white transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Log in
              </Link>

              <Link
                to="/signup"
                className="w-full h-[42px] sm:h-[44px] md:h-[48px] flex items-center justify-center rounded-[8px] bg-[#450B7B] text-white text-[15px] sm:text-[16px] md:text-[18px] font-normal hover:bg-[#5C0EA4] transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;