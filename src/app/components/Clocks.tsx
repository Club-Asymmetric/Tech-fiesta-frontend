"use client";

import { useEffect, useState, useMemo } from 'react';
import AnalogClock from './AnalogClock';

interface ClocksProps {
  mainClockSize?: number;
  smallClockCount?: number;
}

const Clocks = ({ mainClockSize = 400, smallClockCount = 20 }: ClocksProps) => {
  const [viewportSize, setViewportSize] = useState({ width: 1200, height: 800 });

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

  // Generate positions for small clocks distributed across the entire page
  const smallClocks = useMemo(() => {
    const clocks = [];
    const safeZoneRadius = mainClockSize / 1.3; // Keep small clocks away from center
    const padding = 100; // Padding from edges of screen
    
    // Size ranges for small clocks (much larger than before)
    const minSize = 80;
    const maxSize = 200;

    // Create a grid of potential positions to ensure better distribution
    const gridDivisions = Math.ceil(Math.sqrt(smallClockCount * 3)); // More positions than needed
    const cellWidth = (viewportSize.width - padding * 2) / gridDivisions;
    const cellHeight = (viewportSize.height - padding * 2) / gridDivisions;
    
    const potentialPositions = [];
    
    // Generate grid positions
    for (let row = 0; row < gridDivisions; row++) {
      for (let col = 0; col < gridDivisions; col++) {
        // Center of each cell
        const centerX = padding + col * cellWidth + cellWidth / 2 - viewportSize.width / 2;
        const centerY = padding + row * cellHeight + cellHeight / 2 - viewportSize.height / 2;
        
        // Distance from center of screen
        const distFromCenter = Math.sqrt(centerX * centerX + centerY * centerY);
        
        // Skip positions too close to center
        if (distFromCenter < safeZoneRadius) continue;
        
        potentialPositions.push({ x: centerX, y: centerY, distFromCenter });
      }
    }
    
    // Shuffle potential positions
    potentialPositions.sort(() => Math.random() - 0.5);
    
    // Take only the needed number of positions
    const selectedPositions = potentialPositions.slice(0, smallClockCount);

    // Assign clock properties to each position
    selectedPositions.forEach(pos => {
      // Size varies but generally larger
      const distanceFactor = Math.min(1, safeZoneRadius / pos.distFromCenter);
      const sizeVariation = 0.7 + Math.random() * 0.6; // Random size factor between 0.7 and 1.3
      const size = Math.max(minSize, Math.min(maxSize, Math.floor((minSize + maxSize) / 2 * sizeVariation)));
      
      // Scale hand thickness proportionally to clock size
      const hourHandThickness = size / 90; // Thicker than before
      const minuteHandThickness = size / 130; // Thicker than before
      const secondHandThickness = size / 180; // Thicker than before

      clocks.push({
        x,
        y,
        size,
        hourHandThickness,
        minuteHandThickness,
        secondHandThickness,
      });
    }
    
    return clocks;
  }, [mainClockSize, smallClockCount, viewportSize]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden ">
      {/* Container to center the main clock */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <AnalogClock 
          size={mainClockSize} 
          hourHandThickness={mainClockSize / 160} 
          minuteHandThickness={mainClockSize / 220} 
          secondHandThickness={mainClockSize / 320}
        />
      </div>
      
      {/* Small clocks positioned around */}
      {smallClocks.map((clock, i) => (
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

export default Clocks;
