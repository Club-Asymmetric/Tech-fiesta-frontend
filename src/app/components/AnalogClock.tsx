"use client";

import { useEffect, useState } from 'react';

interface AnalogClockProps {
  size?: number;
  hourHandThickness?: number;
  minuteHandThickness?: number;
  secondHandThickness?: number;
}

function AnalogClock({ 
  size = 256,
  hourHandThickness = 1.5,
  minuteHandThickness = 1,
  secondHandThickness = 0.5
}: AnalogClockProps) {
  const [time, setTime] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Set mounted to true and initialize time on client
    setMounted(true);
    setTime(new Date());
    
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  // Calculate scaling factor based on size
  const scale = size / 256;
  
  // Calculate dimensions for clock elements based on scale
  const hourHandHeight = 60 * scale; // Shortened for better proportion
  const minuteHandHeight = 80 * scale; // Shortened for better proportion
  const secondHandHeight = 90 * scale; // Shortened for better proportion
  const markerHeight = 15 * scale;
  const markerDistance = (size / 2) - (20 * scale); // Distance from center to marker
  const centerDotSize = 12 * scale;
  const borderWidth = 4 * scale;
  
  // Special marker positions for 12, 3, 6, 9 o'clock
  const specialMarkerPositions = [0, 3, 6, 9];
  
  // Scale thickness of hands
  const scaledHourHandThickness = hourHandThickness * scale;
  const scaledMinuteHandThickness = minuteHandThickness * scale;
  const scaledSecondHandThickness = secondHandThickness * scale;

  // Calculate rotation degrees - only if time is available
  let secondDegrees = 0;
  let minuteDegrees = 0;
  let hourDegrees = 0;
  
  if (time) {
    secondDegrees = time.getSeconds() * 6;
    minuteDegrees = time.getMinutes() * 6 + time.getSeconds() * 0.1;
    hourDegrees = (time.getHours() % 12) * 30 + time.getMinutes() * 0.5;
  }

  return (
    <div className="flex flex-col items-center space-y-4 p-8">
      <div 
        className="relative rounded-full border-white bg-black mx-auto flex items-center justify-center shadow-lg shadow-blue-500/20"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderWidth: `${borderWidth}px`,
        }}
      >
        {/* Clock face */}
        <div className="absolute inset-0 rounded-full">
          {/* Hour markers */}
          {[...Array(12)].map((_, i) => (
            <div 
              key={i} 
              className="absolute"
              style={{
                top: '50%',
                left: '50%',
                width: `${specialMarkerPositions.includes(i) ? 3 * scale : 1.5 * scale}px`,
                height: `${specialMarkerPositions.includes(i) ? markerHeight * 1.5 : markerHeight}px`,
                backgroundColor: 'white',
                transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-${markerDistance}px)`,
                transformOrigin: '50% 50%',
              }}
            />
          ))}

          {/* Clock hands - only render when mounted to avoid hydration mismatch */}
          {mounted && (
            <>
              {/* Hour hand */}
              <div 
                className="absolute bg-white transition-transform duration-1000 ease-in-out"
                style={{ 
                  width: `${scaledHourHandThickness}px`,
                  height: `${hourHandHeight}px`,
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -100%) rotate(${hourDegrees}deg)`,
                  transformOrigin: '50% 100%',
                  borderRadius: `${scaledHourHandThickness / 2}px`,
                }}
              />
              
              {/* Minute hand */}
              <div 
                className="absolute bg-white transition-transform duration-1000 ease-in-out"
                style={{ 
                  width: `${scaledMinuteHandThickness}px`,
                  height: `${minuteHandHeight}px`,
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -100%) rotate(${minuteDegrees}deg)`,
                  transformOrigin: '50% 100%',
                  borderRadius: `${scaledMinuteHandThickness / 2}px`,
                }}
              />
              
              {/* Second hand */}
              <div 
                className="absolute bg-red-500"
                style={{ 
                  width: `${scaledSecondHandThickness}px`,
                  height: `${secondHandHeight}px`,
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -100%) rotate(${secondDegrees}deg)`,
                  transformOrigin: '50% 100%',
                  borderRadius: `${scaledSecondHandThickness / 2}px`,
                }}
              />
            </>
          )}

          {/* Center dot */}
          <div 
            className="absolute bg-white rounded-full z-10 flex items-center justify-center" 
            style={{
              width: `${centerDotSize}px`,
              height: `${centerDotSize}px`,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div 
              className="bg-blue-500 rounded-full"
              style={{
                width: `${centerDotSize * 0.6}px`,
                height: `${centerDotSize * 0.6}px`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalogClock;