import React, { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-indigo-600">AI Fitness Coach</h1>
            </div>
          </div>
          
          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a href="#features" className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
                Features
              </a>
              <a href="#testimonials" className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
                Testimonials
              </a>
              <a href="#pricing" className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
                Pricing
              </a>
            </div>
          </nav>

          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <a
                href="/app"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
              >
                Get Started
              </a>
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-indigo-600 focus:outline-none focus:text-indigo-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            <a href="#features" className="text-gray-700 hover:text-indigo-600 block px-3 py-2 text-base font-medium">
              Features
            </a>
            <a href="#testimonials" className="text-gray-700 hover:text-indigo-600 block px-3 py-2 text-base font-medium">
              Testimonials
            </a>
            <a href="#pricing" className="text-gray-700 hover:text-indigo-600 block px-3 py-2 text-base font-medium">
              Pricing
            </a>
            <a
              href="/app"
              className="bg-indigo-600 text-white block px-3 py-2 text-base font-medium rounded-md hover:bg-indigo-700"
            >
              Get Started
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
