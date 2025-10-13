import React from 'react';

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center py-4 px-6 md:px-20 shadow-md bg-white">
      <div className="text-purple-600 font-bold text-xl">
        V <span className="text-black">vow</span>
      </div>

      <ul className="hidden md:flex space-x-8 font-medium text-gray-700">
        <li>Home</li>
        <li>Features</li>
        <li>About</li>
        <li>Contact</li>
      </ul>

      <div className="space-x-4">
        <button className="border-2 border-purple-600 text-purple-600 px-4 py-1 rounded-md font-semibold">
          Log in
        </button>
        <button className="bg-purple-600 text-white px-4 py-1 rounded-md font-semibold">
          Sign up
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
