
import React, { useState } from 'react';

export const TextOutput = ({ rawText }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([rawText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = 'extracted-text.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-black/30 backdrop-blur-lg rounded-xl overflow-hidden border border-white/10 shadow-lg transition-all duration-500 ease-in-out hover:bg-black/40 hover:scale-[1.01] hover:shadow-xl">
        {/* Text Display */}
        <div className="bg-black/50 p-6 rounded-t-xl">
          <pre className="whitespace-pre-wrap break-words text-white/80 font-mono text-sm max-h-[32rem] overflow-y-auto custom-scrollbar">
            {rawText || 'No text was extracted from this image.'}
          </pre>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-end items-center gap-2 p-3 border-t border-white/10 bg-black/20">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F97316] to-orange-500 text-white rounded-lg font-medium transition-all duration-500 ease-in-out hover:shadow-lg hover:shadow-orange-500/20 hover:scale-105 active:scale-95"
          >
            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
            {copied ? 'Copied!' : 'Copy Text'}
          </button>
          
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-white/10 to-white/5 text-white/90 rounded-lg font-medium transition-all duration-500 ease-in-out hover:from-white/20 hover:to-white/10 hover:shadow-lg hover:shadow-white/10 hover:scale-105 active:scale-95"
          >
            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </button>
        </div>
      </div>
      
      <div className="mt-4 text-center text-white/50 text-sm">
        <p>
          The extracted text may contain some errors depending on image quality and text clarity.
        </p>
      </div>
    </div>
  );
};
