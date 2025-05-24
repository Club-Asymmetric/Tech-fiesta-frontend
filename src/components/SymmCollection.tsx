"use client";

import React, { useEffect, useState } from 'react';
import AnalogClock from './AnalogClock';

interface ClockCollectionProps {
  mainClockSize?: number;
  smallClockCount?: number;
}

const SymmCollection = ({ 
  mainClockSize = 400, 
  smallClockCount = 20 
}: ClockCollectionProps) => {
  // Initialize with null to avoid hydration mismatch
  const [viewportSize, setViewportSize] = useState<{ width: number, height: number } | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentSymmetry, setCurrentSymmetry] = useState<string>('');

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
  };
  // Generate symmetric clock positions with randomized patterns
  const generateClocks = () => {
    const clocks = [];
    const safeZone = mainClockSize * 0.6; // Safe zone around main clock
    // Use default values if viewportSize is null (during SSR)
    const width = viewportSize?.width || 1200;
    const height = viewportSize?.height || 800;
    
    // Calculate available space
    const margin = 80;
    const maxX = (width - margin * 2) / 2;
    const maxY = (height - margin * 2) / 2;
    
    // Size ranges for clocks
    const sizes = [
      { min: 60, max: 90, weight: 0.4 },   // Small clocks
      { min: 90, max: 130, weight: 0.35 },  // Medium clocks
      { min: 130, max: 180, weight: 0.2 }, // Large clocks
      { min: 180, max: 220, weight: 0.05 } // Extra large clocks
    ];
    
    // Function to get random size based on weighted distribution
    const getRandomSize = () => {
      const rand = Math.random();
      let cumulativeWeight = 0;
      
      for (const sizeRange of sizes) {
        cumulativeWeight += sizeRange.weight;
        if (rand <= cumulativeWeight) {
          return Math.floor(sizeRange.min + Math.random() * (sizeRange.max - sizeRange.min));
        }
      }
      return sizes[0].min; // fallback
    };
    
    // Function to check if two circles overlap (with padding)
    const isOverlapping = (x1: number, y1: number, r1: number, x2: number, y2: number, r2: number, padding: number = 20) => {
      const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
      return distance < (r1 + r2 + padding);
    };
    
    // Symmetry types to randomly choose from
    const symmetryTypes = [
      'horizontal', // Mirror across vertical axis
      'vertical',   // Mirror across horizontal axis
      'diagonal',   // Mirror across both diagonal axes
      'radial',     // Radial/rotational symmetry
      'quad'        // 4-quadrant symmetry
    ];
      // Randomly select a symmetry type
    const selectedSymmetry = symmetryTypes[Math.floor(Math.random() * symmetryTypes.length)];
    setCurrentSymmetry(selectedSymmetry);
    
    // Generate base positions (we'll create mirrors of these)
    const baseClocks = [];
    const targetCount = Math.ceil(smallClockCount / (selectedSymmetry === 'quad' ? 4 : selectedSymmetry === 'diagonal' ? 4 : 2));
    
    // Generate base positions in one quadrant/half
    for (let i = 0; i < targetCount && baseClocks.length < targetCount; i++) {
      let attempts = 0;
      let validPosition = false;
      
      while (!validPosition && attempts < 100) {
        const size = getRandomSize();
        const radius = size / 2;
        
        let x, y;
        
        // Generate position based on symmetry type
        switch (selectedSymmetry) {
          case 'horizontal':
            // Generate in right half
            x = Math.random() * (maxX * 0.8) + radius + 50;
            y = (Math.random() - 0.5) * (maxY * 1.4);
            break;
          case 'vertical':
            // Generate in top half
            x = (Math.random() - 0.5) * (maxX * 1.4);
            y = -(Math.random() * (maxY * 0.8) + radius + 50);
            break;
          case 'diagonal':
          case 'quad':
            // Generate in first quadrant
            x = Math.random() * (maxX * 0.8) + radius + 50;
            y = -(Math.random() * (maxY * 0.8) + radius + 50);
            break;
          case 'radial':
            // Generate in upper right sector
            const angle = Math.random() * (Math.PI / 4) + (Math.PI / 8); // 22.5 to 67.5 degrees
            const distance = (Math.random() * (maxX * 0.7)) + safeZone + radius + 50;
            x = Math.cos(angle) * distance;
            y = -Math.sin(angle) * distance;
            break;
          default:
            x = Math.random() * maxX;
            y = Math.random() * maxY;
        }
        
        const distanceFromCenter = Math.sqrt(x * x + y * y);
        
        // Check if position is valid (not too close to center)
        if (distanceFromCenter < safeZone + radius) {
          attempts++;
          continue;
        }
        
        // Check collision with existing base clocks
        let hasCollision = false;
        for (const existingClock of baseClocks) {
          if (isOverlapping(x, y, radius, existingClock.x, existingClock.y, existingClock.size / 2)) {
            hasCollision = true;
            break;
          }
        }
        
        // Check if clock would be too close to screen edges
        if (Math.abs(x) + radius > maxX * 0.9 || Math.abs(y) + radius > maxY * 0.9) {
          hasCollision = true;
        }
        
        if (!hasCollision) {
          validPosition = true;
          baseClocks.push({ x, y, size });
        }
        
        attempts++;
      }
    }
    
    // Create symmetric copies of base clocks
    for (const baseClock of baseClocks) {
      const { x, y, size } = baseClock;
      const hourHandThickness = Math.max(1, size / 80);  
      const minuteHandThickness = Math.max(0.8, size / 120);
      const secondHandThickness = Math.max(0.5, size / 160);
      
      const clockData = {
        size, 
        hourHandThickness, 
        minuteHandThickness, 
        secondHandThickness,
        symmetry: selectedSymmetry
      };
      
      switch (selectedSymmetry) {
        case 'horizontal':
          // Original and horizontal mirror
          clocks.push({ ...clockData, x, y });
          clocks.push({ ...clockData, x: -x, y });
          break;
          
        case 'vertical':
          // Original and vertical mirror
          clocks.push({ ...clockData, x, y });
          clocks.push({ ...clockData, x, y: -y });
          break;
          
        case 'diagonal':
          // Mirror across both diagonal axes
          clocks.push({ ...clockData, x, y });
          clocks.push({ ...clockData, x: -x, y: -y });
          clocks.push({ ...clockData, x: y, y: x });
          clocks.push({ ...clockData, x: -y, y: -x });
          break;
          
        case 'quad':
          // 4-quadrant symmetry
          clocks.push({ ...clockData, x, y });
          clocks.push({ ...clockData, x: -x, y });
          clocks.push({ ...clockData, x, y: -y });
          clocks.push({ ...clockData, x: -x, y: -y });
          break;
          
        case 'radial':
          // 8-way radial symmetry
          const positions = [
            { x, y },
            { x: -x, y },
            { x, y: -y },
            { x: -x, y: -y },
            { x: y, y: x },
            { x: -y, y: x },
            { x: y, y: -x },
            { x: -y, y: -x }
          ];
          
          for (const pos of positions) {
            if (clocks.length < smallClockCount) {
              clocks.push({ ...clockData, x: pos.x, y: pos.y });
            }
          }
          break;
      }
      
      // Stop if we've reached the target count
      if (clocks.length >= smallClockCount) {
        break;
      }
    }
    
    // Trim to exact count if needed
    return clocks.slice(0, smallClockCount);
  };
  // Only generate clocks on the client side to avoid hydration errors
  // Use memo to avoid recalculating on every render
  const smallClocks = React.useMemo(() => {
    // Only generate clocks if we're in the browser and have viewport size
    if (typeof window !== 'undefined' && viewportSize) {
      return generateClocks();
    }
    return [];
  }, [viewportSize?.width, viewportSize?.height, smallClockCount, mainClockSize, refreshKey]);

  const refreshPattern = () => {
    setRefreshKey(prev => prev + 1);
  };
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col items-end space-y-2">
        <button
          onClick={refreshPattern}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors duration-200 shadow-lg"
        >
          New Pattern
        </button>
        {currentSymmetry && (
          <div className="px-3 py-1 bg-black/80 text-white text-sm rounded-lg border border-white/20">
            {currentSymmetry.charAt(0).toUpperCase() + currentSymmetry.slice(1)} Symmetry
          </div>
        )}
      </div>

      {/* Main clock in center */}
      <div 
        className="absolute z-10"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <AnalogClock 
          size={mainClockSize} 
          hourHandThickness={mainClockSize / 100}
          minuteHandThickness={mainClockSize / 150}
          secondHandThickness={mainClockSize / 200}
        />
      </div>
      
      {/* Smaller clocks - only render on client side after hydration */}
      {viewportSize && smallClocks.map((clock, i) => (
        <div 
          key={`clock-${i}-${clock.x}-${clock.y}`}
          className="absolute"
          style={{
            top: '50%',
            left: '50%',
            transform: `translate(calc(-50% + ${clock.x}px), calc(-50% + ${clock.y}px))`,
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

export default SymmCollection;