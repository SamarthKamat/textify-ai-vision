
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
    <div className="max-w-4xl mx-auto">
      <div className="bg-black/30 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10 shadow-lg transition-all duration-300 hover:bg-black/40">
        {/* Text Display */}
        <div className="bg-black/50 p-6 rounded-t-lg relative">
          <div className="absolute top-2 right-2 flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
          </div>
          <pre className="whitespace-pre-wrap break-words text-white/80 font-mono text-sm max-h-96 overflow-y-auto custom-scrollbar">
            {rawText || 'No text was extracted from this image.'}
          </pre>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-end items-center gap-2 p-3 border-t border-white/10 bg-black/20">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-[#F97316] to-orange-500 text-white rounded-md transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20 hover:scale-105"
          >
            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
            {copied ? 'Copied!' : 'Copy Text'}
          </button>
          
          <button
            onClick={handleDownload}
            className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 rounded-md transition-all duration-300 hover:shadow-lg hover:shadow-white/10"
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
