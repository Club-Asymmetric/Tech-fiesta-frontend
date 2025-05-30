"use client";

import React, { useState, useEffect } from 'react';

interface AnimatedTextProps {
  text?: string;
  delay?: number;
  className?: string;
  onAnimationComplete?: () => void;
}

const AnimatedText = ({ 
  text = "Tech Fiesta", 
  delay = 1000,
  className = "",
  onAnimationComplete 
}: AnimatedTextProps) => {
  const [step, setStep] = useState(0);
  // step 0: nothing
  // step 1: show sliding text
  // step 2: show combined text

  useEffect(() => {
    // Start the animation after delay
    const timer1 = setTimeout(() => {
      console.log("Step 1: Starting slide animation");
      setStep(1);
    }, delay);

    // Show combined text after slide completes
    const timer2 = setTimeout(() => {
      setStep(2);
      
      // Call completion callback
      if (onAnimationComplete) {
        setTimeout(() => {
          onAnimationComplete();
        }, 1000);
      }
    }, delay + 3000); // delay + slide duration + small buffer

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [delay, onAnimationComplete]);

  // Split text into TECH and FIESTA
  const words = text.split(' ');
  const leftWord = words[0] || 'Tech';
  const rightWord = words[1] || 'Fiesta';

  console.log("Current step:", step);

  return (
    <>
      <style jsx>{`
        @keyframes slideFromLeft {
          0% {
            transform: translateX(-100vw);
            opacity: 1;
          }
          100% {
            transform: translateX(calc(50vw - 100%));
            opacity: 1;
          }
        }

        @keyframes slideFromRight {
          0% {
            transform: translateX(100vw);
            opacity: 1;
          }
          100% {
            transform: translateX(calc(-50vw + 100%));
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .slide-left {
          animation: slideFromLeft 2s ease-out forwards;
        }

        .slide-right {
          animation: slideFromRight 2s ease-out forwards;
        }

        .fade-in {
          animation: fadeIn 1s ease-out forwards;
        }

        .responsive-text {
          font-size: clamp(3rem, 8vw, 4rem);
          font-weight: bold;
          color: white;
          text-shadow: 0 0 20px rgba(255,255,255,0.8);
          font-family: Arial, sans-serif;
          white-space: nowrap;
        }

        @media (min-width: 768px) {
          .responsive-text {
            font-size: clamp(2rem, 8vw, 6rem);
          }
        }

        @media (min-width: 1024px) {
          .responsive-text {
            font-size: clamp(2.5rem, 8vw, 8rem);
          }
        }

        .debug-info {
          position: absolute;
          top: 1rem;
          left: 1rem;
          color: white;
          background: rgba(0, 0, 0, 0.5);
          padding: 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.875rem;
          z-index: 40;
        }
      `}</style>

      <div className={`fixed inset-0 z-30 ${className}`}>
        {/* Debug info */}
        {/*         
        <div className="debug-info">
          Step: {step} | Left: "{leftWord}" | Right: "{rightWord}"
        </div> 
        */}

        {/* Step 1: Sliding text */}
        {step === 1 && (
          <div className="absolute inset-0 overflow-hidden top-[25%] sm:top-0">
            {/* TECH sliding from left */}
            <div 
              className="absolute top-[37%] -left-5 slide-left responsive-text"
              style={{
                  transform: 'translateY(-50%)',
              }}
            >
              {leftWord}
            </div>

            {/* FIESTA sliding from right */}
            <div 
              className="absolute top-[37%] -right-5 slide-right responsive-text"
              style={{
                transform: 'translateY(-50%)',
              }}
            >
              {rightWord}
            </div>
          </div>
        )}

        {/* Step 2: Combined text in center */}
        {step === 2 && (
          <div className="absolute inset-0 flex items-center justify-center left-9 sm:left-10 md:left-13 lg:left-23 top-[13%] sm:top-0">
            <div 
              className="fade-in text-center responsive-text"
              style={{
                textShadow: '0 0 30px rgba(255,255,255,1)',
                opacity: 0
              }}
            >
              {text}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AnimatedText;