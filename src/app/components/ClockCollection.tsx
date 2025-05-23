"use client";

import React, { useEffect, useState } from 'react';
import AnalogClock from './AnalogClock';

interface ClockCollectionProps {
  mainClockSize?: number;
  smallClockCount?: number;
}

const ClockCollection = ({ 
  mainClockSize = 400, 
  smallClockCount = 10 
}: ClockCollectionProps) => {
  // Initialize with null to avoid hydration mismatch
  const [viewportSize, setViewportSize] = useState<{ width: number, height: number } | null>(null);

  // Update viewport size on window resize
  useEffect(() => {
    const handleResize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    // Set initial size
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  // Pseudo-random number generator with seed for stable values across server and client
  const seededRandom = (seed: number) => {
    // Simple seeded random function
    return function() {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
  };  // Generate clock positions and sizes in a more structured layout
  const generateClocks = () => {
    const clocks = [];
    // Use default values if viewportSize is null (during SSR)
    const width = viewportSize?.width || 1200;
    const height = viewportSize?.height || 800;
    
    // Size ranges for small clocks - more variation
    const sizes = [80, 100, 120, 140, 160, 180, 200, 220, 240, 260];
    
    // Distribute clocks in specific positions around the page
    const positions = [
      // Top row
      { xPercent: -0.8, yPercent: -0.6, size: sizes[0] },
      { xPercent: 0, yPercent: -0.7, size: sizes[1] },
      { xPercent: 0.8, yPercent: -0.6, size: sizes[2] },
      
      // Middle row (sides)
      { xPercent: -0.85, yPercent: 0, size: sizes[3] },
      { xPercent: 0.85, yPercent: 0, size: sizes[4] },
      
      // Bottom row
      { xPercent: -0.8, yPercent: 0.6, size: sizes[5] },
      { xPercent: 0, yPercent: 0.7, size: sizes[6] },
      { xPercent: 0.8, yPercent: 0.6, size: sizes[7] },
      
      // Corners
      { xPercent: -0.7, yPercent: -0.5, size: sizes[8] },
      { xPercent: 0.7, yPercent: 0.5, size: sizes[9] },
    ];
    
    // Generate the specified number of clocks based on positions
    for (let i = 0; i < Math.min(smallClockCount, positions.length); i++) {
      const position = positions[i];
      const x = position.xPercent * (width / 2);
      const y = position.yPercent * (height / 2);
      const size = position.size;
      
      // Scale hand thickness proportionally to clock size
      const hourHandThickness = size / 90;  
      const minuteHandThickness = size / 130;
      const secondHandThickness = size / 180;
      
      clocks.push({
        x, 
        y, 
        size, 
        hourHandThickness, 
        minuteHandThickness, 
        secondHandThickness
      });
    }
    
    return clocks;
  };  // Only generate clocks on the client side
  // Use memo to avoid recalculating on every render
  const smallClocks = React.useMemo(() => {
    // Only generate clocks if we're in the browser
    if (typeof window !== 'undefined' && viewportSize) {
      return generateClocks();
    }
    return [];
  }, [viewportSize?.width, viewportSize?.height, smallClockCount]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Main clock in center */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <AnalogClock 
          size={mainClockSize} 
          hourHandThickness={mainClockSize / 120}
          minuteHandThickness={mainClockSize / 180}
          secondHandThickness={mainClockSize / 240}
        />
      </div>
      
      {/* Smaller clocks - only render on client side after hydration */}
      {typeof window !== 'undefined' && smallClocks.map((clock, i) => (
        <div 
          key={i}
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `calc(50% + ${clock.x}px)`,
            top: `calc(50% + ${clock.y}px)`,
          }}
        >
          <AnalogClock 
            size={clock.size}
            hourHandThickness={clock.hourHandThickness}
            minuteHandThickness={clock.minuteHandThickness}
            secondHandThickness={clock.secondHandThickness}
          />
        </div>
      ))}
    </div>
  );
};

export default ClockCollection;
