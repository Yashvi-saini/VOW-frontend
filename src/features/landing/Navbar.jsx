import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import logo from '@/assets/logo.png';
import hamburgerIcon from '@/assets/hamburger.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleNavigation = (targetId) => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    setIsMenuOpen(false); 
  };

  return (
    <div className="w-full fixed top-0 left-0 right-0 flex justify-center py-2 sm:py-2.5 md:py-[0.625rem] px-4 sm:px-5 md:px-[1.25rem] lg:px-[3.75rem] bg-transparent z-50">
      <div className="w-full max-w-[103.75rem] border border-[#DDDFE1] rounded-[0.75rem] sm:rounded-[0.875rem] md:rounded-[1rem] bg-white shadow-sm">
        <nav className="flex justify-between items-center h-[3.25rem] sm:h-[3.5rem] md:h-[3.75rem] lg:h-[4rem] w-full px-4 sm:px-5 md:px-[1rem] lg:px-[1.25rem]">

          <div className="flex items-center gap-1.5 sm:gap-2">
            <img src={logo} alt="Logo" className="h-[1.5rem] sm:h-[1.75rem] md:h-[2rem] lg:h-[2.5rem] w-auto" />
            <span className="text-[#5C0EA4] text-[1rem] sm:text-[1.125rem] md:text-[1.25rem] lg:text-[1.5rem] font-bold leading-none">VOW</span>
          </div>

          <ul className="hidden lg:flex items-center gap-[1.875rem] xl:gap-[3.75rem] 2xl:gap-[5.625rem]">
            <li onClick={() => handleNavigation('home')} className="text-[#969696] font-inter text-[0.875rem] xl:text-[0.9375rem] 2xl:text-[1rem] leading-[1.2rem] font-normal hover:text-[#5C0EA4] cursor-pointer transition-colors whitespace-nowrap">
              Home
            </li>
            <li onClick={() => handleNavigation('features')} className="text-[#969696] font-inter text-[0.875rem] xl:text-[0.9375rem] 2xl:text-[1rem] leading-[1.2rem] font-normal hover:text-[#5C0EA4] cursor-pointer transition-colors whitespace-nowrap">
              Features
            </li>
            <li onClick={() => handleNavigation('user-roles')} className="text-[#969696] font-inter text-[0.875rem] xl:text-[0.9375rem] 2xl:text-[1rem] leading-[1.2rem] font-normal hover:text-[#5C0EA4] cursor-pointer transition-colors whitespace-nowrap">
              About
            </li>
            <li onClick={() => handleNavigation('subscribe')} className="text-[#969696] font-inter text-[0.875rem] xl:text-[0.9375rem] 2xl:text-[1rem] leading-[1.2rem] font-normal hover:text-[#5C0EA4] cursor-pointer transition-colors whitespace-nowrap">
              Contact
            </li>
          </ul>

          <div className="hidden lg:flex items-center gap-2 xl:gap-[0.625rem]">
            <Link
              to="/login"
              className="w-[6.25rem] xl:w-[8.75rem] 2xl:w-[10rem] h-[2.375rem] xl:h-[2.625rem] 2xl:h-[2.75rem] flex items-center justify-center rounded-[0.5rem] border border-[#5C0EA4] text-[#5C0EA4] text-[0.875rem] xl:text-[1.125rem] 2xl:text-[1.25rem] font-normal hover:bg-[#5C0EA4] hover:text-white transition-all whitespace-nowrap"
            >
              Log in
            </Link>

            <Link
              to="/signup"
              className="w-[6.25rem] xl:w-[8.75rem] 2xl:w-[10rem] h-[2.375rem] xl:h-[2.625rem] 2xl:h-[2.75rem] flex items-center justify-center rounded-[0.5rem] bg-[#450B7B] text-white text-[0.875rem] xl:text-[1.125rem] 2xl:text-[1.25rem] font-normal hover:bg-[#5C0EA4] transition-all whitespace-nowrap"
            >
              Sign up
            </Link>
          </div>

          <button 
            className="lg:hidden flex items-center justify-center focus:outline-none flex-shrink-0"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <img src={hamburgerIcon} alt="Menu" className="w-[1.5rem] h-[1.5rem] sm:w-[1.75rem] sm:h-[1.75rem] md:w-[2rem] md:h-[2rem]" />
          </button>
        </nav>

        <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-[31.25rem] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="border-t border-[#DDDFE1] py-3 sm:py-4 md:py-[1rem] px-4 sm:px-5 md:px-[1.25rem] bg-white rounded-b-[0.75rem] sm:rounded-b-[0.875rem] md:rounded-b-[1rem]">
            <ul className="flex flex-col gap-2 sm:gap-3 md:gap-[0.75rem] mb-3 sm:mb-4 md:mb-[1rem]">
              <li 
                className="text-[#969696] font-inter text-[0.875rem] sm:text-[0.9375rem] md:text-[1rem] font-normal hover:text-[#5C0EA4] cursor-pointer transition-colors py-1.5 sm:py-2"
                onClick={() => handleNavigation('home')}
              >
                Home
              </li>
              <li 
                className="text-[#969696] font-inter text-[0.875rem] sm:text-[0.9375rem] md:text-[1rem] font-normal hover:text-[#5C0EA4] cursor-pointer transition-colors py-1.5 sm:py-2"
                onClick={() => handleNavigation('features')}
              >
                Features
              </li>
              <li 
                className="text-[#969696] font-inter text-[0.875rem] sm:text-[0.9375rem] md:text-[1rem] font-normal hover:text-[#5C0EA4] cursor-pointer transition-colors py-1.5 sm:py-2"
                onClick={() => handleNavigation('user-roles')}
              >
                About
              </li>
              <li 
                className="text-[#969696] font-inter text-[0.875rem] sm:text-[0.9375rem] md:text-[1rem] font-normal hover:text-[#5C0EA4] cursor-pointer transition-colors py-1.5 sm:py-2"
                onClick={() => handleNavigation('subscribe')}
              >
                Contact
              </li>
            </ul>

            <div className="flex flex-col gap-2 sm:gap-2.5 md:gap-[0.75rem] pt-2">
              <Link
                to="/login"
                className="w-full h-[2.625rem] sm:h-[2.75rem] md:h-[3rem] flex items-center justify-center rounded-[0.5rem] border border-[#5C0EA4] text-[#5C0EA4] text-[0.9375rem] sm:text-[1rem] md:text-[1.125rem] font-normal hover:bg-[#5C0EA4] hover:text-white transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Log in
              </Link>

              <Link
                to="/signup"
                className="w-full h-[2.625rem] sm:h-[2.75rem] md:h-[3rem] flex items-center justify-center rounded-[0.5rem] bg-[#450B7B] text-white text-[0.9375rem] sm:text-[1rem] md:text-[1.125rem] font-normal hover:bg-[#5C0EA4] transition-all"
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