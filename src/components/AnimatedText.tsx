"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";

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
  const textRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const slideDuration = 1000;
    const moveDelay = 500; // Small movement after sliding
    const spinPhaseDuration = 4000; // Increased from 2500
    const totalDuration = 1500;

    const timer1 = setTimeout(() => {
      setStep(1);
    }, delay);

    const timer2 = setTimeout(() => {
      setStep(2);
    }, delay + slideDuration + moveDelay);

    const timer3 = setTimeout(() => {
      setStep(3);
    }, delay + slideDuration + moveDelay + 500); // Asymmetric appears 500ms after spinning starts

    const timer4 = setTimeout(() => {
      onAnimationComplete?.();
    }, delay + slideDuration + moveDelay + spinPhaseDuration + totalDuration);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [delay, onAnimationComplete]);
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
          delay: `${index * 0.05}s`,
        }))
      );
    }
  }, [step, text, getRandomSpinClass, getRandomDuration]);

  const words = text.split(" ");
  const leftWord = words[0] || "Tech";
  const rightWord = words[1] || "Fiesta";

  return (
    <>
      <style jsx>{`
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

        .text-glow {
          text-shadow: 0 0 4px rgba(255, 255, 255, 0.6),
            0 0 8px rgba(255, 255, 255, 0.4), 0 0 12px rgba(255, 255, 255, 0.3),
            0 0 20px rgba(255, 255, 255, 0.2), 0 0 25px rgba(255, 255, 255, 0.1);
        }
        .char-spin {
          display: inline-block;
          transform-origin: center;
          backface-visibility: hidden;
        }

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
        @keyframes asymmetric-bounce {
          0% {
            transform: translateY(20px) scale(0.8);
            opacity: 0;
          }
          10% {
            opacity: 0.3;
          }
          30% {
            transform: translateY(-40px) scale(1.1);
            opacity: 0.7;
          }
          60% {
            transform: translateY(-20px) scale(1.05);
            opacity: 0.9;
          }
          80% {
            transform: translateY(-5px) scale(1.02);
            opacity: 1;
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        .asymmetric-bounce {
          animation-name: asymmetric-bounce;
          animation-duration: 1.2s;
          animation-timing-function: ease-out;
          animation-fill-mode: forwards;
        }
      `}</style>

      <div className={`fixed inset-0 z-30 ${className} overflow-hidden`}>
        {" "}
        {/* Step 1: Sliding Text */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out ${
            step === 1 ? "opacity-100" : "opacity-0"
          }`}
          style={{
            transform: step === 1 ? "translateY(-10px)" : "translateY(0px)",
            pointerEvents: step === 1 ? "auto" : "none",
          }}
        >
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-wider text-white text-glow font-sans">
            <span
              className={`inline-block transition-all duration-1000 ease-out ${
                step === 1
                  ? "translate-x-0 opacity-100"
                  : step === 0
                  ? "-translate-x-full opacity-0"
                  : "translate-x-0 opacity-0"
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
                  : "translate-x-0 opacity-0"
              }`}
              style={{ marginLeft: "0.25em" }}
            >
              {rightWord}
            </span>
          </h1>
        </div>{" "}
        {/* Step 2 & 3: Spinning Text with Asymmetric emerging */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out ${
            step >= 2 ? "opacity-100" : "opacity-0"
          }`}
          style={{
            transform: step >= 2 ? "translateY(0px)" : "translateY(-10px)",
            pointerEvents: step >= 2 ? "auto" : "none",
          }}
        >
          <div className="relative flex flex-col items-center">
            {" "}
            {/* Asymmetric Text - appears above and emerges from spinning text */}
            <div
              className={`transition-all duration-300 ease-out`}
              style={{ marginBottom: "1rem" }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-wider text-white text-glow font-sans">
                {"Asymmetric".split("").map((char, index) => (
                  <span
                    key={`asymmetric-${index}`}
                    className={`inline-block ${
                      step >= 3 ? "asymmetric-bounce" : ""
                    }`}
                    style={{
                      animationDelay: `${index * 0.1}s`,
                      transform: "translateY(20px) scale(0.8)",
                      opacity: 0,
                    }}
                  >
                    {char}
                  </span>
                ))}
              </h1>
            </div>
            {/* Tech Fiesta Text - continues spinning */}
            <div
              ref={textRef}
              style={{
                perspective: "1000px",
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
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AnimatedText;
