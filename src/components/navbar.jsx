import React from 'react';
import { Link } from 'react-router-dom'; 
import logo from '../assets/logo.png';

const Navbar = () => {
  return (
    <div className=" w-full fixed top-0 flex justify-center py-[10px] px-[60px] bg-white z-50 ">
      <div className="w-[1160px] border border-[#DDDFE1] rounded-[16px] bg-white ">
        <nav className="flex justify-between items-center h-[64px] w-full px-[16px]">
        
          <div className="flex items-center gap-[10px]">
            <img src={logo} alt="Logo" className="h-8 w-auto" />
            <span className="text-[#5C0EA4] text-xl font-bold">VOW</span>
          </div>


          <ul className="flex items-center gap-[90px]">
            <li className=" text-[#969696] font-inter text-[16px] leading-[19.2px] font-normal hover:text-[#5C0EA4] cursor-pointer">
              Home
            </li>
            <li className=" text-[#969696] font-inter text-[16px] leading-[19.2px] font-normal hover:text-[#5C0EA4] cursor-pointer">
              Features
            </li>
            <li className=" text-[#969696] font-inter text-[16px] leading-[19.2px] font-normal hover:text-[#5C0EA4] cursor-pointer">
              About
            </li>
            <li className=" text-[#969696] font-inter text-[16px] leading-[19.2px] font-normal hover:text-[#5C0EA4] cursor-pointer">
              Contact
            </li>
          </ul>

         
          <div className="flex items-center gap-[10px]">
            <Link
              to="/login"
              className="w-[160px] h-[44px] flex items-center justify-center rounded-[8px] border border-[#5C0EA4] text-[#5C0EA4] text-[20px] font-normal"
            >
              Log in
            </Link>

            <Link
              to="/signup"
              className="w-[160px] h-[44px] flex items-center justify-center rounded-[8px] bg-[#450B7B] text-white text-[20px] font-normal"
            >
              Sign up
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;

