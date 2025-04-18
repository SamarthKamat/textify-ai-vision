import React, { useState, useRef } from 'react';
import { FileUpload } from '../components/FileUpload.jsx';
import { ProcessingVisual } from '../components/ProcessingVisual.jsx';
import { TextOutput } from '../components/TextOutput.jsx';
import { TechStack } from '../components/TechStack.jsx';

const Index = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedData, setProcessedData] = useState(null);
  const [processingStage, setProcessingStage] = useState(0);
  const [error, setError] = useState(null);
  
  const stages = [
    'Upload', 
    'Grayscale', 
    'Denoising', 
    'Thresholding', 
    'OCR', 
    'Complete'
  ];
  
  const handleFileChange = (selectedFile) => {
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setProcessedData(null);
    setError(null);
  };
  
  const handleProcess = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    setProcessingStage(1);
    
    // Prepare form data for API
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      // Simulate processing stages with delays
      const stageSimulator = setInterval(() => {
        setProcessingStage(prev => {
          if (prev < stages.length - 2) return prev + 1;
          clearInterval(stageSimulator);
          return prev;
        });
      }, 700); // Adjust for realistic timing
      
      // Actual API call
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process image');
      }
      
      const data = await response.json();
      
      // Final stage
      setProcessingStage(stages.length - 1);
      setProcessedData(data);
    } catch (err) {
      setError(err.message || 'An error occurred during processing');
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1F2C] via-[#2A2F3C] to-[#1A1F2C] text-white overflow-hidden relative before:absolute before:inset-0 before:bg-[url('/grid.svg')] before:opacity-10 before:bg-center before:bg-repeat before:pointer-events-none">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/5 backdrop-blur-xl border-b border-white/10 px-6 py-4 shadow-lg transition-all duration-300 hover:bg-white/10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F97316] to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#F97316] to-orange-500 bg-clip-text text-transparent animate-glow hover:scale-105 transition-transform duration-300 cursor-default">TextifyAI Vision</h1>
          </div>
          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              {['Convert', 'How It Works', 'Tech Stack'].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-white/80 hover:text-white transition-all duration-300 hover:text-glow relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-orange-500 hover:after:w-full after:transition-all after:duration-300">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto px-4 py-12 relative z-10">
        {/* Hero Section with Upload */}
        <section id="convert" className="mb-24">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 relative inline-block">
              Extract Text from <span className="bg-gradient-to-r from-[#F97316] to-orange-500 bg-clip-text text-transparent relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-gradient-to-r after:from-[#F97316] after:to-orange-500 after:opacity-50">Any Image</span>
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Upload an image and our AI-powered tool will extract all text using advanced computer vision techniques
            </p>
          </div>
          
          <FileUpload 
            onFileChange={handleFileChange} 
            onProcess={handleProcess} 
            isProcessing={isProcessing} 
            previewUrl={previewUrl}
            error={error}
          />
        </section>
        
        {/* Processing Visualization */}
        {(isProcessing || processedData) && (
          <section id="how-it-works" className="mb-24">
            <h2 className="text-3xl font-bold mb-8 text-center">Image Processing Pipeline</h2>
            
            <ProcessingVisual 
              currentStage={processingStage} 
              stages={stages} 
              originalImage={previewUrl}
              processedImage={processedData?.preprocessed_image}
            />
          </section>
        )}
        
        {/* Text Output Section */}
        {processedData && (
          <section className="mb-24">
            <h2 className="text-3xl font-bold mb-8 text-center">Extracted Text</h2>
            
            <TextOutput 
              rawText={processedData.raw_text} 
            />
          </section>
        )}
        
        {/* Tech Stack Section */}
        <section id="tech-stack" className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Technology Stack</h2>
          <TechStack />
        </section>
      </main>
      
      <footer className="bg-black/30 py-6 px-4">
        <div className="max-w-6xl mx-auto text-center text-white/60 text-sm">
          <p>© {new Date().getFullYear()} TextifyAI Vision. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
