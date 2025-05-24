"use client";

import React, { useEffect, useState } from 'react';
import AnalogClock from './AnalogClock';

interface ClockCollectionProps {
  mainClockSize?: number;
  smallClockCount?: number;
  onReady?: () => void;
}

const ClockCollection = ({ 
  mainClockSize = 400, 
  smallClockCount = 20,
  onReady
}: ClockCollectionProps) => {
  // Initialize with null to avoid hydration mismatch
  const [viewportSize, setViewportSize] = useState<{ width: number, height: number } | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  // Set viewport size only once on mount
  useEffect(() => {
    if (!isInitialized && typeof window !== 'undefined') {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Call onReady when component is fully initialized
  useEffect(() => {
    if (isInitialized && viewportSize && onReady) {
      // Small delay to ensure all initialization is complete
      const timer = setTimeout(() => {
        onReady();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isInitialized, viewportSize, onReady]);

  // Calculate responsive sizes based on viewport
  const getResponsiveSizes = () => {
    if (!viewportSize) return { mainSize: mainClockSize, smallCount: smallClockCount };
    
    const { width, height } = viewportSize;
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;
    
    let responsiveMainSize = mainClockSize;
    let responsiveSmallCount = smallClockCount;
    
    if (isMobile) {
      // Mobile: smaller main clock, fewer small clocks
      responsiveMainSize = Math.min(mainClockSize * 0.6, width * 0.7, height * 0.4);
      responsiveSmallCount = Math.max(6, Math.floor(smallClockCount * 0.3));
    } else if (isTablet) {
      // Tablet: medium adjustments
      responsiveMainSize = Math.min(mainClockSize * 0.8, width * 0.5, height * 0.5);
      responsiveSmallCount = Math.max(10, Math.floor(smallClockCount * 0.6));
    } else {
      // Desktop: use original size but cap at viewport
      responsiveMainSize = Math.min(mainClockSize, width * 0.4, height * 0.6);
    }
    
    return { 
      mainSize: Math.max(200, responsiveMainSize), // Minimum size
      smallCount: responsiveSmallCount 
    };
  };

  // Generate clock positions and sizes with varied distribution
  const generateClocks = () => {
    const clocks = [];
    const { mainSize, smallCount } = getResponsiveSizes();
    const safeZone = mainSize * 0.6; // Adjusted safe zone
    
    // Use default values if viewportSize is null (during SSR)
    const width = viewportSize?.width || 1200;
    const height = viewportSize?.height || 800;
    
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;
    
    // Calculate available space more accurately
    const margin = isMobile ? 20 : isTablet ? 40 : 60;
    const maxX = (width - margin * 2) / 2;
    const maxY = (height - margin * 2) / 2;
    
    // Responsive size ranges
    let sizes;
    if (isMobile) {
      sizes = [
        { min: 40, max: 60, weight: 0.5 },   // Smaller clocks for mobile
        { min: 60, max: 80, weight: 0.3 },   
        { min: 80, max: 100, weight: 0.2 }   
      ];
    } else if (isTablet) {
      sizes = [
        { min: 50, max: 80, weight: 0.4 },   
        { min: 80, max: 110, weight: 0.4 },  
        { min: 110, max: 140, weight: 0.2 }  
      ];
    } else {
      sizes = [
        { min: 60, max: 90, weight: 0.3 },   // Small clocks
        { min: 90, max: 130, weight: 0.4 },  // Medium clocks
        { min: 130, max: 180, weight: 0.2 }, // Large clocks
        { min: 180, max: 220, weight: 0.1 }  // Extra large clocks
      ];
    }
    
    // Define zones for better distribution - adjusted for mobile
    const zoneMultiplier = isMobile ? 0.4 : isTablet ? 0.5 : 0.6;
    const zones = [
      { name: 'top-left', centerX: -maxX * zoneMultiplier, centerY: -maxY * zoneMultiplier, radius: maxX * 0.3 },
      { name: 'top-right', centerX: maxX * zoneMultiplier, centerY: -maxY * zoneMultiplier, radius: maxX * 0.3 },
      { name: 'bottom-left', centerX: -maxX * zoneMultiplier, centerY: maxY * zoneMultiplier, radius: maxX * 0.3 },
      { name: 'bottom-right', centerX: maxX * zoneMultiplier, centerY: maxY * zoneMultiplier, radius: maxX * 0.3 },
      { name: 'top', centerX: 0, centerY: -maxY * 0.6, radius: maxX * 0.25 },
      { name: 'bottom', centerX: 0, centerY: maxY * 0.6, radius: maxX * 0.25 },
      { name: 'left', centerX: -maxX * 0.6, centerY: 0, radius: maxY * 0.25 },
      { name: 'right', centerX: maxX * 0.6, centerY: 0, radius: maxY * 0.25 },
      { name: 'anywhere', centerX: 0, centerY: 0, radius: Math.max(maxX, maxY) * 0.8 }
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
    const isOverlapping = (x1: number, y1: number, r1: number, x2: number, y2: number, r2: number, padding: number = isMobile ? 10 : 15) => {
      const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
      return distance < (r1 + r2 + padding);
    };
    
    // Generate positions for small clocks with varied distribution
    let clocksPerZone = Math.ceil(smallCount / zones.length);
    
    for (let zoneIndex = 0; zoneIndex < zones.length && clocks.length < smallCount; zoneIndex++) {
      const zone = zones[zoneIndex];
      let clocksInThisZone = 0;
      const maxClocksInZone = Math.min(clocksPerZone, smallCount - clocks.length);
      
      for (let attempt = 0; attempt < 50 && clocksInThisZone < maxClocksInZone; attempt++) {
        const size = getRandomSize();
        const radius = size / 2;
        
        let x, y, distanceFromCenter;
        let validPosition = false;
        let positionAttempts = 0;
        
        while (!validPosition && positionAttempts < 30) {
          if (zone.name === 'anywhere') {
            // Random position anywhere
            const spreadMultiplier = isMobile ? 1.2 : 1.8;
            x = (Math.random() - 0.5) * maxX * spreadMultiplier;
            y = (Math.random() - 0.5) * maxY * spreadMultiplier;
          } else {
            // Position within zone with some randomness
            const angle = Math.random() * Math.PI * 2;
            const distanceFromZoneCenter = Math.random() * zone.radius;
            x = zone.centerX + Math.cos(angle) * distanceFromZoneCenter;
            y = zone.centerY + Math.sin(angle) * distanceFromZoneCenter;
            
            // Add some extra randomness - less on mobile
            const randomness = isMobile ? 50 : 100;
            x += (Math.random() - 0.5) * randomness;
            y += (Math.random() - 0.5) * randomness;
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
          
          // Check if clock would be too close to screen edges - more restrictive on mobile
          const edgeBuffer = isMobile ? 0.85 : 0.95;
          if (Math.abs(x) + radius > maxX * edgeBuffer || Math.abs(y) + radius > maxY * edgeBuffer) {
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
    while (clocks.length < smallCount) {
      const size = getRandomSize();
      const radius = size / 2;
      
      let x, y, distanceFromCenter;
      let validPosition = false;
      let attempts = 0;
      
      while (!validPosition && attempts < 50) {
        const spreadMultiplier = isMobile ? 1.2 : 1.6;
        x = (Math.random() - 0.5) * maxX * spreadMultiplier;
        y = (Math.random() - 0.5) * maxY * spreadMultiplier;
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
        
        const edgeBuffer = isMobile ? 0.85 : 0.95;
        if (Math.abs(x) + radius > maxX * edgeBuffer || Math.abs(y) + radius > maxY * edgeBuffer) {
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

  // Generate clocks only once on initial load - never re-render until page refresh
  const { smallClocks, mainSize } = React.useMemo(() => {
    // Only generate clocks if we're in the browser and have initial viewport size
    if (isInitialized && viewportSize) {
      const { mainSize } = getResponsiveSizes();
      return {
        smallClocks: generateClocks(),
        mainSize
      };
    }
    return { smallClocks: [], mainSize: mainClockSize };
  }, [isInitialized, viewportSize !== null]); // Only depends on initialization state

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
          size={mainSize} 
          hourHandThickness={mainSize / 100}
          minuteHandThickness={mainSize / 150}
          secondHandThickness={mainSize / 200}
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