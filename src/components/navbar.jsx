import React from 'react';
import { Link } from 'react-router-dom'; // ✅ Import Link

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center py-4 px-6 md:px-20 shadow-md bg-white">
      <div className="text-purple-600 font-bold text-xl">
        V <span className="text-5C0EA4">vow</span>
      </div>

      <ul className="hidden md:flex space-x-8 font-medium text-gray-700">
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
          className="bg-purple-600 text-white px-4 py-1 rounded-md font-semibold hover:bg-purple-700 transition"
        >
          Sign up
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
