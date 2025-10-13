import React, { useState } from 'react';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-100 to-white px-4">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md relative">
        
        <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl">
          &times;
        </button>

       
        <div className="flex justify-center mb-4">
          <img src="/assets/logo.svg" alt="Logo" className="h-8" />
        </div>

        
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-1">
          Welcome back
        </h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          Do not have an account?{' '}
          <a href="#" className="text-purple-600 font-medium hover:underline">
            Sign up
          </a>
        </p>

        
        <form>
         
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email:
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          
          <div className="mb-4 relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password:
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            
            <span
              className="absolute right-3 top-9 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              👁
            </span>
          </div>

          
          <div className="flex items-center justify-between text-sm mb-6">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="form-checkbox h-4 w-4" />
              <span>Remember me</span>
            </label>
            <a href="#" className="text-purple-600 hover:underline">
              forgot password
            </a>
          </div>

         
          <button
            type="submit"
            className="w-full bg-purple-700 text-white py-2 rounded-md font-semibold hover:bg-purple-800 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
