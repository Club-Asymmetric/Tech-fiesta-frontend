"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";

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
  onAnimationComplete,
}: AnimatedTextProps) => {
  const [step, setStep] = useState(0);
  const [charAnimationDetails, setCharAnimationDetails] = useState<
    { className: string; duration: string; delay: string }[]
  >([]);

  useEffect(() => {
    const slideDuration = 1000;
    const spinPhaseDuration = 2500;

    const timer1 = setTimeout(() => {
      setStep(1);
    }, delay);

    const timer2 = setTimeout(() => {
      setStep(2);
    }, delay + slideDuration);

    const timer3 = setTimeout(() => {
      onAnimationComplete?.();
    }, delay + slideDuration + spinPhaseDuration);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [delay, onAnimationComplete, text]);

  const spinVariations = useMemo(
    () => [
      "spin-360-pos",
      "spin-360-neg",
      "spin-720-pos",
      "spin-720-neg",
      "spin-1080-pos",
      "spin-1080-neg",
      "spin-1440-pos",
      "spin-1440-neg",
    ],
    []
  );

  const animationDurations = useMemo(() => ["0.8s", "1s", "1.2s", "1.4s"], []);

  const getRandomSpinClass = useCallback(
    () => spinVariations[Math.floor(Math.random() * spinVariations.length)],
    [spinVariations]
  );

  const getRandomDuration = useCallback(
    () =>
      animationDurations[Math.floor(Math.random() * animationDurations.length)],
    [animationDurations]
  );

  useEffect(() => {
    if (step === 2) {
      setCharAnimationDetails(
        text.split("").map((_, index) => ({
          className: getRandomSpinClass(),
          duration: getRandomDuration(),
          delay: `${index * 0.05}s`, // Sequential delay
        }))
      );
    }
  }, [step, text, getRandomSpinClass, getRandomDuration]);

  const words = text.split(" ");
  const leftWord = words[0] || "Tech";
  const rightWord = words[1] || "Fiesta";

  return (
    <>
      {" "}
      <style jsx>{`
        /* Existing styles from the component */
        .slide-enter-active {
          transition: all 1s ease-out;
        }
        .slide-exit-active {
          transition: all 0.5s ease-in;
        }
        .slide-enter-from {
          opacity: 0;
        }
        .slide-enter-to {
          opacity: 1;
        }
        .slide-exit-from {
          opacity: 1;
        }
        .slide-exit-to {
          opacity: 0;
        }

        /* Text glow effect */
        .text-glow {
          text-shadow: 0 0 4px rgba(255, 255, 255, 0.6),
            0 0 8px rgba(255, 255, 255, 0.4), 0 0 12px rgba(255, 255, 255, 0.3),
            0 0 20px rgba(255, 255, 255, 0.2), 0 0 25px rgba(255, 255, 255, 0.1);
        }

        .char-spin {
          display: inline-block; /* Ensures transform-origin is respected */
          transform-origin: center;
          backface-visibility: hidden; /* For cleaner 3D rotation */
        }

        /* Spin animations (now RotateX) */
        @keyframes spin-360-pos {
          to {
            transform: rotateX(360deg);
          }
        }
        @keyframes spin-360-neg {
          to {
            transform: rotateX(-360deg);
          }
        }
        @keyframes spin-720-pos {
          to {
            transform: rotateX(720deg);
          }
        }
        @keyframes spin-720-neg {
          to {
            transform: rotateX(-720deg);
          }
        }
        @keyframes spin-1080-pos {
          to {
            transform: rotateX(1080deg);
          }
        }
        @keyframes spin-1080-neg {
          to {
            transform: rotateX(-1080deg);
          }
        }
        @keyframes spin-1440-pos {
          to {
            transform: rotateX(1440deg);
          }
        }
        @keyframes spin-1440-neg {
          to {
            transform: rotateX(-1440deg);
          }
        }

        /* Add class selectors for spin animations */
        .spin-360-pos {
          animation-name: spin-360-pos;
        }
        .spin-360-neg {
          animation-name: spin-360-neg;
        }
        .spin-720-pos {
          animation-name: spin-720-pos;
        }
        .spin-720-neg {
          animation-name: spin-720-neg;
        }
        .spin-1080-pos {
          animation-name: spin-1080-pos;
        }
        .spin-1080-neg {
          animation-name: spin-1080-neg;
        }
        .spin-1440-pos {
          animation-name: spin-1440-pos;
        }
        .spin-1440-neg {
          animation-name: spin-1440-neg;
        }
      `}</style>
      <div className={`fixed inset-0 z-30 ${className} overflow-hidden`}>
        {" "}
        {/* Step 1: Sliding Text */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ease-out ${
            step === 1 ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-wider text-glow font-sans">
            <span
              className={`inline-block transition-all duration-1000 ease-out ${
                step === 1
                  ? "translate-x-0 opacity-100"
                  : step === 0
                  ? "-translate-x-full opacity-0"
                  : "translate-x-0 opacity-0" // Stays in place, fades with parent's opacity transition
              }`}
              style={{ marginRight: "0.25em" }}
            >
              {leftWord}
            </span>
            <span
              className={`inline-block transition-all duration-1000 ease-out ${
                step === 1
                  ? "translate-x-0 opacity-100"
                  : step === 0
                  ? "translate-x-full opacity-0"
                  : "translate-x-0 opacity-0" // Stays in place, fades with parent's opacity transition
              }`}
              style={{ marginLeft: "0.25em" }}
            >
              {rightWord}
            </span>
          </h1>
        </div>
        {/* Step 2: Combined Spinning Text */}
        <div
          className={`absolute inset-0 flex items-center justify-center ${
            step === 2 ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Spinning Text - will no longer fade out */}
          <div
            className={`${step === 2 ? "" : ""}`} // Removed animate-fadeOutSpinningText
            style={{
              // animationDuration: `${2500 / 1000}s`, // spinPhaseDuration - No longer needed for fade out
              perspective: "1000px", // For 3D effect of X-axis rotation
            }}
          >
            <h1 className="relative text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-wider text-white text-glow font-sans">
              {text.split("").map((char, index) => (
                <span
                  key={`char-${index}`}
                  className={`relative inline-block char-spin ${
                    charAnimationDetails[index]?.className || ""
                  }`}
                  style={{
                    animationDuration: charAnimationDetails[index]?.duration,
                    animationDelay: charAnimationDetails[index]?.delay,
                    animationTimingFunction: "ease-out",
                    animationFillMode: "forwards",
                  }}
                >
                  {char === " " ? "\u00A0" : char} {/* Corrected space char */}
                </span>
              ))}
            </h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default AnimatedText;
