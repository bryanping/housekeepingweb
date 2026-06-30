'use client';

import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-brand-400">HousekeepingWeb</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-gray-700 hover:text-brand-400 transition-colors">Home</a>
            <a href="/products" className="text-gray-700 hover:text-brand-400 transition-colors">Products</a>
            <a href="/cart" className="text-gray-700 hover:text-brand-400 transition-colors">Cart</a>
            <button 
              onClick={() => console.log('Login/Logout')}
              className="bg-brand-400 text-white px-4 py-2 rounded-md hover:bg-brand-500 transition-colors"
            >
              Login
            </button>
          </div>
          
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-brand-400 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-400 hover:bg-gray-50">Home</a>
            <a href="/products" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-400 hover:bg-gray-50">Products</a>
            <a href="/cart" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-400 hover:bg-gray-50">Cart</a>
            <button 
              onClick={() => console.log('Login/Logout')}
              className="w-full mt-2 bg-brand-400 text-white px-4 py-2 rounded-md hover:bg-brand-500 transition-colors"
            >
              Login
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}