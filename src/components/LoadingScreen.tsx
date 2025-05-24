"use client";

import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
  minimumLoadTime?: number;
}

// Predefined positions and animations to avoid hydration issues
const backgroundClocks = [
  { left: 15, top: 25, duration: 3.2, delay: 0.5, handSpeed: 2.1 },
  { left: 85, top: 15, duration: 4.1, delay: 1.2, handSpeed: 2.8 },
  { left: 70, top: 80, duration: 3.8, delay: 0.8, handSpeed: 2.3 },
  { left: 25, top: 75, duration: 3.5, delay: 1.5, handSpeed: 2.6 },
  { left: 90, top: 40, duration: 4.3, delay: 0.3, handSpeed: 2.2 },
  { left: 10, top: 60, duration: 3.7, delay: 1.8, handSpeed: 2.9 },
  { left: 60, top: 20, duration: 4.0, delay: 0.7, handSpeed: 2.4 },
  { left: 40, top: 90, duration: 3.3, delay: 1.1, handSpeed: 2.7 },
  { left: 80, top: 65, duration: 3.9, delay: 0.4, handSpeed: 2.0 },
  { left: 30, top: 35, duration: 4.2, delay: 1.7, handSpeed: 2.5 },
  { left: 95, top: 85, duration: 3.6, delay: 0.9, handSpeed: 2.8 },
  { left: 5, top: 10, duration: 4.4, delay: 1.3, handSpeed: 2.1 },
  { left: 55, top: 55, duration: 3.4, delay: 0.6, handSpeed: 2.6 },
  { left: 75, top: 30, duration: 4.1, delay: 1.9, handSpeed: 2.3 },
  { left: 20, top: 85, duration: 3.8, delay: 0.2, handSpeed: 2.9 },
  { left: 45, top: 5, duration: 3.7, delay: 1.4, handSpeed: 2.4 },
  { left: 65, top: 70, duration: 4.0, delay: 0.8, handSpeed: 2.2 },
  { left: 35, top: 45, duration: 3.5, delay: 1.6, handSpeed: 2.7 },
  { left: 85, top: 95, duration: 4.3, delay: 0.1, handSpeed: 2.5 },
  { left: 50, top: 25, duration: 3.9, delay: 1.0, handSpeed: 2.8 },
];

const LoadingScreen = ({ 
  onLoadingComplete, 
  minimumLoadTime = 2000 
}: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    // Prevent scroll during loading
    document.body.style.overflow = 'hidden';
    
    setIsMounted(true);
    
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / minimumLoadTime) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          // Always scroll to top after loading
          document.body.style.overflow = '';
          window.scrollTo(0, 0);
          
          setIsVisible(false);
          onLoadingComplete?.();
        }, 500);
      }
    }, 50);

    return () => {
      clearInterval(interval);
      // Cleanup on unmount
      document.body.style.overflow = '';
    };
  }, [minimumLoadTime, onLoadingComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      {/* Background pattern of small clocks */}
      {isMounted && (
        <div className="absolute inset-0 opacity-10">
          {backgroundClocks.map((clock, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${clock.left}%`,
                top: `${clock.top}%`,
                animation: `float ${clock.duration}s ease-in-out infinite`,
                animationDelay: `${clock.delay}s`,
              }}
            >
              <div className="w-8 h-8 rounded-full border border-white bg-black relative">
                <div 
                  className="absolute w-0.5 h-3 bg-white top-1 left-1/2 transform -translate-x-1/2 origin-bottom"
                  style={{
                    animation: `clockHand ${clock.handSpeed}s linear infinite`,
                  }}
                />
                <div className="absolute w-1 h-1 bg-blue-500 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main loading clock */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative">
          {/* Main clock face */}
          <div className="w-32 h-32 rounded-full border-4 border-white bg-black shadow-lg shadow-blue-500/20 relative">
            {/* Hour markers */}
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-4 bg-white"
                style={{
                  top: '8px',
                  left: '50%',
                  transformOrigin: '50% 56px',
                  transform: `translateX(-50%) rotate(${i * 30}deg)`,
                }}
              />
            ))}

            {/* Animated clock hands */}
            <div 
              className="absolute w-1 h-8 bg-white top-1/2 left-1/2 origin-bottom"
              style={{
                transform: 'translate(-50%, -100%)',
                animation: 'hourHand 4s linear infinite',
              }}
            />
            <div 
              className="absolute w-0.5 h-10 bg-white top-1/2 left-1/2 origin-bottom"
              style={{
                transform: 'translate(-50%, -100%)',
                animation: 'minuteHand 3s linear infinite',
              }}
            />
            <div 
              className="absolute w-0.5 h-12 bg-red-500 top-1/2 left-1/2 origin-bottom"
              style={{
                transform: 'translate(-50%, -100%)',
                animation: 'secondHand 1s linear infinite',
              }}
            />

            {/* Center dot */}
            <div className="absolute w-3 h-3 bg-white rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
            </div>
          </div>

          {/* Progress ring */}
          <div className="absolute inset-0 w-32 h-32">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="rgba(59, 130, 246, 0.2)"
                strokeWidth="2"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="#3b82f6"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="283"
                strokeDashoffset={283 - (283 * progress) / 100}
                style={{
                  transition: 'stroke-dashoffset 0.1s ease-out',
                }}
              />
            </svg>
          </div>
        </div>

        {/* Loading text */}
        <div className="mt-8 text-center">
          <div className="text-white text-xl font-light mb-2">
            Loading
            <span className="inline-block">
              <span className="animate-pulse">.</span>
              <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>.</span>
              <span className="animate-pulse" style={{ animationDelay: '0.4s' }}>.</span>
            </span>
          </div>
          <div className="text-blue-400 text-sm">
            {Math.round(progress)}%
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes secondHand {
          0% { transform: translate(-50%, -100%) rotate(0deg); }
          100% { transform: translate(-50%, -100%) rotate(360deg); }
        }
        
        @keyframes minuteHand {
          0% { transform: translate(-50%, -100%) rotate(0deg); }
          100% { transform: translate(-50%, -100%) rotate(360deg); }
        }
        
        @keyframes hourHand {
          0% { transform: translate(-50%, -100%) rotate(0deg); }
          100% { transform: translate(-50%, -100%) rotate(360deg); }
        }
        
        @keyframes clockHand {
          0% { transform: translateX(-50%) rotate(0deg); }
          100% { transform: translateX(-50%) rotate(360deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
