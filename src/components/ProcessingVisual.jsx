import React from 'react';

export const ProcessingVisual = ({ currentStage, stages, originalImage, processedImage, processedImages }) => {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="flex justify-between mb-12">
        {stages.map((stage, index) => {
          // Define the status of this step
          let status;
          if (index < currentStage) status = 'completed';
          else if (index === currentStage) status = 'current';
          else status = 'upcoming';
          
          return (
            <div key={stage} className="flex flex-col items-center w-1/6">
              {/* Circle with number */}
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
              
              {/* Label */}
              <div className="text-center mt-2">
                <p className={`text-sm font-medium
                  ${status === 'completed' ? 'text-[#F97316]' : 
                    status === 'current' ? 'text-white' : 
                    'text-white/50'}`}
                >
                  {stage}
                </p>
              </div>
              
              {/* Connector line (except for last item) */}
              {index < stages.length - 1 && (
                <div 
                  className={`h-[2px] w-full absolute left-[50%] top-5 z-[-1]
                    ${status === 'completed' ? 'bg-[#F97316]' : 'bg-white/20'}`}
                ></div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Processing Steps Grid */}
      {originalImage && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {/* Original Image */}
          <div className="bg-black/30 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-3 text-white/80">Original Image</h3>
            <div className="aspect-video bg-black/50 rounded-md flex items-center justify-center overflow-hidden">
              <img 
                src={originalImage} 
                alt="Original" 
                className="max-h-full max-w-full object-contain" 
              />
            </div>
          </div>
          
          {/* Grayscale Image */}
          <div className="bg-black/30 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-3 text-white/80">Grayscale</h3>
            <div className="aspect-video bg-black/50 rounded-md flex items-center justify-center overflow-hidden">
              {processedImages?.gray ? (
                <img 
                  src={`http://localhost:5000${processedImages.gray}`} 
                  alt="Grayscale" 
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <div className="text-white/30 flex flex-col items-center justify-center">
                  <p>Processing...</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Blurred Image */}
          <div className="bg-black/30 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-3 text-white/80">Blurred</h3>
            <div className="aspect-video bg-black/50 rounded-md flex items-center justify-center overflow-hidden">
              {processedImages?.blur ? (
                <img 
                  src={`http://localhost:5000${processedImages.blur}`} 
                  alt="Blurred" 
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <div className="text-white/30 flex flex-col items-center justify-center">
                  <p>Processing...</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Edge Detection */}
          <div className="bg-black/30 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-3 text-white/80">Edge Detection</h3>
            <div className="aspect-video bg-black/50 rounded-md flex items-center justify-center overflow-hidden">
              {processedImages?.edge ? (
                <img 
                  src={`http://localhost:5000${processedImages.edge}`} 
                  alt="Edge Detection" 
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <div className="text-white/30 flex flex-col items-center justify-center">
                  <p>Processing...</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Thresholded Image */}
          <div className="bg-black/30 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-3 text-white/80">Thresholded</h3>
            <div className="aspect-video bg-black/50 rounded-md flex items-center justify-center overflow-hidden">
              {processedImages?.thresh ? (
                <img 
                  src={`http://localhost:5000${processedImages.thresh}`} 
                  alt="Thresholded" 
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <div className="text-white/30 flex flex-col items-center justify-center">
                  <p>Processing...</p>
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