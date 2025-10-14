import React from 'react';
import { Link } from 'react-router-dom'; 
import logo from '../assets/logo.png';

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center py-4 px-6 md:px-20 shadow-md bg-white">
      <div className="text-purple-600 font-bold text-xl flex">
        <img src={logo} alt="Logo" className="h-8 w-auto" />
         <span className="text-5C0EA4">vow</span>
      </div>

      <ul className="hidden md:flex space-x-8 font-medium text-gray-700"
      style={{ color: '#969696' }}>
        <li>Home</li>
        <li>Features</li>
        <li>About</li>
        <li>Contact</li>
      </ul>

      <div className="space-x-4">
        
        <Link
          to="/login"
          className="border-2 border-purple-600 text-5C0EA4 px-4 py-1 rounded-md font-semibold hover:bg-purple-100 transition"
        >
          Log in
        </Link>

        <Link
          to="/signup"
          className=" text-white px-4 py-1 rounded-md font-semibold hover:bg-purple-700 transition"
          style={{ backgroundColor: '#450B7B' }}
        >
          Sign up
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
