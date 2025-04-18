
import React from 'react';

export const ProcessingVisual = ({ currentStage, stages, originalImage, processedImage, processedImages }) => {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="relative flex justify-between mb-12 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-lg">
        {stages.map((stage, index) => {
          let status;
          if (index < currentStage) status = 'completed';
          else if (index === currentStage) status = 'current';
          else status = 'upcoming';
          
          return (
            <div key={stage} className="flex flex-col items-center w-1/6">
              <div 
                className={`h-10 w-10 rounded-full flex items-center justify-center 
                  ${status === 'completed' ? 'bg-[#F97316] text-white' : 
                    status === 'current' ? 'bg-white text-[#1A1F2C] ring-2 ring-[#F97316]' : 
                    'bg-white/10 text-white/50'}`}
              >
                {status === 'completed' ? (
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              
              <div className="text-center mt-2">
                <p className={`text-sm font-medium
                  ${status === 'completed' ? 'text-[#F97316]' : 
                    status === 'current' ? 'text-white' : 
                    'text-white/50'}`}
                >
                  {stage}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Processing Steps Grid */}
      {originalImage && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {/* Original Image */}
          <div className="bg-black/30 p-4 rounded-lg transform transition-all duration-500 hover:scale-[1.02] hover:shadow-xl">
            <h3 className="text-lg font-medium mb-3 text-white/80">Original Image</h3>
            <div className="aspect-video bg-black/50 rounded-md flex items-center justify-center overflow-hidden">
              <img 
                src={originalImage} 
                alt="Original" 
                className="max-h-full max-w-full object-contain transition-transform duration-500 hover:scale-105" 
              />
            </div>
          </div>
          
          {/* Intermediate Processing */}
          <div className="bg-black/30 p-4 rounded-lg transform transition-all duration-500 hover:scale-[1.02] hover:shadow-xl">
            <h3 className="text-lg font-medium mb-3 text-white/80">
              {currentStage === 1 ? 'Grayscale' :
               currentStage === 2 ? 'Denoising' :
               currentStage === 3 ? 'Thresholding' :
               currentStage === 4 ? 'Edge Detection' : 'Processing'}
            </h3>
            <div className="aspect-video bg-black/50 rounded-md flex items-center justify-center overflow-hidden">
              {processedImages && (
                <img 
                  src={`http://localhost:5000${currentStage === 1 ? processedImages.gray :
                                                currentStage === 2 ? processedImages.blur :
                                                currentStage === 3 ? processedImages.thresh :
                                                currentStage === 4 ? processedImages.edge : processedImages.thresh}`}
                  alt="Processing Stage"
                  className="max-h-full max-w-full object-contain transition-transform duration-500 hover:scale-105"
                />
              )}
            </div>
          </div>
          
          {/* Final Result */}
          <div className="bg-black/30 p-4 rounded-lg transform transition-all duration-500 hover:scale-[1.02] hover:shadow-xl">
            <h3 className="text-lg font-medium mb-3 text-white/80">Final Result</h3>
            <div className="aspect-video bg-black/50 rounded-md flex items-center justify-center overflow-hidden">
              {processedImages && processedImages.thresh ? (
                <img 
                  src={`http://localhost:5000${processedImages.thresh}`} 
                  alt="Final Result" 
                  className="max-h-full max-w-full object-contain transition-transform duration-500 hover:scale-105"
                />
              ) : (
                <div className="text-white/30 flex flex-col items-center justify-center animate-pulse">
                  <svg className="animate-spin h-8 w-8 text-[#F97316]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="mt-2">Processing...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Processing Description */}
      <div className="mt-8 text-white/70 text-center">
        <p className="max-w-2xl mx-auto">
          Our advanced image processing pipeline enhances text visibility by converting to grayscale, 
          reducing noise, and optimizing contrast before applying OCR technology.
        </p>
      </div>
    </div>
  );
};
