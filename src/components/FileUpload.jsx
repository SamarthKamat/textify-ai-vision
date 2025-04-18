
import React, { useState, useRef } from 'react';

export const FileUpload = ({ onFileChange, onProcess, isProcessing, previewUrl, error }) => {
  const dropRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length) {
      validateAndProcessFile(files[0]);
    }
  };
  
  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files.length) {
      validateAndProcessFile(files[0]);
    }
  };
  
  const validateAndProcessFile = (file) => {
    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/bmp'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPEG, PNG, or BMP)');
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit');
      return;
    }
    
    onFileChange(file);
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      {/* Drag & Drop Area */}
      <div
        ref={dropRef}
        className={`border-2 border-dashed rounded-xl p-8 transition-all backdrop-blur-sm bg-white/5
          ${isDragging ? 'border-[#F97316] bg-[#F97316]/10 scale-102 shadow-2xl shadow-[#F97316]/20' : 'border-white/20 hover:border-white/40 hover:bg-white/10 hover:scale-101 hover:shadow-xl'}
          ${previewUrl ? 'border-opacity-50 bg-black/20' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {!previewUrl ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-white/50" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <h3 className="mt-4 text-xl font-medium text-white">Drag and drop your image here</h3>
            <p className="mt-2 text-white/60">or</p>
            <label className="mt-4 inline-flex cursor-pointer items-center px-4 py-2 bg-[#F97316] text-white rounded-md hover:bg-[#F97316]/90 transition-colors">
              Browse Files
              <input
                type="file"
                className="hidden"
                accept="image/jpeg, image/png, image/bmp"
                onChange={handleFileSelect}
                disabled={isProcessing}
              />
            </label>
            <p className="mt-4 text-sm text-white/50">
              Supported formats: JPEG, PNG, BMP (max 5MB)
            </p>
          </div>
        ) : (
          <div className="relative">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="max-h-96 mx-auto rounded-lg object-contain" 
            />
            <button 
              className="absolute top-2 right-2 bg-black/50 p-1 rounded-full hover:bg-black/70 transition-colors"
              onClick={() => onFileChange(null)}
              disabled={isProcessing}
            >
              <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="mt-4 bg-red-500/20 border border-red-500/50 text-white p-3 rounded-md">
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      {/* Convert Button */}
      {previewUrl && (
        <div className="mt-6 text-center">
          <button
            onClick={onProcess}
            disabled={isProcessing || !previewUrl}
            className={`px-8 py-3 rounded-md font-medium text-lg transition-all
              ${isProcessing ? 
                'bg-gray-600 cursor-not-allowed' : 
                'bg-gradient-to-r from-[#F97316] to-orange-600 hover:shadow-lg hover:shadow-orange-500/20'}`}
          >
            {isProcessing ? (
              <span className="flex items-center space-x-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processing...</span>
              </span>
            ) : 'Extract Text'}
          </button>
        </div>
      )}
    </div>
  );
};
