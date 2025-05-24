"use client";

import React, { useEffect, useState } from 'react';
import AnalogClock from './AnalogClock';

interface ClockCollectionProps {
  mainClockSize?: number;
  smallClockCount?: number;
}

const ClockCollection = ({ 
  mainClockSize = 400, 
  smallClockCount = 20 
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
  };

  // Generate clock positions and sizes with varied distribution
  const generateClocks = () => {
    const clocks = [];
    const safeZone = mainClockSize * 0.55; // Smaller safe zone for more space
    // Use default values if viewportSize is null (during SSR)
    const width = viewportSize?.width || 1200;
    const height = viewportSize?.height || 800;
    
    // Calculate available space more accurately
    const margin = 60;
    const maxX = (width - margin * 2) / 2;
    const maxY = (height - margin * 2) / 2;
    
    // More varied size ranges
    const sizes = [
      { min: 60, max: 90, weight: 0.3 },   // Small clocks
      { min: 90, max: 130, weight: 0.4 },  // Medium clocks
      { min: 130, max: 180, weight: 0.2 }, // Large clocks
      { min: 180, max: 220, weight: 0.1 }  // Extra large clocks
    ];
    
    // Define zones for better distribution
    const zones = [
      { name: 'top-left', centerX: -maxX * 0.6, centerY: -maxY * 0.6, radius: maxX * 0.4 },
      { name: 'top-right', centerX: maxX * 0.6, centerY: -maxY * 0.6, radius: maxX * 0.4 },
      { name: 'bottom-left', centerX: -maxX * 0.6, centerY: maxY * 0.6, radius: maxX * 0.4 },
      { name: 'bottom-right', centerX: maxX * 0.6, centerY: maxY * 0.6, radius: maxX * 0.4 },
      { name: 'top', centerX: 0, centerY: -maxY * 0.7, radius: maxX * 0.3 },
      { name: 'bottom', centerX: 0, centerY: maxY * 0.7, radius: maxX * 0.3 },
      { name: 'left', centerX: -maxX * 0.7, centerY: 0, radius: maxY * 0.3 },
      { name: 'right', centerX: maxX * 0.7, centerY: 0, radius: maxY * 0.3 },
      { name: 'anywhere', centerX: 0, centerY: 0, radius: Math.max(maxX, maxY) }
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
    const isOverlapping = (x1: number, y1: number, r1: number, x2: number, y2: number, r2: number, padding: number = 15) => {
      const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
      return distance < (r1 + r2 + padding);
    };
    
    // Generate positions for small clocks with varied distribution
    let clocksPerZone = Math.ceil(smallClockCount / zones.length);
    
    for (let zoneIndex = 0; zoneIndex < zones.length && clocks.length < smallClockCount; zoneIndex++) {
      const zone = zones[zoneIndex];
      let clocksInThisZone = 0;
      const maxClocksInZone = Math.min(clocksPerZone, smallClockCount - clocks.length);
      
      for (let attempt = 0; attempt < 50 && clocksInThisZone < maxClocksInZone; attempt++) {
        const size = getRandomSize();
        const radius = size / 2;
        
        let x, y, distanceFromCenter;
        let validPosition = false;
        let positionAttempts = 0;
        
        while (!validPosition && positionAttempts < 30) {
          if (zone.name === 'anywhere') {
            // Random position anywhere
            x = (Math.random() - 0.5) * maxX * 1.8;
            y = (Math.random() - 0.5) * maxY * 1.8;
          } else {
            // Position within zone with some randomness
            const angle = Math.random() * Math.PI * 2;
            const distanceFromZoneCenter = Math.random() * zone.radius;
            x = zone.centerX + Math.cos(angle) * distanceFromZoneCenter;
            y = zone.centerY + Math.sin(angle) * distanceFromZoneCenter;
            
            // Add some extra randomness
            x += (Math.random() - 0.5) * 100;
            y += (Math.random() - 0.5) * 100;
          }
          
          distanceFromCenter = Math.sqrt(x * x + y * y);
          
          // Check if position is valid (not too close to center)
          if (distanceFromCenter < safeZone + radius) {
            positionAttempts++;
            continue;
          }
          
          // Check collision with existing clocks
          let hasCollision = false;
          for (const existingClock of clocks) {
            if (isOverlapping(x, y, radius, existingClock.x ?? 0 , existingClock.y ?? 0 , existingClock.size / 2)) {
              hasCollision = true;
              break;
            }
          }
          
          // Check if clock would be too close to screen edges
          if (Math.abs(x) + radius > maxX * 0.95 || Math.abs(y) + radius > maxY * 0.95) {
            hasCollision = true;
          }
          
          if (!hasCollision) {
            validPosition = true;
          } else {
            positionAttempts++;
          }
        }
        
        // If we found a valid position, add the clock
        if (validPosition) {
          // Scale hand thickness proportionally
          const hourHandThickness = Math.max(1, size / 80);  
          const minuteHandThickness = Math.max(0.8, size / 120);
          const secondHandThickness = Math.max(0.5, size / 160);
          
          clocks.push({
            x, 
            y, 
            size, 
            hourHandThickness, 
            minuteHandThickness, 
            secondHandThickness,
            zone: zone.name
          });
          
          clocksInThisZone++;
        }
      }
    }
    
    // Fill remaining slots with random positions if needed
    while (clocks.length < smallClockCount) {
      const size = getRandomSize();
      const radius = size / 2;
      
      let x, y, distanceFromCenter;
      let validPosition = false;
      let attempts = 0;
      
      while (!validPosition && attempts < 50) {
        x = (Math.random() - 0.5) * maxX * 1.6;
        y = (Math.random() - 0.5) * maxY * 1.6;
        distanceFromCenter = Math.sqrt(x * x + y * y);
        
        if (distanceFromCenter < safeZone + radius) {
          attempts++;
          continue;
        }
        
        let hasCollision = false;
        for (const existingClock of clocks) {
          if (isOverlapping(x, y, radius, existingClock.x ?? 0 , existingClock.y ?? 0 , existingClock.size / 2)) {
            hasCollision = true;
            break;
          }
        }
        
        if (Math.abs(x) + radius > maxX * 0.95 || Math.abs(y) + radius > maxY * 0.95) {
          hasCollision = true;
        }
        
        if (!hasCollision) {
          validPosition = true;
        } else {
          attempts++;
        }
      }
      
      if (!validPosition) break; // Can't place more clocks
      
      const hourHandThickness = Math.max(1, size / 80);  
      const minuteHandThickness = Math.max(0.8, size / 120);
      const secondHandThickness = Math.max(0.5, size / 160);
      
      clocks.push({
        x, 
        y, 
        size, 
        hourHandThickness, 
        minuteHandThickness, 
        secondHandThickness,
        zone: 'random'
      });
    }
    
    return clocks;
  };

  // Only generate clocks on the client side to avoid hydration errors
  // Use memo to avoid recalculating on every render
  const smallClocks = React.useMemo(() => {
    // Only generate clocks if we're in the browser and have viewport size
    if (typeof window !== 'undefined' && viewportSize) {
      return generateClocks();
    }
    return [];
  }, [viewportSize?.width, viewportSize?.height, smallClockCount, mainClockSize]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
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

export default ClockCollection;