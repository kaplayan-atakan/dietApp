import React, { useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import { Features } from './components/Features';
import { Testimonials } from './components/Testimonials';
import { Pricing } from './components/Pricing';
import { Footer } from './components/Footer';
import TestErrorLogging from './components/TestErrorLogging';
import { initializeLandingPageLogger } from './utils/errorLogger';
import './App.css';

function App() {
  useEffect(() => {
    // Initialize error logging when app mounts
    initializeLandingPageLogger();
  }, []);
  return (
    <div className="App">
      <Header />
      <Hero />
      <Features />
      <TestErrorLogging />
      <Testimonials />
      <Pricing />
      <Footer />
    </div>
  );
}

export default App;
