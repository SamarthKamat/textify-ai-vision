
import React from 'react';

export const TechStack = () => {
  const technologies = [
    {
      name: 'OpenCV',
      description: 'Image preprocessing and enhancement',
      icon: '📸'
    },
    {
      name: 'Tesseract OCR',
      description: 'Text extraction from images',
      icon: '📝'
    },
    {
      name: 'Flask',
      description: 'Python backend API server',
      icon: '🐍'
    },
    {
      name: 'React',
      description: 'Interactive frontend UI',
      icon: '⚛️'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Pipeline Visualization */}
      <div className="mb-12">
        <div className="relative py-4">
          {/* Pipeline Line */}
          <div className="absolute h-1 bg-gradient-to-r from-blue-500 via-[#F97316] to-green-500 top-1/2 left-0 right-0 transform -translate-y-1/2"></div>
          
          {/* Pipeline Steps */}
          <div className="flex justify-between relative">
            {technologies.map((tech, index) => (
              <div key={tech.name} className="flex flex-col items-center">
                {/* Icon Circle */}
                <div className={`h-14 w-14 rounded-full flex items-center justify-center bg-[#1A1F2C] border-2 border-white/20 z-10 text-2xl`}>
                  {tech.icon}
                </div>
                
                {/* Label */}
                <div className="mt-4 text-center">
                  <h3 className="font-medium text-white">{tech.name}</h3>
                  <p className="text-sm text-white/60 mt-1">{tech.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Implementation Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-black/30 rounded-lg p-6">
          <h3 className="text-xl font-medium mb-4">Image Processing Pipeline</h3>
          <ul className="list-disc pl-5 space-y-2 text-white/80">
            <li>Grayscale conversion to simplify processing</li>
            <li>Gaussian blur for noise reduction</li>
            <li>Adaptive thresholding for improved contrast</li>
            <li>Deskewing to correct rotated text</li>
            <li>Edge enhancement for better character recognition</li>
          </ul>
        </div>
        
        <div className="bg-black/30 rounded-lg p-6">
          <h3 className="text-xl font-medium mb-4">OCR and Text Processing</h3>
          <ul className="list-disc pl-5 space-y-2 text-white/80">
            <li>Tesseract OCR engine for accurate text detection</li>
            <li>Layout analysis to preserve document structure</li>
            <li>Character recognition optimized for multiple languages</li>
            <li>Format preservation for tables and special content</li>
            <li>Fast processing with parallelized operations</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
