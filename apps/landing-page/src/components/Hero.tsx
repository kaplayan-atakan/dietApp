import React from 'react';

export default function Hero() {
  return (
    <section className="pt-16 bg-gradient-to-r from-indigo-600 to-purple-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Your AI-Powered
            <br />
            <span className="text-yellow-300">Fitness Coach</span>
          </h1>
          <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
            Transform your health with personalized workouts, nutrition plans, and real-time AI guidance. 
            Get the body you want with the support you need.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/app"
              className="bg-white text-indigo-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Free Trial
            </a>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors">
              Watch Demo
            </button>
          </div>
        </div>
        
        <div className="mt-16 flex justify-center">
          <div className="relative">
            <img 
              src="/hero-app-screenshot.png" 
              alt="AI Fitness Coach App"
              className="rounded-lg shadow-2xl max-w-full h-auto"
            />
            <div className="absolute -top-4 -right-4 bg-yellow-400 text-gray-900 px-4 py-2 rounded-full font-semibold">
              🎯 AI-Powered
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
