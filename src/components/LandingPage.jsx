import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../index.css';

const LandingPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Create floating particles with improved variety
    const createParticles = () => {
      const container = document.getElementById('particles');
      if (!container) return;
      
      const particleCount = 70;
      const colors = ['#f97316', '#f59e0b', '#d97706', '#fbbf24', '#ffffff'];
      
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // More varied sizes
        const size = Math.random() * 12 + 3;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random position
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Random opacity
        particle.style.opacity = (Math.random() * 0.6 + 0.2).toString();
        
        // Random colors
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Random animation delay and duration
        particle.style.animationDelay = `${Math.random() * 10}s`;
        particle.style.animationDuration = `${Math.random() * 20 + 15}s`;
        
        container.appendChild(particle);
      }
    };

    // Initialize particles and set loaded state
    createParticles();
    setTimeout(() => setIsLoaded(true), 300);

    return () => {
      const container = document.getElementById('particles');
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-900 to-black overflow-hidden">
      {/* Improved particle background */}
      <div id="particles" className="fixed inset-0 z-0"></div>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent to-black opacity-70 z-0"></div>
      
      {/* Main content */}
      <div className="relative min-h-screen flex items-center justify-center z-10 px-4">
        <div className={`text-center px-8 py-16 backdrop-blur-lg bg-black bg-opacity-30 rounded-3xl border border-orange-500 border-opacity-20 shadow-2xl max-w-4xl mx-4 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Logo and brand section */}
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 md:w-20 md:h-20 relative mr-4">
              <div className="absolute inset-0 bg-orange-500 opacity-20 rounded-full animate-pulse"></div>
              <svg className="w-full h-full text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tighter">
              <span className="text-white">Textify</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600">AI</span>
            </h1>
          </div>
          
          {/* Vision header with glow effect */}
          <h2 className="text-4xl md:text-5xl font-bold mb-8 relative inline-block">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-300 via-orange-500 to-orange-300 animate-text-shimmer bg-size-200">VISION</span>
            <div className="absolute -inset-1 bg-orange-500 opacity-20 blur-lg -z-10 rounded-full"></div>
          </h2>
          
          {/* Descriptive text with better formatting */}
          <p className="text-xl md:text-2xl text-white text-opacity-90 mb-6 font-light">
            Transform your images into precise text with our
          </p>
          <p className="text-lg md:text-xl text-white text-opacity-80 mb-12 max-w-2xl mx-auto">
            <span className="font-semibold text-orange-400">advanced AI technology</span> that recognizes, analyzes, and extracts text from any visual content with unparalleled accuracy.
          </p>
          
          {/* Features section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { title: "Instant Recognition", icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" },
              { title: "High Precision", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
              { title: "Any Format", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }
            ].map((feature, index) => (
              <div key={index} className="p-4 rounded-xl bg-white bg-opacity-5 backdrop-blur-sm border border-white border-opacity-10 transform transition-transform duration-300 hover:scale-105">
                <div className="w-12 h-12 mb-4 mx-auto bg-orange-500 bg-opacity-20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={feature.icon}></path>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">{feature.title}</h3>
              </div>
            ))}
          </div>
          
          {/* CTA button with enhanced effects */}
          <Link 
            to="/app" 
            className="inline-block relative overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-4 px-10 rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg group"
          >
            <span className="relative z-10 flex items-center justify-center">
              Get Started
              <svg className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="absolute top-0 left-0 w-full h-full bg-white opacity-20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></span>
          </Link>
          
          {/* Trust indicators */}
          <div className="mt-12 text-white text-opacity-60 text-sm">
            Trusted by thousands of users worldwide
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;