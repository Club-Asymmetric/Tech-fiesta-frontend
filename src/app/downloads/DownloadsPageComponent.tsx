'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MinimalClockCollection from '@/components/MinimalClock';

export default function DownloadsPageComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDownload = () => {
    setIsLoading(true);
    try {
      // Create a link element
      const link = document.createElement('a');
      link.href = '/Project_Presentation.pdf';
      link.download = 'Project_Presentation.pdf';
      link.target = '_blank';
      // Trigger the download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Add the same fixed clock background as other pages */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <MinimalClockCollection />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Back button */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={() => router.back()}
          className="bg-white/10 backdrop-blur-md text-white font-semibold py-2 px-4 rounded-lg hover:bg-white/20 transition-colors duration-300"
        >
          Go Back
        </button>
      </div>

      {/* Content layer */}
      <div className="relative z-10 min-h-screen py-6 sm:py-12 px-4 overflow-x-hidden">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 pt-20">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
              Downloads
            </h1>
          </div>

          {/* PDF Viewer Section */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 mb-8 border border-white/20 shadow-2xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Project Presentation
                </h2>
                <p className="text-gray-300">
                  View and download the complete project presentation
                </p>
              </div>
              {/* Download Button */}
              <button
                onClick={handleDownload}
                disabled={isLoading}
                className="mt-4 md:mt-0 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Downloading...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download PDF
                  </>
                )}
              </button>
            </div>
            {/* PDF Embed */}
            <div className="bg-gray-100 rounded-lg overflow-hidden">
              <iframe
                src="/Project_Presentation.pdf"
                title="Project Presentation"
                className="w-full h-[600px] md:h-[700px]"
                style={{
                  border: 'none',
                  borderRadius: '8px'
                }}
              >
                <p className="p-4 text-gray-600">
                  Your browser does not support PDFs. 
                  <a 
                    href="/Project_Presentation.pdf" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline ml-1"
                  >
                    Click here to view the PDF
                  </a>
                </p>
              </iframe>
            </div>
          </div>
          {/* Additional Info */}
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-2">
              Document Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-300">
              <div>
                <span className="font-medium">File Name:</span>
                <p>Project_Presentation.pdf</p>
              </div>
              <div>
                <span className="font-medium">Type:</span>
                <p>PDF Document</p>
              </div>
              <div>
                <span className="font-medium">Access:</span>
                <p>View & Download</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
