"use client";

import { useEffect, useState } from 'react';

interface AnalogClockProps {
  size?: number; // Size in pixels (default will be 256px/16rem)
  hourHandThickness?: number; // Thickness of hour hand in pixels
  minuteHandThickness?: number; // Thickness of minute hand in pixels
  secondHandThickness?: number; // Thickness of second hand in pixels
}

function AnalogClock({ 
  size = 256,
  hourHandThickness = 1.5,
  minuteHandThickness = 1,
  secondHandThickness = 0.5
}: AnalogClockProps) {
  const [time, setTime] = useState(new Date(0)); // Initialize with a fixed date
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Set the current time and mark component as mounted
    setIsMounted(true);
    setTime(new Date());
    
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  // Calculate rotation degrees for clock hands
  const secondDegrees = time.getSeconds() * 6; // 6 degrees per second
  const minuteDegrees = time.getMinutes() * 6 + time.getSeconds() * 0.1; // 6 degrees per minute + adjustment for seconds
  const hourDegrees = time.getHours() * 30 + time.getMinutes() * 0.5; // 30 degrees per hour + adjustment for minutes
  // Calculate scaling factor based on size (256px is the base size)
  const scale = size / 256;
    // Calculate dimensions for clock elements based on scale
  const hourHandHeight = 80 * scale;
  const minuteHandHeight = 96 * scale;
  const secondHandHeight = 112 * scale;  
  const markerHeight = 20 * scale;
  const markerDistance = 98 * scale;
  const centerDotSize = 12 * scale;
  const borderWidth = 4 * scale;
  // Add thicker markers for hour positions 3, 6, 9, and 12
  const specialMarkerPositions = [0, 3, 6, 9]; // 12, 3, 6, 9 o'clock positions
  
  // Scale thickness of hands
  const scaledHourHandThickness = hourHandThickness * scale;
  const scaledMinuteHandThickness = minuteHandThickness * scale;
  const scaledSecondHandThickness = secondHandThickness * scale;  // Only render the full clock when client-side
  if (!isMounted) {
    return (
      <div 
        className="relative rounded-full border-white bg-black mx-auto flex items-center justify-center shadow-lg shadow-blue-500/20"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderWidth: `${borderWidth}px`,
        }}
      ></div>
    );
  }

  return (
    <div 
      className="relative rounded-full border-white bg-black mx-auto flex items-center justify-center shadow-lg shadow-blue-500/20"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderWidth: `${borderWidth}px`,
      }}
    >
      {/* Clock face */}
      <div className="relative w-full h-full rounded-full flex top-0 left-0 items-center justify-center">
          {/* Hour markers - separated into its own div */}
        <div className="absolute w-full h-full">
          {[...Array(12)].map((_, i) => (
            <div 
              key={i} 
              className="absolute bg-white"
              style={{
                width: `${specialMarkerPositions.includes(i) ? 2.5 * scale : 1 * scale}px`,
                height: `${specialMarkerPositions.includes(i) ? markerHeight * 1.2 : markerHeight}px`,
                transform: `rotate(${i * 30}deg) translateY(-${markerDistance}px)`,
                top: '42%',
                left: '50%',
                transformOrigin: 'bottom center',
              }}
            />
          ))}
        </div>

        {/* Clock hands - separated into its own div */}
        <div className="absolute w-full h-full">          {/* Hour hand */}
          <div 
            className="absolute bg-white rounded-full"
            style={{ 
              height: `${hourHandHeight}px`,
              width: `${scaledHourHandThickness}px`,
              transform: `rotate(${hourDegrees}deg)`,
              transformOrigin: 'bottom center',
              bottom: '50%',
              left: `calc(50% - ${scaledHourHandThickness / 2}px)`
            }}
          />
          {/* Minute hand */}
          <div 
            className="absolute bg-white rounded-full"
            style={{ 
              height: `${minuteHandHeight}px`,
              width: `${scaledMinuteHandThickness}px`,
              transform: `rotate(${minuteDegrees}deg)`,
              transformOrigin: 'bottom center',
              bottom: '50%',
              left: `calc(50% - ${scaledMinuteHandThickness / 2}px)`
            }}
          />
          {/* Second hand */}
          <div 
            className="absolute bg-white rounded-full"
            style={{ 
              height: `${secondHandHeight}px`,
              width: `${scaledSecondHandThickness}px`,
              transform: `rotate(${secondDegrees}deg)`,
              transformOrigin: 'bottom center',
              bottom: '50%',
              left: `calc(50% - ${scaledSecondHandThickness / 2}px)`
            }}
          />
        </div>        {/* Center dot with inner styling */}
        <div 
          className="absolute bg-white rounded-full z-10 flex items-center justify-center" 
          style={{
            width: `${centerDotSize}px`,
            height: `${centerDotSize}px`,
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
  );
}

export default AnalogClock;